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

// Función para crear un libro dinámico con botón de borrar
function crearLibro(src = 'placeholder.jpg') {
  const newLibro = document.createElement('a');
  newLibro.href = '#';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Nuevo libro';
  newLibro.appendChild(img);

  // Crear botón de borrar
  const btnBorrar = document.createElement('button');
  btnBorrar.textContent = '×';
  btnBorrar.className = 'delete-libro';
  btnBorrar.addEventListener('click', (e) => {
    e.preventDefault();
    const container = newLibro.parentElement;
    newLibro.remove();
    guardarLibros(container, Array.from(document.querySelectorAll('.libros')).indexOf(container));
  });
  newLibro.appendChild(btnBorrar);

  return newLibro;
}

// Función para cargar libros guardados de localStorage
function cargarLibros() {
  document.querySelectorAll('.libros').forEach((container, index) => {
    const key = 'estanteria-' + index;
    const librosGuardados = JSON.parse(localStorage.getItem(key)) || [];
    librosGuardados.forEach(src => {
      const libro = crearLibro(src);
      container.insertBefore(libro, container.querySelector('.add-libro'));
    });
  });
}

// Función para guardar libros en localStorage
function guardarLibros(container, index) {
  const srcs = [];
  // Guardar solo imágenes de libros añadidos dinámicamente (no .original)
  container.querySelectorAll('a img:not(.original)').forEach(img => srcs.push(img.src));
  localStorage.setItem('estanteria-' + index, JSON.stringify(srcs));
}

document.addEventListener('DOMContentLoaded', () => {
  cargarLibros(); // cargar libros al abrir la página

  // Añadir nuevo libro al pulsar "+"
  document.querySelectorAll('.add-libro').forEach((button, index) => {
    button.addEventListener('click', () => {
      const container = button.parentElement;
      const libro = crearLibro();
      container.insertBefore(libro, button);
      guardarLibros(container, index);
    });
  });
});

const celdas = document.querySelectorAll('.tabla-bingo .celda');

celdas.forEach(celda => {
  celda.addEventListener('click', () => {
    celda.classList.toggle('activo'); // activa/desactiva el círculo
  });
});

