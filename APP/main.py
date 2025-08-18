from fastapi import FastAPI         #importamos FastAPI

app = FastAPI()                     #instanciamos la aplicación

@app.get("/")                       
def read_root():
    return { "CUACK CUACK"}