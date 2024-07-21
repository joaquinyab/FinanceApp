
document.addEventListener('DOMContentLoaded', function() {


    // AGARRO TODO LO QUE ME SIRVA DEL DOM
    let Boton = document.getElementById('Agregar');
    let AccionIntroducida = document.getElementById('NombreAccion');
    let PrecioAccionIntroducida = document.getElementById('PrecioAccion');
    let MensajeErrorAccion = document.getElementById('MensajeErrorAccion');
    let ListaUsuario = document.getElementById('ListaAccionesUsuario');
    let BotonGuardar = document.getElementById('Guardar')

    
    //LA LISTA COMIENZA VACIA AL PRINCIPIO
    let ListaJava = []
    
    //SI LA LISTA TENIA ALGO GUARDADO EN EL LOCAL STORAGE, SE MANTIENE LO GUARDADO, SINO, ARRANCA VACIA
    if(localStorage.getItem('CarteraUsuario')){
        ListaJava = JSON.parse(localStorage.getItem('CarteraUsuario'));
    }

    //MUESTRA LA LISTA, si no hay nada guardado estaria vacia
    MostrarLista(ListaUsuario,ListaJava)


    
    //una vez que el usuario apreta el boton se valida analiza que la info en Accion, Precio y Cantidad sean correctas,si lo son, se agrega a la cartera de acciones
    Boton.addEventListener('click', function() {
        
        let Accion = AccionIntroducida.value;
        let Precio = PrecioAccionIntroducida.value;

        //////////////////////////// Validar ambos campos
        if (!Validarinputs(Accion, 'Accion') || !Validarinputs(Precio, 'Precio')) {
            MensajeErrorAccion.innerHTML = 'Error en la solicitud';
            
        } else {
            MensajeErrorAccion.innerHTML = '';
            let ItemListaJava = {'Accion': Accion, 'Precio': Precio};
            ListaJava.push(ItemListaJava);
    
            MostrarLista(ListaUsuario,ListaJava)
    
            AccionIntroducida.value = '';
            PrecioAccionIntroducida.value = '';
        }
    });

    // Esta funcion agrega cada nuevo elemento que pone el usuario al apretar el boton agregar (ya habiendo verificado los datos)
    function MostrarLista(elementoLista, lista) {
        elementoLista.innerHTML = '';
        for (let i = 0; i < lista.length; i++) {
            let ItemNuevo = document.createElement('li');
            ItemNuevo.innerHTML = lista[i].Accion + ' -- ' + lista[i].Precio;
            elementoLista.appendChild(ItemNuevo);
        }
    }

    //valida inputs
    function Validarinputs(input,Tipo) {
        if (Tipo === 'Accion'){                 //si quiero verificar el input de la accion introducida
            if (input.length < 2) {
                return false;
            }
            for (let i = 0; i < input.length; i++) {
                if (!(isNaN(input[i]))) {
                    return false;
                }
            }
        }
        else if(Tipo === 'Precio'){            //si quiero verificar el input del precio introducido
            if(input.length==0){
                return false
            }
            for (let i = 0; i < input.length; i++) {
                if (isNaN(input[i])) {
                    return false;
                }
        }
    }
        return true;
    }

    //BOTON que guarda los datos que estan por ahora en la cartera de acciones
    BotonGuardar.addEventListener('click',function(){
        localStorage.setItem('CarteraUsuario',JSON.stringify(ListaJava))
    })

});