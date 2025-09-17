// Obtener elementos del DOM
const searchBox = document.getElementById("search-box");
const resultadosDiv = document.getElementById("resultados");

// Función para buscar en Open Library
async function buscarOpenLibrary(query) {
  const queries = [query, query.toLowerCase().replace("seis de cuervos", "six of crows")];
  const results = [];

  for (const q of queries) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Error Open Library:", response.status);
        continue;
      }
      const data = await response.json();
      if (data.docs) {
        results.push(...data.docs.map(libro => ({
          titulo: libro.title,
          autor: libro.author_name ? libro.author_name.join(", ") : "Desconocido"
        })));
      }
    } catch (error) {
      console.error("Error fetch Open Library:", error);
    }
  }

  return results.filter((libro, index, self) =>
    index === self.findIndex(l => l.titulo === libro.titulo && l.autor === libro.autor)
  ).slice(0, 10);
}

// Función principal para buscar libros locales + Open Library
async function buscar() {
  const query = searchBox.value.trim();
  resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

  if (!query) {
    resultadosDiv.style.display = "none"; // Ocultar dropdown si input vacío
    return;
  }

  try {
    // Buscar libros locales
    let localLibros = [];
    try {
      const response = await fetch(`http://127.0.0.1:8000/buscar?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        localLibros = (data && data.libros) ? data.libros : [];
      }
    } catch (error) {
      console.error("Error API local:", error);
    }

    // Buscar libros en Open Library
    const openLibros = await buscarOpenLibrary(query);

    // Combinar y filtrar duplicados
    const resultados = [...localLibros, ...openLibros].filter(
      (libro, index, self) =>
        index === self.findIndex(l => l.titulo === libro.titulo && l.autor === libro.autor)
    );

    if (resultados.length === 0) {
      const item = document.createElement("div");
      item.textContent = "No se encontraron resultados";
      item.classList.add("dropdown-item", "no-results");
      resultadosDiv.appendChild(item);
      resultadosDiv.style.display = "block";
      return;
    }

    // Crear los elementos del dropdown
    resultados.forEach((libro, index) => {
      const item = document.createElement("div");
      item.textContent = `${libro.titulo} - ${libro.autor} ${index < localLibros.length ? "(Local)" : "(Open Library)"}`;
      item.classList.add("dropdown-item");
      item.addEventListener("click", () => {
        searchBox.value = libro.titulo;
        resultadosDiv.style.display = "none";
      });
      resultadosDiv.appendChild(item);
    });

    resultadosDiv.style.display = "block"; // Mostrar dropdown

  } catch (error) {
    console.error("Error general:", error);
    resultadosDiv.style.display = "none";
  }
}

// Buscar mientras escribes (con debounce)
let timeoutId;
searchBox.addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(buscar, 300);
});

// Buscar al presionar Enter
searchBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    resultadosDiv.style.display = "none";
    buscar();
  }
});

// Cerrar dropdown si se hace click fuera
document.addEventListener("click", (event) => {
  if (!event.target.closest(".buscador")) {
    resultadosDiv.style.display = "none";
  }
});