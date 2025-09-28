from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import csv
import books.book  # Import the module
from books.book import generar_id_csv, cargar_libros, agregar_libro_balda, obtener_libros_balda, eliminar_libro_balda, add_books, search_books

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BALDAS_DIR = os.path.join(BASE_DIR, "baldas")

# Create the directory if it doesn't exist (fixes potential 500 errors on file write)
if not os.path.exists(BALDAS_DIR):
    os.makedirs(BALDAS_DIR)

# CORS configuration
origins = [
    "http://127.0.0.1:5500",  # Frontend origin
    "http://localhost:5500",  # Alternative localhost
    "*"  # Temporary wildcard for testing; remove for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the full origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Book model
class Book(BaseModel):
    titulo: str
    autor: str
    anio: str

# Balda model
class Balda(BaseModel):
    nombre_balda: str

# Test endpoint
@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

# Search books endpoint
@app.get("/buscar")
def buscar(texto: str):
    resultados = search_books(texto)
    return {"resultados": resultados}

# Add book to balda endpoint
@app.post("/libros/{balda_id}")
def end_agregar_libro_balda(balda_id: int, libro: Book):
    agregar_libro_balda(balda_id, libro)
    return {"message": "Libro añadido correctamente"}

# Get books from balda endpoint
@app.get("/libros/balda/{balda_id}")
def end_obtener_libros_balda(balda_id: int):
    resultado = obtener_libros_balda(balda_id)
    return resultado

# Delete book from balda endpoint
@app.delete("/libros/balda/{balda_id}/{libro_id}")
def eliminar_libro_de_balda(balda_id: int, libro_id: str):
    eliminar_libro_balda(balda_id, libro_id)
    return {"message": "Libro eliminado de la balda"}

# Add balda endpoint with error handling
@app.post("/baldas")
def end_agregar_balda(balda: Balda):
    try:
        nombre_csv = os.path.join(BALDAS_DIR, "registro_baldas.csv")
        balda_id = int(generar_id_csv("balda_id", nombre_csv))
        books.book.agregar_balda(balda_id, balda.nombre_balda, nombre_csv)
        return {"id": balda_id, "nombre_balda": balda.nombre_balda}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding balda: {str(e)}")