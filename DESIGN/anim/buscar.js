 
 //FUNCIÓN PARA PODER BUSCAR CUANDO HAGAMOS CLICK

async function buscar() {
  const query = document.getElementById('search-box').value.trim();
  if (!query) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/buscar?q=${query}`);
    const data = await response.json();

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ""; // limpiamos resultados anteriores

    // recorremos los libros recibidos y los mostramos
    data.libros.forEach(libro => {
      const div = document.createElement('div');
      div.textContent = `${libro.titulo} - ${libro.autor}`; // textContent correcto
      resultadosDiv.appendChild(div);
    });

  } catch (error) {
    console.error("Error al hacer fetch:", error);
  }
}
