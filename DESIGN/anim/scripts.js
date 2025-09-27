document.addEventListener('DOMContentLoaded', async () => {
  function crearLibro(src = "") {
    const newLibro = document.createElement('a');
    newLibro.href = '#';
    newLibro.innerHTML = `<img src="${src}" alt="Nuevo libro">`;
    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = '×';
    btnBorrar.className = 'delete-libro';
    btnBorrar.addEventListener('click', (e) => {
      e.preventDefault();
      newLibro.remove();
    });
    newLibro.appendChild(btnBorrar);
    return newLibro;
  }

  async function cargarLibros() {
    document.querySelectorAll('.libros').forEach(async (container, index) => {
      const baldaId = index + 1; // Balda IDs start at 1
      try {
        const res = await fetch(`http://127.0.0.1:8000/libros/balda/${baldaId}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        data.libros.forEach(libro => {
          const libroElement = crearLibro(libro.portada);
          const addLibroLink = container.querySelector('a:has(.add-libro)');
          if (addLibroLink) {
            container.insertBefore(libroElement, addLibroLink || null);
          } else {
            console.warn(`No se encontró el enlace con .add-libro en balda ${baldaId}`);
            container.appendChild(libroElement);
          }
        });
      } catch (error) {
        console.error(`Error al cargar libros para balda ${baldaId}:`, error);
      }
    });
  }

  cargarLibros();
});