  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.search-box').forEach(input => {
        const resultadosUL = input.nextElementSibling;
        if (!resultadosUL) return; // evita errores si no hay UL

        input.addEventListener('input', async () => {
            const texto = input.value.trim();
            resultadosUL.innerHTML = "";
            if (!texto) return;

            try {
                const res = await fetch(`http://127.0.0.1:8000/buscar?texto=${encodeURIComponent(texto)}`);
                const data = await res.json();

                if (!data.resultados || data.resultados.length === 0) {
                    const li = document.createElement("li");
                    li.textContent = "No hay resultados";
                    resultadosUL.appendChild(li);
                    return;
                }

                data.resultados.forEach(libro => {
                    const li = document.createElement("li");

                    const textoSpan = document.createElement("span");
                    textoSpan.textContent = `${libro.titulo} - ${libro.autor}`;

                    li.appendChild(textoSpan);
                    resultadosUL.appendChild(li);

                    // CLICK para añadir libro (POST)
                    li.addEventListener('click', async () => {
                        const params = new URLSearchParams(window.location.search);
                        const baldaIdParam = params.get('balda');
                        const baldaId = baldaIdParam ? parseInt(baldaIdParam) : null;
                        if (!baldaId) {
                            console.error("No se pudo determinar la baldaId desde la URL");
                            return;
                        }

                        const libroData = {
                            titulo: libro.titulo,
                            autor: libro.autor,
                            anio: libro.anio ? String(libro.anio) : "", // <- siempre str
                        };

                        try {
                            const res = await fetch(`http://127.0.0.1:8000/libros/${baldaId}`, {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(libroData),
                            });
                            if (res.ok) window.location.href = "estanterías.html";
                            else console.error("Error al añadir libro");
                        } catch (error) {
                            console.error("Error en POST:", error);
                        }
                    });
                });

            } catch (error) {
                console.error("Error en búsqueda:", error);
            }
        });
    });
}); 
