//let ListaJava = []
//let ItemNuevo = {Accion:'appl',precio:23}
//ListaJava.push(ItemNuevo)
//console.log(ListaJava)






document.addEventListener('DOMContentLoaded', function() {

    let Boton = document.getElementById('Agregar');
    
    let AccionIntroducida = document.getElementById('NombreAccion');
    let PrecioAccionIntroducida = document.getElementById('PrecioAccion');
    let listaPrueba = document.getElementById('listaPrueba');
    let MensajeErrorAccion = document.getElementById('MensajeErrorAccion');
    let ListaUsuario = document.getElementById('ListaAccionesUsuario');

    let BotonGuardar = document.getElementById('Guardar')

    
    let ListaJava = []
    

    if(localStorage.getItem('CarteraUsuario')){
        ListaJava = JSON.parse(localStorage.getItem('CarteraUsuario'));
    }

    MostrarLista(ListaUsuario,ListaJava)

    Boton.addEventListener('click', function() {
        
        let Accion = AccionIntroducida.value;
        let Precio = PrecioAccionIntroducida.value;


        //////////////////////////// Validar ambos campos
        if (!Validarinputs(Accion) || !Validarinputs(Precio)) {
            MensajeErrorAccion.innerHTML = 'Completa el campo correctamente';
            return;
        } else {
            MensajeErrorAccion.innerHTML = ''; // Limpiar el mensaje de error si la entrada es válida
        }

        let ItemListaJava = {'Accion': Accion, 'Precio': Precio};
        ListaJava.push(ItemListaJava);

        // Agregar elemento a la lista en el DOM

        MostrarLista(ListaUsuario,ListaJava)

        // Limpiar los campos de entrada después de agregar la acción
        AccionIntroducida.value = '';
        PrecioAccionIntroducida.value = '';

    });

    function MostrarLista(elementoLista, lista) {
        elementoLista.innerHTML = ''; // Limpiar la lista actual antes de agregar nuevos elementos
        for (let i = 0; i < lista.length; i++) {
            let ItemNuevo = document.createElement('li');
            ItemNuevo.innerHTML = lista[i].Accion + ' -- ' + lista[i].Precio;
            elementoLista.appendChild(ItemNuevo);
        }
    }


    function Validarinputs(input) {
        return input !== '';
    }


    BotonGuardar.addEventListener('click',function(){
        localStorage.setItem('CarteraUsuario',JSON.stringify(ListaJava))
    })


});


