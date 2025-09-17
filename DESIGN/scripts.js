// scripts.js — robusto, maneja varios menús y evita errores si falta algo
document.addEventListener('DOMContentLoaded', () => {
  // Maneja uno o varios menús .menu-principal por si tienes más páginas con la misma estructura
  const menus = document.querySelectorAll('.menu-principal');
  const contenido = document.querySelector('.contenido'); // asumimos 1 área principal

  if (menus.length === 0) {
    console.log('[menu] No se ha encontrado ningún .menu-principal en esta página.');
  }

  menus.forEach((nav, idx) => {
    // Busca botón toggle dentro del nav (primero por id, si no, cualquier button)
    let toggleBtn = nav.querySelector('#toggle-menu') || nav.querySelector('button');

    if (!toggleBtn) {
      console.log(`[menu] En .menu-principal #${idx} no se encontró botón toggle. Añade <button id="toggle-menu">❮</button> dentro del nav.`);
      return;
    }

    // Si no tiene símbolo al cargar, lo ponemos acorde al estado inicial (oculto o no)
    if (!toggleBtn.textContent.trim()) {
      toggleBtn.textContent = nav.classList.contains('oculto') ? '❯' : '❮';
    }

    // Aseguramos que el botón esté visible encima del resto
    toggleBtn.style.zIndex = '200';

    // Listener (evitar duplicados — primero removemos si acaso)
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('oculto');

      // Ajusta el contenido principal si existe
      if (contenido) {
        contenido.classList.toggle('menu-oculto');
      }

      // Actualiza símbolo de la flecha
      toggleBtn.textContent = nav.classList.contains('oculto') ? '❯' : '❮';
    });
  });

  // Buscador (si existe)
  const searchBtn = document.getElementById('search-btn');
  const searchBox = document.getElementById('search-box');

  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', () => {
      const query = searchBox.value.trim();
      if (query) {
        // aqui puedes reemplazar la alerta por la lógica real
        alert('Buscando: ' + query);
      }
    });

    searchBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  } else {
    // debug pequeño si falta algo
    if (!searchBtn && !searchBox) {
      console.log('[search] No se encontró buscador (search-btn/search-box).');
    } else if (!searchBtn) {
      console.log('[search] Falta #search-btn.');
    } else {
      console.log('[search] Falta #search-box.');
    }
  }
});
