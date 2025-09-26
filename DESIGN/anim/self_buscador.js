document.querySelectorAll('.search-box').forEach(input => {
    const resultadosUL = input.nextElementSibling; // Asumiendo que la ul está justo después
    const params = new URLSearchParams(window.location.search);
    const baldaId = params.get('balda'); // '1', '2', etc.

    input.addEventListener('input', async () => {
        const texto = input.value.trim();
        resultadosUL.innerHTML = "";

        if (!texto) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/buscar?texto=${encodeURIComponent(texto)}`);
            const data = await res.json();

            if (data.resultados.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No hay resultados";
                resultadosUL.appendChild(li);
            } else {
                data.resultados.forEach(libro => {
                    const li = document.createElement("li");
                    const img = document.createElement("img");
                    img.src = libro.portada;
                    img.alt = libro.titulo;
                    img.style.width = "40px";
                    img.style.height = "auto";
                    img.style.marginRight = "10px";

                    const textoSpan = document.createElement("span");
                    textoSpan.textContent = `${libro.titulo} - ${libro.autor} (${libro.anio})`;

                    li.appendChild(img);
                    li.appendChild(textoSpan);
                    resultadosUL.appendChild(li);

                    // Añadir libro a la balda con POST
                    li.addEventListener('click', async () => {
                        const libroData = {
                            titulo: libro.titulo,
                            autor: libro.autor,
                            anio: libro.anio,
                            portada: libro.portada,
                            balda: parseInt(baldaId)
                        };

                        try {
                            const res = await fetch('http://127.0.0.1:8000/libros', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(libroData),
                            });
                            if (res.ok) {
                                window.location.href = "estanterías.html";
                            } else {
                                console.error("Error al añadir libro");
                            }
                        } catch (error) {
                            console.error("Error en POST:", error);
                        }
                    });
                });
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
        }
    });
});