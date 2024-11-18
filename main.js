document.addEventListener("DOMContentLoaded", () => {
    const tipoSelector = document.getElementById("tipo");
    const inputBusqueda = document.getElementById("busqueda");
    const botonBuscar = document.getElementById("buscar");
    const listaResultados = document.getElementById("resultados");
    let archivoBase = "peliculas.json";

    // Escuchador para el selector
    tipoSelector.addEventListener("change", (e) => {
        archivoBase = e.target.value;

        // Evento personalizado
        const eventoArchivoBase = new CustomEvent("archivoCambiado", {
            detail: { archivo: archivoBase }
        });
        document.dispatchEvent(eventoArchivoBase);
    });

    // Escuchar evento personalizado
    document.addEventListener("archivoCambiado", (e) => {
        alert(`El archivo de base ahora es: ${e.detail.archivo}`);
    });

    // Validar entrada del input
    inputBusqueda.addEventListener("keydown", (e) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
    });

    // Función de búsqueda
    const buscar = async () => {
        const termino = inputBusqueda.value.trim().toUpperCase();
        if (!termino) {
            alert("Por favor ingresa un término para buscar.");
            return;
        }

        try {
            const respuesta = await fetch(archivoBase);
            const datos = await respuesta.json();

            // Filtrar resultados
            const resultados = datos.filter(item =>
                item.nombre.startsWith(termino)
            );

            // Mostrar resultados
            listaResultados.innerHTML = resultados.map(item =>
                `<li>
                    <strong>${item.nombre}</strong>
                    <div class="sinopsis">${item.sinopsis}</div>
                </li>`
            ).join("");

            if (resultados.length === 0) {
                listaResultados.innerHTML = "<li>No se encontraron resultados.</li>";
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    // Escuchar clic en el botón
    botonBuscar.addEventListener("click", buscar);
});
