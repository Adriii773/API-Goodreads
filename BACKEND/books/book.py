import csv
import os
from pydantic import BaseModel
from fastapi import HTTPException

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVO_CSV = os.path.join(BASE_DIR, "LIBROS.csv")

# Carpeta para los CSV de las baldas
BALDAS_DIR = os.path.join(BASE_DIR, "baldas")
if not os.path.exists(BALDAS_DIR):
    os.makedirs(BALDAS_DIR)

LIBROS = []

# ----------------------
# FUNCIÓN PARA AÑADIR LIBROS
# ----------------------
def add_books(libros, archivo_csv=None):
    archivo_libros_csv = archivo_csv if archivo_csv else ARCHIVO_CSV

    archivo_existe = os.path.isfile(archivo_libros_csv)
    libros_existentes = set()

    if archivo_existe:
        with open(archivo_libros_csv, mode="r", encoding="utf-8") as file:
            lector = csv.DictReader(file)
            for fila in lector:
                libros_existentes.add((fila["id"], fila["titulo"], fila["autor"], fila["anio"]))

    with open(archivo_libros_csv, mode="a", newline="", encoding="utf-8") as file:
        escritor = csv.DictWriter(file, fieldnames=["id", "titulo", "autor", "anio"])
        if not archivo_existe or os.path.getsize(archivo_libros_csv) == 0:
            escritor.writeheader()

        for libro in libros:
            clave = (libro[0], libro[1], libro[2], str(libro[3]))
            if clave not in libros_existentes:
                escritor.writerow({
                    "id": libro[0],
                    "titulo": libro[1],
                    "autor": libro[2],
                    "anio": libro[3],
                })
                libros_existentes.add(clave)

# ----------------------
# FUNCIÓN PARA CARGAR LIBROS
# ----------------------
def cargar_libros():
    global LIBROS
    if not os.path.isfile(ARCHIVO_CSV):
        print("CSV no encontrado:", ARCHIVO_CSV)
        return

    with open(ARCHIVO_CSV, mode="r", encoding="utf-8") as file:
        lector = csv.DictReader(file)
        LIBROS = []
        for fila in lector:
            libro = {
                "id": fila.get("id", "").strip(),
                "titulo": fila.get("titulo", "").strip(),
                "autor": fila.get("autor", "").strip(),
                "anio": str(fila.get("anio", "")).strip(),
            }
            if libro["titulo"]:
                LIBROS.append(libro)
    print("Libros cargados:", LIBROS)

# ----------------------
# FUNCIÓN PARA BUSCAR LIBROS
# ----------------------
def search_books(texto):
    texto = texto.lower()
    resultados = [
        libro for libro in LIBROS
        if texto in libro["titulo"].lower() or texto in libro["autor"].lower()
    ]
    return resultados

