// Referencias a los elementos
const portada = document.getElementById('portada');
const book = document.getElementById('book');

// Función para abrir la portada
portada.addEventListener('click', () => {
  // Aplica la animación de giro
  portada.style.transform = "rotateY(-180deg)";

  // Espera a que termine la animación antes de mostrar el libro
  setTimeout(() => {
    portada.style.display = 'none';      // oculta la portada
    book.classList.add('show');          // muestra las páginas internas
  }, 1000); // 1000ms = duración de la transición
});
