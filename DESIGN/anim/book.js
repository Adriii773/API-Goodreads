const input = document.querySelector(".search-box"); // Use class selector instead of ID
const resultadosUL = document.getElementById("resultados");

input.addEventListener("input", async () => {
    const texto = input.value.trim();
    resultadosUL.innerHTML = "";

    if (!texto) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/buscar?texto=${encodeURIComponent(texto)}`);
        const data = await res.json(); // data.resultados es el array
        console.log(data); // para depuración

        if (data.resultados.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay resultados";
            resultadosUL.appendChild(li);
        } else {
            data.resultados.forEach(libro => {
                const li = document.createElement("li");
                li.style.display = "flex"; // línea añadida para mostrar imagen + texto
                li.style.alignItems = "center"; // línea añadida
                li.style.marginBottom = "5px"; // línea añadida

                // Imagen de la portada
                const img = document.createElement("img");
                img.src = libro.portada; // URL de la portada
                img.alt = libro.titulo;
                img.style.width = "40px"; // tamaño pequeño para la lista
                img.style.height = "auto";
                img.style.marginRight = "10px";

                // Texto del libro
                const textoSpan = document.createElement("span");
                textoSpan.textContent = `${libro.titulo} - ${libro.autor} (${libro.anio})`;

                li.appendChild(img);
                li.appendChild(textoSpan);
                resultadosUL.appendChild(li);
            });
        }
    } catch (error) {
        console.error(error);
    }
});