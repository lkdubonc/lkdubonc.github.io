// Variables
const formulario = document.querySelector("#formulario");
const listaTweets = document.querySelector("#lista-tweets");
let tweets = [];


// Event Listeners
eventListeners();

function eventListeners() {
    //Cuando el usuario grega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //Cuando está listo
    document.addEventListener("DOMContentLoaded", () => {
        tweets = JSON.parse(localStorage.getItem("tweets")) || [];

        crearHTML();
    })
}

// Funciones
function agregarTweet(e) {
    e.preventDefault();

    //TextArea donde escribe
    const tweet = document.querySelector("#tweet").value;

    // validación...
    if (tweet === "") {
        mostrarError("Un mensaje no puede ir vacío.");

        return; //evita exec de más líneas
    }

    const tweetObj = {
        id: Date.now(),
        tweet
    }

    //Añadir al arreglo de tweets
    tweets = [...tweets, tweetObj]

    //Crear html
    crearHTML();

    // reiniciar el formulario
    formulario.reset();
}

//Mostrar mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement("p");
    mensajeError.textContent = error;
    mensajeError.classList.add("error");

    //Insertarlo en contenido
    const contenido = document.querySelector("#contenido");
    contenido.appendChild(mensajeError);

    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

//Muestra un listado de los tweets
function crearHTML() {
    limpiarHTML();

    if (tweets.length > 0) {
        tweets.forEach(tweet => {
            //Agregar boton de eliminar
            const btnEliminar = document.createElement("a");
            btnEliminar.classList.add("borrar-tweet");
            btnEliminar.innerText = "X";

            //Añadir la función de eliminar
            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }

            //Crear HTML
            const li = document.createElement("li");

            //añadir texto
            li.innerText = tweet.tweet;

            //Asignar botón
            li.appendChild(btnEliminar);

            //Insertarlo en html
            listaTweets.appendChild(li);
        });
    }

    sincronizarStorage();
}

// Agrega tweets actuales a localStorage
function sincronizarStorage() {
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

//Eliminar un tweet
function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);

    crearHTML();
}

//Limpiar HTML
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}