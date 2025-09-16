from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI ()

@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

@app.get("/buscar")
def buscar(q: str):
    return {"libros":[{"titulo":"El camino de los reyes, autor: Brandon Sanderson"}]}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # puerto donde está tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)