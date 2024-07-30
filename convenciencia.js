document.addEventListener("DOMContentLoaded",function(){
    const csvUrl = 'InformacionCedears.csv'; // Asegúrate de que la URL sea correcta
    let input = document.getElementById("inputAccion");
    let boton = document.getElementById("Buscar");
    let Ticker = document.getElementById("Ticker");

    let inputPesos = document.getElementById("inputPesos")
    let inputPrecioUsd = document.getElementById("inputPrecioUsd")

    let Output = document.getElementById("Output")

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


    function CalcularCCL(Ratio){

          let RatioAccion = Strip(Ratio)

          let InputPesos = inputPesos.value
          let InputUSD = inputPrecioUsd.value
          
          fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
              .then(response => response.json())
              .then(data => {
                      // Obtener el valor de venta del dólar blue y convertirlo a número
                  let ventaDolar = (parseFloat(data.venta)).toFixed(3);
                  
                  let Resultado =parseFloat((InputPesos*RatioAccion)/InputUSD)
                  console.log(Resultado)
                  if(Resultado <= ventaDolar){
                    Output.innerText = "Comprar la accion ES conveniente"
                    Output.style.color="green"
                    Output.style.fontWeight="bolder"
                    
                  }
                  else{
                    Output.innerText = "Comprar la accion NO ES conveniente"
                    Output.style.color="red"
                    Output.style.fontWeight="bolder"

                  }
                  

                      // Verificar que totalCartera y ventaDolar sean números válidos
                  
              })
          }



    function ImprimirDato(AccionIntroducida,tickers,ratios){

      for(let i=0;i<tickers.length;i++){
        if(tickers[i]==AccionIntroducida.toUpperCase()){
          Ticker.innerHTML=tickers[i]
          CalcularCCL(ratios[i])
          
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