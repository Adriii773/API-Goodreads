import csv
import os

from fastapi import HTTPException

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVO_CSV = os.path.join(BASE_DIR, "LIBROS.csv")

LIBROS = []

def add_books(libros, archivo_csv=None):
    archivo_libros_csv = archivo_csv if archivo_csv else ARCHIVO_CSV


    # comprobamos que existe el archivo
    archivo_existe = os.path.isfile(archivo_libros_csv)

    libros_existentes = set()

    if archivo_existe:
        with open(archivo_libros_csv, mode="r", encoding="utf-8") as file:
            lector = csv.DictReader(file)
            for fila in lector: 
                libros_existentes.add((fila["id"], fila["titulo"], fila["autor"], fila["anio"]))

    with open(archivo_libros_csv, mode="a", newline="", encoding="utf-8") as file:
        escritor = csv.DictWriter(file, fieldnames=["id", "titulo", "autor", "anio"])

        # escribimos la cabecera solo si el archivo no existía o estaba vacío
        if not archivo_existe or os.path.getsize(archivo_libros_csv) == 0:
            escritor.writeheader()

        # añadimos todos los libros
        for libro in libros:
            clave = (libro[0],libro[1], libro[2], str(libro[3]))
            if clave not in libros_existentes:
                escritor.writerow({
                    "id": libro[0],
                    "titulo": libro[1],
                    "autor": libro[2],
                    "anio": libro[3],
                })
                libros_existentes.add(clave)
                

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
            if libro["titulo"]:  # sólo agregamos si hay título
                LIBROS.append(libro)

    print("Libros cargados:", LIBROS)




def search_books(texto):
    texto = texto.lower()
    resultados = [
        libro for libro in LIBROS
        if texto in libro["titulo"].lower() or texto in libro["autor"].lower()
    ]
    return resultados

# Generar un nuevo ID único para un nuevo libro

def generar_id_csv(nombre_csv):
    if not os.path.exists(nombre_csv):
        return "1"  # primer libro

    with open(nombre_csv, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        ids = [int(row["id"]) for row in reader if row["id"].isdigit()]

    return str(max(ids) + 1) if ids else "1"


# función para eliminar libros de una balda específica

def eliminar_libro_balda(balda_id, libro_id):

    nombre_csv = f"balda{balda_id}.csv"

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


# def clear_books():
#     global LIBROS
#     LIBROS = []
#     if os.path.isfile(ARCHIVO_CSV):
        


# =========================
# TODOS LOS LIBROS CON PORTADAS
# =========================
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

# añadir y cargar
add_books(mis_libros)
cargar_libros()

# mostrar
print("Libros cargados:", LIBROS)

# ejemplo de búsqueda
resultados = search_books("Sanderson")
print("Resultados búsqueda:", resultados)


