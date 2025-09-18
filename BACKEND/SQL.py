import sqlite3

# 1️⃣ Conectar a la base de datos (si no existe, la crea)
conn = sqlite3.connect("libros.db")
cursor = conn.cursor()

# 2️⃣ Crear la tabla si no existe (sin ISBN, como hicimos antes)
cursor.execute("""
CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT,
    anio INTEGER
)
""")

# 3️⃣ Lista de libros a insertar
libros_para_insertar = [
    {"titulo": "Seis de cuervos", "autor": "Leigh Bardugo", "anio": 2015},
    {"titulo": "Sombra y Hueso", "autor": "Leigh Bardugo", "anio": 2012},
    {"titulo": "El nombre del viento", "autor": "Patrick Rothfuss", "anio": 2007},
    {"titulo": "Los juegos del hambre", "autor": "Suzanne Collins", "anio": 2008},
    

# 4️⃣ Insertar libros automáticamente
for libro in libros_para_insertar:
    cursor.execute(
        "INSERT INTO libros (titulo, autor, anio) VALUES (?, ?, ?)",
        (libro["titulo"], libro["autor"], libro["anio"])
    )

# 5️⃣ Guardar los cambios y cerrar la conexión
conn.commit()
conn.close()

print("¡Libros insertados correctamente!")
