from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI ()

@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

# Configuración de CORS
origins = [
    "http://127.0.0.1:5500",  # frontend
    "http://localhost:5500"
]


libros = [
    {"titulo": "El nombre del viento", "autor": "Patrick Rothfuss"},
    {"titulo": "El camino de los reyes", "autor": "Brandon Sanderson"},
    {"titulo": "La rueda del tiempo", "autor": "Robert Jordan"},
    {"titulo": "1984", "autor": "George Orwell"},
    {"titulo": "Cien años de soledad", "autor": "Gabriel García Márquez"}, 
    {"titulo": "Don Quijote de la Mancha", "autor": "Miguel de Cervantes"},
    {"titulo": "La sombra del viento", "autor": "Carlos Ruiz Zafón"},
    {"titulo": "El alquimista", "autor": "Paulo Coelho"},
    {"titulo": "Fahrenheit 451", "autor": "Ray Bradbury"},
    {"titulo": "Matar a un ruiseñor", "autor": "Harper Lee"}
]

@app.get("/buscar")
def buscar(q: str):
    resultados = [
        libro for libro in libros 
        if q.lower() in libro["titulo"].lower() or q.lower() in libro["autor"].lower()
    ]
    return {"libros": resultados}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # puerto donde está tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

