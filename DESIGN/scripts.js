// Espera a que todo el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

  // Selecciona elementos del menú y contenido
  const nav = document.querySelector('.menu-principal');
  const toggleBtn = document.getElementById('toggle-menu');
  const contenido = document.querySelector('.contenido');

  // Solo añade funcionalidad si todos los elementos existen
  if (nav && toggleBtn && contenido) {
    toggleBtn.addEventListener('click', () => {
      // Alterna la clase para ocultar/mostrar menú
      nav.classList.toggle('oculto');
      contenido.classList.toggle('menu-oculto');

      // Cambia el símbolo de la flecha
      toggleBtn.textContent = nav.classList.contains('oculto') ? '❯' : '❮';
    });
  }

  // Buscador simple
  const searchBtn = document.getElementById('search-btn');
  const searchBox = document.getElementById('search-box');

  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', () => {
      const query = searchBox.value.trim();
      if(query) alert("Buscando: " + query);
    });

    searchBox.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') searchBtn.click();
    });
  }
});
