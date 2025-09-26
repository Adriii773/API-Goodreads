from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import books.book

app = FastAPI ()

@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

# Configuración de CORS
origins = [
    "http://127.0.0.1:5500",  # frontend
    "http://localhost:5500"
]


@app.get("/buscar")
def buscar(texto: str):
    resultados = books.book.search_books(texto)     
    return {"resultados": resultados}





app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
