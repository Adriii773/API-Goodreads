document.addEventListener("DOMContentLoaded", () => {
  const addBaldaBtn = document.getElementById("add-balda");
  const listaBaldas = document.querySelector(".menu-pagina ul");

  // Función para añadir libros en cualquier balda
  function activarBotonAddLibro(boton) {
    boton.addEventListener("click", () => {
      const contenedorLibros = boton.parentElement;

      // Crear portada simulada
      const nuevoLibro = document.createElement("a");
      nuevoLibro.href = "#";
      nuevoLibro.innerHTML = `<img src="libro-placeholder.jpg" alt="Nuevo libro">`;

      // Insertar antes del botón "+"
      contenedorLibros.insertBefore(nuevoLibro, boton);
    });
  }

  // Función para eliminar balda
  function activarBotonDeleteBalda(boton) {
    boton.addEventListener("click", () => {
      const balda = boton.parentElement;
      balda.remove();
    });
  }

  // Botón para añadir balda
  addBaldaBtn.addEventListener("click", () => {
    // Crear nueva balda
    const nuevaBalda = document.createElement("li");

    // Estructura interna
    nuevaBalda.innerHTML = `
      <button class="delete-balda">×</button>
      <div class="libros">
        <button class="add-libro">+</button>
      </div>
    `;

    // Insertar en el UL
    listaBaldas.appendChild(nuevaBalda);

    // Activar funciones de la nueva balda
    activarBotonAddLibro(nuevaBalda.querySelector(".add-libro"));
    activarBotonDeleteBalda(nuevaBalda.querySelector(".delete-balda"));
  });

  // Activar botones "+" de las baldas iniciales
  document.querySelectorAll(".menu-pagina ul li").forEach(li => {
    const addLibro = li.querySelector(".add-libro");
    if (addLibro) activarBotonAddLibro(addLibro);
  });
});
