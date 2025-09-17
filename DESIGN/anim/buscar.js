// ===========================================
// 1️⃣ Obtener elementos del DOM
// ===========================================
const searchBox = document.getElementById("search-box");
const resultadosDiv = document.getElementById("resultados");

// ===========================================
// 2️⃣ Función para buscar en Google Books
// ===========================================
async function buscarGoogleBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const data = await resp.json();
    if (!data.items) return [];

    return data.items.map(item => {
      const info = item.volumeInfo;
      return {
        titulo: info.title || "Desconocido",
        autor: info.authors ? info.authors.join(", ") : "Desconocido",
        portada: info.imageLinks?.thumbnail
          ? info.imageLinks.thumbnail.replace("http:", "https:")
          : "https://via.placeholder.com/100x150?text=Sin+Portada"
      };
    });
  } catch (e) {
    console.error("Error Google Books:", e);
    return [];
  }
}

// ===========================================
// 3️⃣ Función para buscar en Open Library
// ===========================================
async function buscarOpenLibrary(query) {
  const queries = [query, query.toLowerCase().replace("seis de cuervos", "six of crows")];
  const results = [];

  for (const q of queries) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`;
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      if (data.docs) {
        results.push(...data.docs.map(libro => ({
          titulo: libro.title || "Desconocido",
          autor: libro.author_name ? libro.author_name.join(", ") : "Desconocido",
          cover_i: libro.cover_i || null
        })));
      }
    } catch (error) {
      console.error("Error fetch Open Library:", error);
    }
  }

  // Filtrar duplicados y añadir portada
  let resultadosFiltrados = results.filter((libro, index, self) =>
    index === self.findIndex(l => l.titulo === libro.titulo && l.autor === libro.autor)
  );

  resultadosFiltrados.forEach(libro => {
    libro.portada = libro.cover_i
      ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
      : "https://via.placeholder.com/100x150?text=Sin+Portada";
  });

  return resultadosFiltrados.slice(0, 10);
}

// ===========================================
// 4️⃣ Función para calcular relevancia
// ===========================================
function calcularRelevancia(libro, query) {
  const queryLower = query.toLowerCase().trim();
  const titleLower = libro.titulo.toLowerCase().trim();

  // 1️⃣ Coincidencia exacta completa
  if (titleLower === queryLower) return 100;

  // 2️⃣ Todas las palabras del query están en el título
  const queryWords = queryLower.split(" ").filter(w => w);
  const allWordsMatch = queryWords.every(word => titleLower.includes(word));
  if (allWordsMatch) return 80;

  // 3️⃣ Coincidencia parcial por palabra
  let score = 0;
  queryWords.forEach(word => {
    if (titleLower.includes(word)) score += 10;
  });

  return score;
}

// ===========================================
// 5️⃣ Función principal de búsqueda
// ===========================================
async function buscar() {
  const query = searchBox.value.trim();
  resultadosDiv.innerHTML = "";

  if (!query) {
    resultadosDiv.style.display = "none";
    return;
  }

  try {
    let resultados = [];

    // 🔹 Buscar primero en Google Books
    const googleResults = await buscarGoogleBooks(query);
    if (googleResults.length > 0) {
      resultados = googleResults;
    } else {
      // 🔹 Si no hay resultados, buscar en Open Library
      resultados = await buscarOpenLibrary(query);
    }

    // 🔹 Filtrar títulos que contengan alguna palabra del query
    const queryWords = query.toLowerCase().split(" ").filter(w => w);
    resultados = resultados.filter(libro => {
      const titleLower = libro.titulo.toLowerCase();
      return queryWords.some(word => titleLower.includes(word));
    });

    // 🔹 Calcular relevancia y ordenar
    resultados.forEach(libro => libro.relevancia = calcularRelevancia(libro, query));
    resultados.sort((a, b) => b.relevancia - a.relevancia);

    // 🔹 Mostrar resultados
    if (resultados.length === 0) {
      const item = document.createElement("div");
      item.textContent = "No se encontraron resultados";
      item.classList.add("resultado-item");
      resultadosDiv.appendChild(item);
      resultadosDiv.style.display = "block";
      return;
    }

    resultados.forEach(libro => {
      const item = document.createElement("div");
      item.classList.add("resultado-item");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "10px";
      item.style.marginBottom = "8px";

      const img = document.createElement("img");
      img.src = libro.portada;
      img.alt = libro.titulo;
      img.width = 100;
      img.height = 150;
      img.onerror = () => { 
        img.src = "https://via.placeholder.com/100x150?text=Sin+Portada";
      };

      const texto = document.createElement("div");
      texto.innerHTML = `<strong>${libro.titulo}</strong><br>${libro.autor}`;

      item.appendChild(img);
      item.appendChild(texto);

      item.addEventListener("click", () => {
        searchBox.value = libro.titulo;
        resultadosDiv.style.display = "none";
      });

      resultadosDiv.appendChild(item);
    });

    resultadosDiv.style.display = "block";

  } catch (error) {
    console.error("Error general:", error);
    resultadosDiv.style.display = "none";
  }
}

// ===========================================
// 6️⃣ Eventos
// ===========================================
let timeoutId;
searchBox.addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(buscar, 300);
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    buscar();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".buscador")) {
    resultadosDiv.style.display = "none";
  }
});
