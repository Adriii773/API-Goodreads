document.addEventListener("DOMContentLoaded", async () => {
  const addBaldaBtn = document.getElementById("add-balda");
  const listaBaldas = document.querySelector(".menu-pagina ul");

  // -------------------------------
  // Crear libro
  // -------------------------------
  function crearLibro(src = "", libroId = null, baldaId = null, titulo = '') {
    const newLibro = document.createElement('div');
    newLibro.className = 'libro';

    // Guardamos IDs en dataset si los tenemos
    if (libroId) newLibro.dataset.libroId = libroId;
    if (baldaId) newLibro.dataset.baldaId = baldaId;

    // Añadimos la imagen placeholder si se proporciona
    const img = document.createElement('img');
    img.src = src;
    // img.alt = titulo || (libroId ? 'Libro ' + libroId : 'Libro sin ID');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';
    newLibro.appendChild(img);

    // Añadimos el título como overlay en la parte inferior
    const titleSpan = document.createElement('span');
    titleSpan.textContent = titulo || (libroId ? 'Libro ' + libroId : 'Libro sin ID');
    titleSpan.className = 'libro-titulo';
    newLibro.appendChild(titleSpan);

    // Botón de borrar libro
    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = '×';
    btnBorrar.className = 'delete-libro';

    // Evento para borrar libro
    btnBorrar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();  // Añadido para evitar propagación al padre

      const libroElement = e.currentTarget.parentElement;  // Obtenemos el div padre
      const libroIdFromDataset = libroElement.dataset.libroId;
      const baldaIdFromDataset = libroElement.dataset.baldaId;

      console.log(`Intentando borrar libro con ID ${libroIdFromDataset} de balda ${baldaIdFromDataset}`);

      if (libroIdFromDataset && baldaIdFromDataset) {
        borrarLibroDelDom(libroElement);
      } else {
        libroElement.remove();
        console.log('Libro sin IDs eliminado solo del DOM');
      }
    });

    newLibro.appendChild(btnBorrar);
    return newLibro;
  }

  // -------------------------------
  // Borrar libro
  // -------------------------------
  async function borrarLibroDelDom(libroElement) {
    const libroId = libroElement.dataset.libroId;
    const baldaId = libroElement.dataset.baldaId;
    console.log(`Enviando DELETE a /libros/balda/${baldaId}/${libroId}`);

    try {
      const res = await fetch(`http://127.0.0.1:8000/libros/balda/${baldaId}/${libroId}`, { method: "DELETE" });
      console.log(`Respuesta del backend: status ${res.status}`);
      const data = await res.json();
      console.log('Respuesta body:', data);
      if (res.ok) {
        libroElement.remove();
        console.log('Libro eliminado del DOM y backend OK');
      } else {
        console.error("Error borrando libro en backend");
      }
    } catch (err) {
      console.error("Error al borrar libro:", err);
    }
  }

  // -------------------------------
  // Activar botón eliminar balda
  // -------------------------------
  function activarBotonDeleteBalda(boton) {
    boton.addEventListener("click", () => {
      const balda = boton.parentElement;
      balda.remove();
    });
  }

  // -------------------------------
  // Añadir balda nueva
  // -------------------------------
  if (addBaldaBtn) {
    addBaldaBtn.addEventListener("click", () => {
      const baldasExistentes = document.querySelectorAll('li[data-balda]');
      const nuevoId = baldasExistentes.length + 1;  // ID secuencial simple (puedes ajustar si backend lo maneja)
      const nuevaBalda = document.createElement("li");
      nuevaBalda.dataset.balda = nuevoId;

      nuevaBalda.innerHTML = `
        <button class="delete-balda">×</button>
        <div class="libros">
          <a href="self_buscador.html?balda=${nuevoId}" class="add-libro">+</a>
        </div>
      `;  

      listaBaldas.appendChild(nuevaBalda);
      activarBotonDeleteBalda(nuevaBalda.querySelector(".delete-balda"));
    });
  }

  // -------------------------------
  // Cargar libros existentes desde backend
  // -------------------------------
  const baldas = document.querySelectorAll('li[data-balda]');

  for (const baldaElement of baldas) {
    const baldaId = baldaElement.dataset.balda;
    console.log(`Cargando libros para balda ${baldaId}`);

    try {
      const res = await fetch(`http://127.0.0.1:8000/libros/balda/${baldaId}?t=${Date.now()}`);
      console.log(`Respuesta GET para balda ${baldaId}: status ${res.status}`);
      const data = await res.json();
      console.log(`Datos recibidos para balda ${baldaId}:`, data);

      const contenedorLibros = baldaElement.querySelector('.libros');
      if (contenedorLibros && data.libros) {
        // Guardamos el botón + antes de limpiar
        const addLibroLink = contenedorLibros.querySelector('a[href*="self_buscador.html"]');
        contenedorLibros.innerHTML = '';
        if (addLibroLink) contenedorLibros.appendChild(addLibroLink);

        data.libros.forEach(libro => {
          if (libro.titulo.trim()) {
            // ✅ Evitar duplicados
            const existingLibro = contenedorLibros.querySelector(`.libro[data-libro-id="${libro.id}"]`);
            if (existingLibro) existingLibro.remove();

            const nuevoLibro = crearLibro("", libro.id, baldaId, libro.titulo);
            if (addLibroLink) {
              contenedorLibros.insertBefore(nuevoLibro, addLibroLink);
            } else {
              contenedorLibros.appendChild(nuevoLibro);
            }
          }
        });
      }
    } catch (error) {
      console.error(`Error al cargar libros de balda ${baldaId}:`, error);
    }
  }
});
