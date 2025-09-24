const input = document.getElementById("search-box");
const resultadosUL = document.getElementById("resultados");


input.addEventListener("input", async () => {
    const texto = input.value.trim();
    resultadosUL.innerHTML = "";

    if (!texto) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/buscar?texto=${encodeURIComponent(texto)}`);
        const data = await res.json();  // data.resultados es el array
        console.log(data); // <--- mira en la consola que devuelve el backend

        if (data.resultados.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No hay resultados";
            resultadosUL.appendChild(li);
        } else {
            data.resultados.forEach(libro => {
                const li = document.createElement("li");
                li.textContent = `${libro.titulo} - ${libro.autor} (${libro.anio})`;
                resultadosUL.appendChild(li);
            });
        }

    } catch (error) {
        console.error(error);
    }
});