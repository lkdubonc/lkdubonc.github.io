//Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    //Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener("click", agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso);

    //Muestra los cursos de localStorage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
        console.log(articulosCarrito);
    })

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];

        limpiarHTML();
    })
}

//Funciones
function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado)
    }

}

//Elimina un curso
function eliminarCurso(e) {
    if (e.target.classList.contains("borrar-curso")) {
        const cursoId = e.target.getAttribute("data-id");

        //Elimina del arreglo
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML();
    }
}

//Lee el contenido del HTML al que le dimos click
function leerDatosCurso(cursoSeleccionado) {

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: cursoSeleccionado.querySelector("img").src,
        titulo: cursoSeleccionado.querySelector("h4").textContent,
        precio: cursoSeleccionado.querySelector(".precio span").textContent,
        id: cursoSeleccionado.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    if (existe) {
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {

                const confirmar = confirm('Este curso ya se encuentra en el carrito. ¿Deseas agregarlo nuevamente?');
                if (confirmar) {
                    curso.cantidad++;

                    //Se le avisa al usuario que fue agregado
                    alert("Agregado correctamente");
                }
                return curso;
            }
            else {
                return curso;
            }
        })

        articulosCarrito = [...cursos];
    } else {
        //Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];

        //Se le avisa al usuario que fue agregado
        alert("Agregado correctamente");
    }

    carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //Limpiar el html
    limpiarHTML();

    //Recorre el carrito
    articulosCarrito.forEach(
        curso => {
            const { imagen, titulo, precio, cantidad, id } = curso;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src= "${imagen}" width="100">
                </td>
                <td>
                    ${titulo}
                </td>
                <td>
                    ${precio}
                </td>
                <td>
                    ${cantidad}
                </td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}"> X </a>
                </td>
            `;

            //Agrega el html del carrito en el body
            contenedorCarrito.appendChild(row);
        }
    );

    //Agregar carrito a storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}

//Elimina los cursos del tbody
function limpiarHTML() {
    //Forma lenta
    // contenedorCarrito.innerHTML = "";

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}