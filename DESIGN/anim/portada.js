document.addEventListener("DOMContentLoaded", () => {
  const portada = document.getElementById("portada");
  const book = document.getElementById("book");

  portada.addEventListener("click", () => {
    // ocultar portada
    portada.parentElement.classList.add("hidden");
    // mostrar páginas
    book.classList.remove("hidden");
  });
});
