document.addEventListener("DOMContentLoaded", () => {
  const addBaldaBtn = document.getElementById("add-balda");
  const listaBaldas = document.querySelector(".menu-pagina ul");

  // -------------------------------
  // Crear libro
  // -------------------------------
  function crearLibro(src = 'libro-placeholder.jpg') {
    const newLibro = document.createElement('a');
    newLibro.href = '#';
    newLibro.innerHTML = `<img src="${src}" alt="Nuevo libro">`;

    // Botón de borrar libro
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

  // -------------------------------
  // Activar botón "+"
  // -------------------------------
  function activarBotonAddLibro(boton) {
    // Clonar para remover listeners previos
    const newBtn = boton.cloneNode(true);
    boton.replaceWith(newBtn);

    newBtn.addEventListener("click", () => {
      const contenedorLibros = newBtn.parentElement;
      const libro = crearLibro();
      contenedorLibros.insertBefore(libro, newBtn);
    });
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
  addBaldaBtn.addEventListener("click", () => {
    const nuevaBalda = document.createElement("li");

    nuevaBalda.innerHTML = `
      <button class="delete-balda">×</button>
      <div class="libros">
        <button class="add-libro">+</button>
      </div>
    `;

    listaBaldas.appendChild(nuevaBalda);

    // Activar botones de la balda nueva
    activarBotonAddLibro(nuevaBalda.querySelector(".add-libro"));
    activarBotonDeleteBalda(nuevaBalda.querySelector(".delete-balda"));
  });

  // -------------------------------
  // Activar botones "+" de baldas iniciales
  // -------------------------------
  document.querySelectorAll(".menu-pagina ul li .add-libro").forEach(btn => {
    activarBotonAddLibro(btn);
  });
});

//

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const baldaId = params.get('balda'); // Obtener el ID de la balda desde la URL

    if (baldaId) {
        // Hacer GET para obtener los libros de la balda
        try {
            const res = await fetch(`http://127.0.0.1:8000/libros/balda/${baldaId}`);
            const data = await res.json();

            const balda = document.querySelector(`li[data-balda="${baldaId}"] .libros`);
            if (balda) {
                data.libros.forEach(libro => {
                    const nuevoLibro = document.createElement('a');
                    nuevoLibro.href = "#";
                    nuevoLibro.textContent = libro.titulo;
                    nuevoLibro.className = 'libro-agregado';

                    const btnBorrar = document.createElement('button');
                    btnBorrar.textContent = '×';
                    btnBorrar.className = 'delete-libro';
                    btnBorrar.addEventListener('click', () => nuevoLibro.remove());

                    nuevoLibro.appendChild(btnBorrar);
                    balda.insertBefore(nuevoLibro, balda.querySelector('.add-libro'));
                });
            }
        } catch (error) {
            console.error("Error al cargar libros:", error);
        }
    }
});