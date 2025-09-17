// Obtener elementos del DOM
const searchBox = document.getElementById("search-box");
const resultadosDiv = document.getElementById("resultados");

// Función para buscar libros en la API
async function buscar() {
  const query = searchBox.value.trim();
  resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

  if (!query) {
    resultadosDiv.style.display = "none"; // Ocultar dropdown si input vacío
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/buscar?q=${encodeURIComponent(query)}`);

    // Comprobar si la respuesta es correcta
    if (!response.ok) {
      console.error("Error en la API:", response.status);
      resultadosDiv.style.display = "none";
      return;
    }

    const data = await response.json();

    if (!data.libros || data.libros.length === 0) {
      resultadosDiv.style.display = "none"; // Nada que mostrar
      return;
    }

    // Crear los elementos del dropdown
    data.libros.forEach(libro => {
      const item = document.createElement("div");
      item.textContent = `${libro.titulo} - ${libro.autor}`;
      item.classList.add("dropdown-item"); // Agregar clase para estilos

      // Al hacer click, rellenar input y cerrar dropdown
      item.addEventListener("click", () => {
        searchBox.value = libro.titulo;
        resultadosDiv.style.display = "none";
      });

      resultadosDiv.appendChild(item);
    });

    resultadosDiv.style.display = "block"; // Mostrar dropdown

  } catch (error) {
    console.error("Error al hacer fetch:", error);
    resultadosDiv.style.display = "none";
  }
}

// Buscar mientras escribes (con debounce para evitar muchas peticiones)
let timeoutId;
searchBox.addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(buscar, 300); // Esperar 300ms antes de buscar
});

// Buscar al presionar Enter
searchBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    resultadosDiv.style.display = "none"; // Cerrar dropdown
    buscar(); // Procesar búsqueda completa
  }
});

// Cerrar dropdown si se hace click fuera
document.addEventListener("click", (event) => {
  if (!event.target.closest(".buscador")) {
    resultadosDiv.style.display = "none";
  }
});