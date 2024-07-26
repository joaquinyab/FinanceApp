
document.addEventListener('DOMContentLoaded', function() {

    // AGARRO TODO LO QUE ME SIRVA DEL DOM
    let Boton = document.getElementById('Agregar');
    let AccionIntroducida = document.getElementById('NombreAccion');
    let PrecioAccionIntroducida = document.getElementById('PrecioAccion');
    let CantidadIntroducida = document.getElementById('CantidadAcciones')
    let MensajeErrorAccion = document.getElementById('MensajeErrorAccion');
    let ListaUsuario = document.getElementById('ListaAccionesUsuario');
    let TotalCartera = document.getElementById('TotalCartera')

    let PrecioDolar = document.getElementById('Dolar')




    

    //https://dolarapi.com/docs/argentina/
    fetch("https://dolarapi.com/v1/dolares/blue")
    .then(response => response.json())
    .then(data => PrecioDolar.innerHTML=data.venta);




    //LA LISTA COMIENZA VACIA AL PRINCIPIO
    let ListaJava = []
    
    //SI LA LISTA TENIA ALGO GUARDADO EN EL LOCAL STORAGE, SE MANTIENE LO GUARDADO, SINO, ARRANCA VACIA
    if(localStorage.getItem('CarteraUsuario')){
        ListaJava = JSON.parse(localStorage.getItem('CarteraUsuario'));
    }

    //MUESTRA LA LISTA, si no hay nada guardado estaria vacia
    MostrarLista(ListaUsuario,ListaJava)

    TotalCartera.innerHTML= Calculartotal(ListaJava)


    //una vez que el usuario apreta el boton se valida analiza que la info en Accion, Precio y Cantidad sean correctas,si lo son, se agrega a la cartera de acciones
    Boton.addEventListener('click', function() {
        
        let Accion = AccionIntroducida.value;
        let Precio = PrecioAccionIntroducida.value;
        let Cantidad = CantidadIntroducida.value
        
        
        //////////////////////////// Validar ambos campos
        if (!Validarinputs(Accion, 'Accion') || !Validarinputs(Precio, 'Precio') || !Validarinputs(Cantidad,'Cantidad')){
            MensajeErrorAccion.innerHTML = 'Error en la solicitud';
            
        } 
        else{
            MensajeErrorAccion.innerHTML=''
            if(ListaJava.length==0){
                    AgregarAccion(Accion,Precio,Cantidad)
            }
            else{
                if(AccionSeEncuentra(ListaJava,Accion)){

                    if(Precio==0){
                        if(CartelConfirmacion(Accion) == true){
                            EliminarAccion(ListaJava,Accion)
                            AccionIntroducida.value = '';
                            PrecioAccionIntroducida.value = '';
                            CantidadIntroducida.value='';
                        }
                        else{
                            AccionIntroducida.value = '';
                            PrecioAccionIntroducida.value = '';
                            CantidadIntroducida.value='';    
                        }
                    }

                    else{
                        cambiarPrecio(ListaJava,Accion,Precio)
                        AccionIntroducida.value = '';
                        PrecioAccionIntroducida.value = '';
                        CantidadIntroducida.value='';

                    }

                    if(Cantidad==0){
                        if(CartelConfirmacion(Accion) == true){
                            EliminarAccion(ListaJava,Accion)
                            AccionIntroducida.value = '';
                            PrecioAccionIntroducida.value = '';
                            CantidadIntroducida.value='';
                        }
                        else{
                            AccionIntroducida.value = '';
                            PrecioAccionIntroducida.value = '';
                            CantidadIntroducida.value='';
                        }
                    }
                    else{
                        CambiarCantidad(ListaJava,Accion,Cantidad)
                        AccionIntroducida.value = '';
                        PrecioAccionIntroducida.value = '';
                        CantidadIntroducida.value='';
                    }
                }
                else{
                    AgregarAccion(Accion,Precio,Cantidad)
                }
                }
            }
        TotalCartera.innerHTML= Calculartotal(ListaJava)
            


    });


    function Calculartotal(ListaJava){
        let Total = 0
        for (let i=0;i<ListaJava.length;i++){
            Total+=((ListaJava[i].Precio)*(ListaJava[i].Cantidad))
        }
        return Total
    }


    function CartelConfirmacion(Accion){
        let CartelAlerta = prompt('Estas por eliminar'+ Accion +' de tu cartera, escribe SI para proseguir')

        if(CartelAlerta=='SI'||CartelAlerta=='Si'||CartelAlerta=='si'||CartelAlerta=='sI'){
            return true
        }
        else{
            return false
        }
    }

    function EliminarAccion(ListaJava,AccionIntroducida){
        for(let i=0;i<ListaJava.length;i++){
            if(ListaJava[i].Accion.toUpperCase()==AccionIntroducida.toUpperCase()){
                ListaJava.splice(i, 1);
                MostrarLista(ListaUsuario, ListaJava)
            }
        }
    }

    function AccionSeEncuentra(ListaJava,AccionIntroducida){
        for(let i=0;i<ListaJava.length;i++){
            if(ListaJava[i].Accion.toUpperCase()==AccionIntroducida.toUpperCase()){
                return true
            }
        }
        return false
    }


    function cambiarPrecio(ListaJava,AccionIntroducida,PrecioAccionIntroducida){
        for(let i=0;i<ListaJava.length;i++){
            if(ListaJava[i].Accion.toUpperCase()==AccionIntroducida.toUpperCase()){
                ListaJava[i].Precio=parseFloat(PrecioAccionIntroducida)
            }
            MostrarLista(ListaUsuario, ListaJava)
        }

    }

    function CambiarCantidad(ListaJava,AccionIntroducida,CantidadIntroducida){
        for(let i=0;i<ListaJava.length;i++){
            if(ListaJava[i].Accion.toUpperCase()==AccionIntroducida.toUpperCase()){
                ListaJava[i].Cantidad=parseFloat(CantidadIntroducida)
            }
            MostrarLista(ListaUsuario, ListaJava)
        }
        
    }

    function AgregarAccion(Accion,Precio,Cantidad){
        MensajeErrorAccion.innerHTML = '';
        let ItemListaJava = {'Accion': Accion.toUpperCase(), 'Precio': Precio,'Cantidad':Cantidad};
        ListaJava.push(ItemListaJava);

        MostrarLista(ListaUsuario,ListaJava)
        AccionIntroducida.value = '';
        PrecioAccionIntroducida.value = '';
        CantidadIntroducida.value='';
    }

    // Esta funcion agrega cada nuevo elemento que pone el usuario al apretar el boton agregar (ya habiendo verificado los datos)
    function MostrarLista(elementoLista, lista) {
        elementoLista.innerHTML = '';
        for (let i = 0; i < lista.length; i++) {
            let ItemNuevo = document.createElement('li');

            ItemNuevo.innerHTML = lista[i].Accion + ' --- $' + lista[i].Precio +'  | '+'Cantidad:'+lista[i].Cantidad+' __ ' +' TOTAL: $' +(lista[i].Precio)*(lista[i].Cantidad); 
         
            elementoLista.appendChild(ItemNuevo);
            localStorage.setItem('CarteraUsuario',JSON.stringify(ListaJava))

            
        }
    }

    /////////////valida inputs
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
            if(input.length==0 ){
                return false
            }
            for (let i = 0; i < input.length; i++) {
                if (isNaN(input[i])) {
                    return false;
                }
        }
    }
    else if(Tipo == 'Cantidad'){
        if(input.length==0){
            return false
        }
        for(let i=0;i<input.length;i++){

            if(i==0 && input[0]=='-'){
                continue
            }
            else if (isNaN(input[i])){
                return false
            }
        } 
    }
    return true; 
    }
});