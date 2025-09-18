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
    {"titulo": "El camino de los reyes", "autor": "Brandon Sanderson", "anio": 2010},
    {"titulo": "La rueda del tiempo", "autor": "Robert Jordan", "anio": 1990},
    {"titulo": "1984", "autor": "George Orwell", "anio": 1949},
    {"titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "anio": 1967}, 
    {"titulo": "Don Quijote de la Mancha", "autor": "Miguel de Cervantes", "anio": 1605},
    {"titulo": "La sombra del viento", "autor": "Carlos Ruiz Zafón", "anio": 2001},
    {"titulo": "El alquimista", "autor": "Paulo Coelho", "anio": 1988},
    {"titulo": "Fahrenheit 451", "autor": "Ray Bradbury", "anio": 1953},
    {"titulo": "Matar a un ruiseñor", "autor": "Harper Lee", "anio": 1960},
    {"titulo": "El conde de Montecristo", "autor": "Alexandre Dumas", "anio": 1844},
    {"titulo": "Los juegos del hambre", "autor": "Suzanne Collins", "anio": 2008},
    {"titulo": "Harry Potter y la piedra filosofal", "autor": "J.K. Rowling", "anio": 1997},
    {"titulo": "El señor de los anillos", "autor": "J.R.R. Tolkien", "anio": 1954},
    {"titulo": "Asistente del villano", "autor": "Hannah Nicole Maehrer", "anio": 2023},
    {"titulo": "Los seis de Atlas", "autor": "Olivie Blake", "anio": 2022},
    {"titulo": "Nuncanoche", "autor": "Jay Kristoff", "anio": 2018},
    {"titulo": "El príncipe cruel", "autor": "Holly Black", "anio": 2018},
    {"titulo": "Cazadores de sombras", "autor": "Cassandra Clare", "anio": 2007},
    {"titulo": "La odisea", "autor": "Homero", "anio": -800},
]

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
