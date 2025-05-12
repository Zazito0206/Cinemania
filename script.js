document.addEventListener('DOMContentLoaded', () => {
    const fila = document.querySelector('.carousel');
    const indicadores = document.querySelector('.indicadores');
    const flechaIzquierda = document.getElementById('flecha-izquierda');
    const flechaDerecha = document.getElementById('flecha-derecha');

    const peliculaPrincipal = document.querySelector('.pelicula-principal');
    const tituloPrincipal = peliculaPrincipal.querySelector('.titulo');
    const descripcionPrincipal = peliculaPrincipal.querySelector('.descripcion');
    const botonVerPrincipal = peliculaPrincipal.querySelector('.boton');

    let peliculas = [];
    let indiceActual = 0;
    const intervaloCambio = 10000; // Cambiar cada 10 segundos (puedes modificar este valor)

    fetch('json/peliculas.json')
        .then(res => res.json())
        .then(data => {
            peliculas = data;

            // Cargar el carrusel
            peliculas.forEach(pelicula => {
                const div = document.createElement('div');
                div.classList.add('pelicula');
                div.setAttribute('data-descripcion', pelicula.descripcion);
                div.setAttribute('data-enlace', pelicula.enlace);
                div.setAttribute('data-miniatura', pelicula.imagenPP); // Imagen principal

                div.innerHTML = `<img src="${pelicula.imagen}" alt="${pelicula.titulo}" title="${pelicula.titulo}">`;
                fila.appendChild(div);
            });

            // Mostrar la primera película principal
            mostrarPeliculaPrincipal();

            // Iniciar intervalo para cambiar automáticamente
            setInterval(() => {
                indiceActual = (indiceActual + 1) % peliculas.length;
                mostrarPeliculaPrincipal();
            }, intervaloCambio);

            // Carrusel: Crear indicadores de navegación
            const items = document.querySelectorAll('.pelicula');
            const numeroPaginas = Math.ceil(items.length / 5);
            for (let i = 0; i < numeroPaginas; i++) {
                const indicador = document.createElement('button');
                if (i === 0) indicador.classList.add('activo');
                indicadores.appendChild(indicador);
                indicador.addEventListener('click', e => {
                    fila.parentElement.scrollLeft = i * fila.parentElement.offsetWidth;
                    document.querySelector('.indicadores .activo').classList.remove('activo');
                    e.target.classList.add('activo');
                });
            }

            // Efecto hover para las películas
            items.forEach(pelicula => {
                pelicula.addEventListener('mouseenter', e => {
                    const elemento = e.currentTarget;
                    setTimeout(() => {
                        items.forEach(p => p.classList.remove('hover'));
                        elemento.classList.add('hover');
                    }, 300);
                });
            });

            fila.parentElement.addEventListener('mouseleave', () => {
                items.forEach(p => p.classList.remove('hover'));
            });
        });

    // Flechas: Mover el carrusel
    flechaDerecha.addEventListener('click', () => {
        fila.parentElement.scrollLeft += fila.parentElement.offsetWidth; // Desplazamiento hacia la derecha
        cambiarIndicador('siguiente');
    });

    flechaIzquierda.addEventListener('click', () => {
        fila.parentElement.scrollLeft -= fila.parentElement.offsetWidth; // Desplazamiento hacia la izquierda
        cambiarIndicador('anterior');
    });

    // Cambiar indicador de navegación al hacer clic
    function cambiarIndicador(direccion) {
        const activo = document.querySelector('.indicadores .activo');
        const nuevo = direccion === 'siguiente' ? activo.nextSibling : activo.previousSibling;
        if (nuevo) {
            activo.classList.remove('activo');
            nuevo.classList.add('activo');
        }
    }

    // Mostrar la película principal
    function mostrarPeliculaPrincipal() {
        const peli = peliculas[indiceActual];
        peliculaPrincipal.style.backgroundImage =
            `linear-gradient(rgba(0, 0, 0, .50), rgba(0, 0, 0, .50)), url(${peli.imagenPP})`;
        tituloPrincipal.textContent = peli.titulo;
        descripcionPrincipal.textContent = peli.descripcion;
        botonVerPrincipal.onclick = () => {
            window.location.href = peli.enlace;
        };
    }
});
