document.addEventListener("DOMContentLoaded",function(){
    const csvUrl = 'InformacionCedears.csv'; // Asegúrate de que la URL sea correcta
    let input = document.getElementById("inputAccion");
    let boton = document.getElementById("Buscar");
    let Ticker = document.getElementById("Ticker");

    let inputPesos = document.getElementById("inputPesos")
    let inputPrecioUsd = document.getElementById("inputPrecioUsd")

    let Output = document.getElementById("Output")

    let PrecioDolar = document.getElementById("PrecioDolar")


    DolarApi()


    boton.addEventListener("click", async function() {
  
      let { tickers, ratios } = await CargarListas(csvUrl);
      let AccionIntroducida = input.value;
      console.log(ratios)
      ImprimirDato(AccionIntroducida,tickers,ratios)

    });


    function Strip(string){

      let ratio =""
      for(let i=0;i<string.length;i++){
        if(string[i]!== ":"){
          ratio +=string[i]
        }
        else{

            return parseFloat(ratio)

        }


      }
    }

    function DolarApi(){
      fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
      .then(response => response.json())
      .then(data => {
              // Obtener el valor de venta del dólar blue y convertirlo a número
          let DolarExposicion = (parseFloat(data.venta)).toFixed(2);
          PrecioDolar.innerHTML = "DOLAR CCL en directo: " 
          PrecioDolar.style.color="grey"

          let Exposicion = document.createElement("h3")
          Exposicion.style.color="white"
          Exposicion.innerHTML=" $"+DolarExposicion+" ARS"

          PrecioDolar.appendChild(Exposicion)
      })
    }


    function CalcularCCL(Ratio,TickerSeleccionado){

          let RatioAccion = Strip(Ratio)

          let InputPesos = inputPesos.value
          let InputUSD = inputPrecioUsd.value
          
          fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
              .then(response => response.json())
              .then(data => {
                      // Obtener el valor de venta del dólar blue y convertirlo a número
                  let ventaDolar = (parseFloat(data.venta)).toFixed(3);
                  
                  let Resultado =(parseFloat((InputPesos*RatioAccion)/InputUSD))
                  Ticker.innerText = "El CCL de "+TickerSeleccionado+" es de $"+Resultado.toFixed(2)+" ARS"
                  if(Resultado <= ventaDolar){
                    Output.innerText = "El CCL de la accion esta SUBVALORADO"
                    Output.style.color="green"
                    Output.style.fontWeight="bolder"
                    
                  }
                  else{
                    Output.innerText = "El CCL de la accion esta SOBREVALORADO"
                    Output.style.color="red"
                    Output.style.fontWeight="bolder"

                  }
                  

                      // Verificar que totalCartera y ventaDolar sean números válidos
                  
              })
          }



    function ImprimirDato(AccionIntroducida,tickers,ratios){

      for(let i=0;i<tickers.length;i++){
        if(tickers[i]==AccionIntroducida.toUpperCase()){
          
          CalcularCCL(ratios[i],tickers[i])
          
        }
      }

    }

    // Función para cargar y procesar el CSV
    function CargarListas(csvUrl) {
      return new Promise((resolve, reject) => {
        fetch(csvUrl)
          .then(response => response.text())
          .then(data => {
            Papa.parse(data, {
              header: true,
              complete: function(results) {
                let tickers = [];
                let ratios = [];
                results.data.forEach(row => {
                  tickers.push(row.TICKER);
                  ratios.push(row.RATIO);
                });
                resolve({ tickers, ratios });
              },
            });
          })
      });
    }
})
