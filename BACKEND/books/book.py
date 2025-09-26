import csv
import os

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
                libros_existentes.add((fila["titulo"], fila["autor"], fila["anio"]))

    with open(archivo_libros_csv, mode="a", newline="", encoding="utf-8") as file:
        escritor = csv.DictWriter(file, fieldnames=["titulo", "autor", "anio", "portada"])

        # escribimos la cabecera solo si el archivo no existía o estaba vacío
        if not archivo_existe or os.path.getsize(archivo_libros_csv) == 0:
            escritor.writeheader()

        # añadimos todos los libros
        for libro in libros:
            clave = (libro[0], libro[1], str(libro[2]))
            if clave not in libros_existentes:
                escritor.writerow({
                    "titulo": libro[0],
                    "autor": libro[1],
                    "anio": libro[2],
                    "portada": libro[3] if len(libro) > 3 else ""
                })
                libros_existentes.add(clave)
                

def cargar_libros():
    global LIBROS
    if not os.path.isfile(ARCHIVO_CSV):
        print("CSV no encontrado:", ARCHIVO_CSV)
        return

    with open(ARCHIVO_CSV, mode="r", encoding="utf-8-sig") as file:
        lector = csv.DictReader(file)
        LIBROS = []

        for fila in lector:
            libro = {
                "titulo": fila.get("titulo", "").strip(),
                "autor": fila.get("autor", "").strip(),
                "anio": str(fila.get("anio", "")).strip(),
                "portada": fila.get("portada", "").strip()
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




# def clear_books():
#     global LIBROS
#     LIBROS = []
#     if os.path.isfile(ARCHIVO_CSV):
        


# =========================
# TODOS LOS LIBROS CON PORTADAS
# =========================
mis_libros = [
    ["Asistente del villano", "Hannah Nicole Maehrer", 2023, "https://m.media-amazon.com/images/I/81rFh6mP1LL._AC_UF1000,1000_QL80_.jpg"],
    ["Los seis de Atlas", "Olivie Blake", 2022, "https://m.media-amazon.com/images/I/81ONw88etdL._AC_UF1000,1000_QL80_.jpg"],
    ["El juego del alma", "Carlos Ruiz Zafón", 2020, "https://m.media-amazon.com/images/I/91bZkTfG7iL._AC_UF1000,1000_QL80_.jpg"],
    ["Nuncanoche", "Jay Kristoff", 2018, "https://m.media-amazon.com/images/I/81eY6B2XyFL._AC_UF1000,1000_QL80_.jpg"],
    ["El príncipe cruel", "Holly Black", 2018, "https://m.media-amazon.com/images/I/71J3M+j8vDL._AC_UF1000,1000_QL80_.jpg"],
    ["Cazadores de sombras", "Cassandra Clare", 2007, "https://m.media-amazon.com/images/I/81thAq0H2lL._AC_UF1000,1000_QL80_.jpg"],
    ["El nombre del viento", "Patrick Rothfuss", 2007, "https://m.media-amazon.com/images/I/81Hsjp9ZQJL._AC_UF1000,1000_QL80_.jpg"],
    ["El temor de un hombre sabio", "Patrick Rothfuss", 2011, "https://m.media-amazon.com/images/I/91oUbMuMkbL._AC_UF1000,1000_QL80_.jpg"],
    ["La voz de las espadas", "Joe Abercrombie", 2006, "https://m.media-amazon.com/images/I/81j-JcEkChL._AC_UF1000,1000_QL80_.jpg"],
    ["El camino de los reyes", "Brandon Sanderson", 2010, "https://sarasvatilibreria.com/cdn/shop/products/el-camino-de-los-reyes-el-archivo-de-las-tormentas-i-brandon-sanderson-792944.jpg?v=1710174526"],
    ["Palabras radiantes", "Brandon Sanderson", 2014, "https://m.media-amazon.com/images/I/91UgV6gUtyL._AC_UF1000,1000_QL80_.jpg"],
    ["Juramentada", "Brandon Sanderson", 2017, "https://m.media-amazon.com/images/I/81R9Aa3KDyL._AC_UF1000,1000_QL80_.jpg"],
    ["El ritmo de la guerra", "Brandon Sanderson", 2020, "https://m.media-amazon.com/images/I/91CKEQ3QoPL._AC_UF1000,1000_QL80_.jpg"],
    ["Viento y verdad", "Brandon Sanderson", 2017, "https://m.media-amazon.com/images/I/71pVPlM5lLL._AC_UF1000,1000_QL80_.jpg"],
    ["Una corte de niebla y furia", "Sarah J Maas", 2017, "https://m.media-amazon.com/images/I/81Y5I+jrX+L._AC_UF1000,1000_QL80_.jpg"]
]

# añadir y cargar
add_books(mis_libros)
cargar_libros()

# mostrar
print("Libros cargados:", LIBROS)

# ejemplo de búsqueda
resultados = search_books("Sanderson")
print("Resultados búsqueda:", resultados)


