(function () {

    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('¿Deseas eliminar este cliente?');
            if (confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function () {
                    console.log('Eliminando...');

                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function () {
                    console.log('Hubo un error');
                }
            }
        }
    }

    // Crea la base de datos de indexedDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function () {
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function () {
            DB = crearDB.result;

            imprimirClientes();
        };

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: false });

            console.log('Lista y creada');
        }

    }

    function imprimirClientes() {
        limpiarHTML();

        // Leer el contenido de la base de datos
        const objectStore = DB.transaction('crm').objectStore('crm');

        objectStore.openCursor().onsuccess = function (e) {

            const cursor = e.target.result;

            if (cursor) {
                const { nombre, email, telefono, empresa, id } = cursor.value;

                const row = document.createElement('tr');
                row.innerHTML = /*html*/`
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${telefono}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${empresa}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                </td>
                    `;

                // Agregar al HTML
                listadoClientes.appendChild(row);

                // Ve al siguiente elemento

                cursor.continue();
            }
        }
    }

    function limpiarHTML() {
        while (listadoClientes.firstChild) {
            listadoClientes.removeChild(listadoClientes.firstChild);
        }
    }


})();