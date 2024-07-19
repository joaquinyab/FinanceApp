//let ListaJava = []
//let ItemNuevo = {Accion:'appl',precio:23}
//ListaJava.push(ItemNuevo)
//console.log(ListaJava)






document.addEventListener('DOMContentLoaded', function() {
    let Boton = document.getElementById('Agregar');
    let ListaUsuario = document.getElementById('ListaAccionesUsuario');
    let AccionIntroducida = document.getElementById('NombreAccion');
    let PrecioAccionIntroducida = document.getElementById('PrecioAccion');
    let listaPrueba = document.getElementById('listaPrueba');
    let MensajeErrorAccion = document.getElementById('MensajeErrorAccion');
    let ListaJava = [];

    Boton.addEventListener('click', function() {
        let Accion = AccionIntroducida.value;
        let Precio = PrecioAccionIntroducida.value;

        // Validar ambos campos
        if (!Validarinputs(Accion) || !Validarinputs(Precio)) {
            MensajeErrorAccion.innerHTML = 'Completa el campo correctamente';
            return;
        } else {
            MensajeErrorAccion.innerHTML = ''; // Limpiar el mensaje de error si la entrada es válida
        }

        // Agregar elemento a la lista en el DOM
        let ItemNuevo = document.createElement('li');
        ListaUsuario.appendChild(ItemNuevo).innerHTML = `${Accion} - $${Precio}`;

        // Agregar elemento a la lista en JavaScript
        let ItemListaJava = {'Accion': Accion, 'precio': Precio};
        ListaJava.push(ItemListaJava);
        listaPrueba.innerHTML = JSON.stringify(ListaJava);

        // Limpiar los campos de entrada después de agregar la acción
        AccionIntroducida.value = '';
        PrecioAccionIntroducida.value = '';

    });

    function Validarinputs(input) {
        return input !== '';
    }
});