# ----------------------
# FUNCIÓN PARA GENERAR ID
# ----------------------
def generar_id_csv(nombre_id: str, nombre_csv: str):
    if not os.path.exists(nombre_csv):
        return "1"
    
    with open(nombre_csv, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        ids = []
        for row in reader:
            val = row.get(nombre_id, "").strip()  # eliminar espacios
            if val.isdigit():
                ids.append(int(val))
    
    return str(max(ids) + 1) if ids else "1"

# ----------------------
# FUNCIÓN PARA ELIMINAR LIBRO DE UNA BALDA
# ----------------------
def eliminar_libro_balda(balda_id, libro_id):
    nombre_csv = os.path.join(BALDAS_DIR, f"balda{balda_id}.csv")

    if not os.path.isfile(nombre_csv):
        raise HTTPException(status_code=404, detail="Balda no encontrada")

    libros = []
    with open(nombre_csv, mode="r", encoding="utf-8") as file:
        lector = csv.DictReader(file)
        for fila in lector:
            if fila.get("id", "") != libro_id:
                libros.append(fila)

    with open(nombre_csv, mode="w", newline="", encoding="utf-8") as file:
        escritor = csv.DictWriter(file, fieldnames=["id", "titulo", "autor", "anio"])
        escritor.writeheader()
        for libro in libros:
            escritor.writerow(libro)

    cargar_libros()


class Book(BaseModel):
    titulo: str
    autor: str
    anio: str

books_storage = []

class Balda(BaseModel):
    nombre: str                         

# -----------------------------------------
# FUNCIÓN PARA AGREGAR UN LIBRO A UNA BALDA
# -----------------------------------------
def agregar_libro_balda(balda_id: int, libro: Book):
    if not (1 <= balda_id <= 20):
        raise HTTPException(status_code=400, detail="Balda inválida")
    if not libro.titulo.strip():
        raise HTTPException(status_code=400, detail="Título del libro requerido")

    nombre_csv = os.path.join(BALDAS_DIR, f"balda{balda_id}.csv")
    nuevo_id = generar_id_csv("id", nombre_csv)
    libro_data = [nuevo_id, libro.titulo, libro.autor, libro.anio]
    add_books([libro_data], nombre_csv)


# -----------------------------------------
# FUNCIÓN PARA AGREGAR UN LIBRO A UNA BALDA
# -----------------------------------------
def obtener_libros_balda(balda_id: int):
    nombre_csv = os.path.join(BALDAS_DIR, f"balda{balda_id}.csv")
    if not os.path.isfile(nombre_csv):
        return {"libros": []}

    libros = []
    with open(nombre_csv, mode="r", encoding="utf-8") as file:
        lector = csv.DictReader(file)
        for fila in lector:
            titulo = fila.get("titulo", "").strip()
            if titulo:
                libros.append({
                    "id": fila.get("id", ""),
                    "titulo": titulo,
                    "autor": fila.get("autor", "").strip(),
                    "anio": fila.get("anio", "").strip()
                })
    return {"libros": libros}


# ------------------------------
# FUNCIÓN PARA AÑADIR UNA BALDA
# ------------------------------
def agregar_balda(balda_id: int, nombre_balda: str, nombre_csv: str):

    archivo_existe = os.path.isfile(nombre_csv)

    baldas_existentes = set()

    if archivo_existe:
        with open(nombre_csv, mode = "r", encoding = "utf-8") as file:
            lector = csv.DictReader(file)
            for fila in lector:
                baldas_existentes.add((fila["balda_id"].strip(), fila["nombre_balda"].strip()))


    with open(nombre_csv, mode="a", newline = "", encoding = "utf-8") as file:
        escritor = csv.DictWriter(file, fieldnames = ["balda_id", "nombre_balda"])
        if not archivo_existe:
            escritor.writeheader()

        clave = (str(balda_id).strip(), nombre_balda.strip())
        if clave not in baldas_existentes:
            escritor.writerow({
                "balda_id": str(balda_id).strip(),
                "nombre_balda": nombre_balda.strip()
            })
            baldas_existentes.add(clave)

# ----------------------
# MIS LIBROS INICIALES
# ----------------------
mis_libros = [
    ["1","Asistente del villano", "Hannah Nicole Maehrer", 2023],
    ["2","Los seis de Atlas", "Olivie Blake", 2022],
    ["3","El juego del alma", "Carlos Ruiz Zafón", 2020],
    ["4","Nuncanoche", "Jay Kristoff", 2018],
    ["5","El príncipe cruel", "Holly Black", 2018 ],
    ["6","Cazadores de sombras", "Cassandra Clare", 2007 ],
    ["7","El nombre del viento", "Patrick Rothfuss", 2007 ],
    ["8","El temor de un hombre sabio", "Patrick Rothfuss", 2011 ],
    ["9","La voz de las espadas", "Joe Abercrombie", 2006 ],
    ["10","El camino de los reyes", "Brandon Sanderson", 2010 ],
    ["11","Palabras radiantes", "Brandon Sanderson", 2014 ],
    ["12","Juramentada", "Brandon Sanderson", 2017],
    ["13","El ritmo de la guerra", "Brandon Sanderson", 2020 ],
    ["14","Viento y verdad", "Brandon Sanderson", 2017 ],
    ["15","Una corte de niebla y furia", "Sarah J Maas", 2017 ]
]

add_books(mis_libros)
cargar_libros()
print("Libros cargados:", LIBROS)
resultados = search_books("Sanderson")
print("Resultados búsqueda:", resultados)
