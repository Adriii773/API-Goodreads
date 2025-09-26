const portada = document.getElementById('portada');
const book = document.getElementById('book');

portada.addEventListener('click', () => {
  // Muestra el libro debajo de la portada
  book.classList.add('show');

  // Aplica animación de giro a la portada
  portada.classList.add('abierta');

  // Oculta la portada al terminar la animación
  setTimeout(() => {
    portada.style.display = 'none';
  }, 1000); // coincide con la transición CSS
});
