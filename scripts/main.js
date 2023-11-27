//  Para generar la grid necesito identificar cuantos personajes existen en la sección

// Obtener el numero de elementos de la sección
async function obtenerNumerodePer(url) {
    try {
        const response = await fetch(url);
        total = await response.json();
        num = total.info.count;
        return num; // Retorna el número total de elementos de la sección
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return 0; // En caso de error, devuelve 0 o un valor predeterminado
    }
}

// Función para obtener información del personaje por su índice
async function obtenerInformacionPorIndice(index) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${index}`);
        const data = await response.json();
        return data; // Retorna la información del personaje
    } catch (error) {
        console.error('Error al obtener información del personaje:', error);
        return null;
    }
}

// Obtener la sección con imagenes y nombres
async function generarGrid() {
    const numeroTotalElementos = await obtenerNumerodePer('https://rickandmortyapi.com/api/character');

    const gridContainer = document.getElementById('grid');

    // Generar contenido para cada celda del grid
    for (let i = 1; i <= numeroTotalElementos; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.setAttribute('data-index', i); // Establecer el atributo data-index con el valor de 'i'

        gridContainer.appendChild(gridItem);

        // Agregar evento clic a cada grid-item
        gridItem.addEventListener('click', async () => {
            const index = gridItem.getAttribute('data-index'); // Obtener el índice del atributo data-index
            const personaje = await obtenerInformacionPorIndice(index);
            abrirModal(personaje);
        });

    }

    return numeroTotalElementos; // Resolvemos una promesa con el número total de elementos
}


// Funcion generar imagenes y nombres para todas las grid-items
async function generarImagenesyNombres() {
    try {
        const numeroTotalElementos = await generarGrid(); // Esperamos a que se genere la cuadrícula antes de continuar
        const contenedores = document.querySelectorAll('.grid-item');

        let nextPage = 'https://rickandmortyapi.com/api/character';
        let indexR = 0;

        while (nextPage) {
            const response = await fetch(nextPage);
            const data = await response.json();
            const characters = data.results;


            characters.forEach((character, index) => {
                if (indexR < numeroTotalElementos) {
                    const img = document.createElement('img');
                    img.classList.add('imagesiu');
                    img.src = character.image;

                    const word = document.createElement('div');
                    word.classList.add('word');
                    word.textContent = character.name;

                    contenedores[indexR].innerHTML = '';

                    contenedores[indexR].appendChild(img);
                    contenedores[indexR].appendChild(word);

                    indexR++;
                }
            });

            // Actualizar a la próxima página o establecer como null si no hay más páginas
            nextPage = data.info.next ? data.info.next : null;
        }
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
    }
}


// Llamar a la función para generar la cuadrícula y obtener personajes
generarImagenesyNombres();

const modal = document.getElementById('modal');
const modalname = document.getElementById('name_modal');

const imagenAmpliada = document.getElementById('imagenAmpliada');

// Función para abrir el modal con la imagen seleccionada
function abrirModal(personaje) {
    imagenAmpliada.src = personaje.image;
    const nameModal = document.querySelector('.name_modal'); // Selecciona el elemento con la clase name_modal
    nameModal.textContent = personaje.name; // Establece el texto del elemento con el nombre del personaje

    // Obtener referencia a los elementos de información en el modal
    const info = document.getElementById('info');

    // Actualizar la información de cada elemento <p> en el modal
    info.children[0].textContent = `Estado: ${personaje.status}`;
    info.children[1].textContent = `Especie: ${personaje.species}`;
    info.children[2].textContent = `Tipo: ${personaje.type ? personaje.type : 'No se sabe'}`;
    info.children[3].textContent = `Género: ${personaje.gender}`;
    info.children[4].textContent = `Origen: ${personaje.origin.name}`;
    info.children[5].textContent = `Ubicación: ${personaje.location.name}`;

    modal.style.display = 'flex';

}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// Evento de clic en el documento para cerrar el modal al hacer clic fuera de su contenido
document.addEventListener('click', function(event) {
    if (event.target === modal) {
        cerrarModal();
    }
});


