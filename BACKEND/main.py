from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException
import os
import csv
import books.book

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

@app.get("/buscar")
def buscar(texto: str):
    resultados = books.book.search_books(texto)     
    return {"resultados": resultados}

@app.post("/libros/{balda_id}")
def agregar_libro_balda(balda_id: int, libro: Book):
    if not (1 <= balda_id <= 10):
        raise HTTPException(status_code=400, detail="Balda inválida")

    # Preparamos el libro como lista
    libro_data = [
        libro.titulo,
        libro.autor,
        libro.anio,
    ]

    # Guardamos en un CSV distinto, ej. balda1.csv
    nombre_csv = f"balda{balda_id}.csv"
    books.book.add_books([libro_data], nombre_csv)  

    return {"message": f"Libro añadido a balda {balda_id}", "libro": libro}


@app.get("/libros/balda/{balda_id}")
def obtener_libros_balda(balda_id: int):
    nombre_csv = f"balda{balda_id}.csv"
    if not os.path.isfile(nombre_csv):
        return {"libros": []}  # si no existe, devolvemos vacío

    libros = []
    with open(nombre_csv, mode="r", encoding="utf-8") as file:
        lector = csv.DictReader(file)
        for fila in lector:
            libros.append({
                "titulo": fila.get("titulo", ""),
                "autor": fila.get("autor", ""),
                "anio": fila.get("anio", "")
            })
    return {"libros": libros}




