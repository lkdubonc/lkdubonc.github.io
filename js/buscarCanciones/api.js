import * as UI from './interfaz.js';

class API {
    constructor(artista, cancion) {
        this.artista = artista;
        this.cancion = cancion;
    }

    consultarAPI() {
        const url = `https://api.lyrics.ovh/v1/${this.artista}/${this.cancion}`;
        
        Spinner();

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                if (resultado.lyrics) {
                    UI.formularioBuscar.reset();

                    const { lyrics } = resultado;

                    UI.divResultado.textContent = lyrics;
                    UI.headingResultado.textContent = `Letra de la canción: ${this.cancion} de ${this.artista}`;
                }
                else {

                    UI.limpiarHTML();

                    UI.divMensajes.textContent = `La canción no existe, prueba con otra búsqueda`;
                    UI.divMensajes.classList.add('error');
                    console.log("A");
                    setTimeout(() => {
                        UI.divMensajes.textContent = '';
                        UI.divMensajes.classList.remove('error');
                    }, 3000);
                }

            })
    }
}

function Spinner() {
    UI.limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = /*html*/`
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    UI.divResultado.appendChild(divSpinner);

}

export default API;