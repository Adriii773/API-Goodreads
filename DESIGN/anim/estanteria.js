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
