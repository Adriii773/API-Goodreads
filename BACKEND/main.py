from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException
import os
import csv
import books.book 
from books.book import generar_id_csv , cargar_libros

app = FastAPI ()

# Configuración de CORS
origins = [
    "http://127.0.0.1:5500",  # frontend
    "http://localhost:5500"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Book(BaseModel):
    titulo: str
    autor: str
    anio: str

books_storage = []

@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

# Endpoint para buscar libros

@app.get("/buscar")
def buscar(texto: str):
    resultados = books.book.search_books(texto)     
    return {"resultados": resultados}

# Endpoint para añadir libros a una balda específica (ampliamos a más de 10 si es necesario)

@app.post("/libros/{balda_id}")
def agregar_libro_balda(balda_id: int, libro: Book):
    if not (1 <= balda_id <= 20):  # Aumentamos el límite para permitir más baldas
        raise HTTPException(status_code=400, detail="Balda inválida")
    
    if not libro.titulo.strip():
        raise HTTPException(status_code=400, detail="Título del libro requerido")
    
    nombre_csv = f"balda{balda_id}.csv"
    nuevo_id = generar_id_csv(nombre_csv)

    # Preparamos el libro como lista
    libro_data = [
        nuevo_id,  # Generamos un ID simple
        libro.titulo,
        libro.autor,
        libro.anio,
    ]

    # Guardamos en un CSV distinto, ej. balda1.csv
    books.book.add_books([libro_data], nombre_csv) 
    cargar_libros()  # recargamos los libros en memoria (opcional, ya que no afecta el catálogo principal)

    return {"message": f"Libro añadido a balda {balda_id}", "libro": libro}

# Endpoint para obtener libros de una balda específica

@app.get("/libros/balda/{balda_id}")
def obtener_libros_balda(balda_id: int):
    nombre_csv = f"balda{balda_id}.csv"
    if not os.path.isfile(nombre_csv):
        return {"libros": []}  # si no existe, devolvemos vacío

    libros = []
    with open(nombre_csv, mode="r", encoding="utf-8") as file:
        lector = csv.DictReader(file)
        for fila in lector:
            titulo = fila.get("titulo", "").strip()
            if titulo:  # sólo agregamos si hay título (evita entradas vacías/duplicados erróneos)
                libros.append({
                    "id": fila.get("id", ""),
                    "titulo": titulo,
                    "autor": fila.get("autor", "").strip(),
                    "anio": fila.get("anio", "").strip()
                })
    return {"libros": libros}


# Endpoint para eliminar libros de una balda específica

@app.delete("/libros/balda/{balda_id}/{libro_id}")  
def eliminar_libro_de_balda(balda_id: int, libro_id: str):
    books.book.eliminar_libro_balda(balda_id, libro_id)
    return {"message": "Libro eliminado de la balda"}

# (El resto del código en books/book.py permanece igual, pero asegúrate de que eliminar_libro_balda no agregue entradas vacías)