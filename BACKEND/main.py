from fastapi import FastAPI

app = FastAPI ()

@app.get("/")
def raiz():
    return {"Mi backend esta listo"}

@app.get("/buscar")
def buscar(p: str):
    return {"libros":[{"titulo":"El camino de los reyes, autor: Brandon Sanderson"}]}