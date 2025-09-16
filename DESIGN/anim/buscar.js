 
 //FUNCIÓN PARA PODER BUSCAR CUANDO HAGAMOS CLICK

 async function buscar() {
    const query = document.getElementById('search-box').value; //Obtenemos el valor del input
    const response = await fetch(`http://127.0.0.1:8000/buscar?q=${query}`) //enviamos la consulta la backend
    const data = await response.json(); //esperamos la respuesta y la convertimos a json

    const resultadosDiv = document.getElementById('resultados') //seleccionamos el div donde mostraremos los resultados
    resultadosDiv.innerHTML = ""; //limpiamos los resultados anteriores

    //recorremos los libros recibidos y los mostramos
    data.libros.forEach(libro => {
        const div = document.createElement('div'); //creamos un div para cada libro
        div.textContext = `${libro.titulo} - ${libro.autor}`; // añadimos el titulo y autor
        resultadosDiv.appendChild(div); //añadimos el div al contenedor de resultados
    })

  }