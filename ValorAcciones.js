document.addEventListener('DOMContentLoaded', function () {
  let AccionInput = document.getElementById('AccionInput');
  let NombreAccion = document.getElementById('NombreAccion');
  let PrecioAccion = document.getElementById('PrecioAccion');
  let BotonBuscar = document.getElementById('Buscar');

  BotonBuscar.addEventListener('click', async function() {
      let simboloAccion = AccionInput.value.trim();
      if (simboloAccion) {
          NombreAccion.innerHTML = 'Buscando...';
          let Accion = await getStockData(simboloAccion);
          if (Accion) {
              NombreAccion.innerText = `Símbolo: ${Accion.symbol}`;
          } else {
              NombreAccion.innerText = 'No se encontraron datos.';
          }
      } else {
          alert('Por favor, introduce un símbolo de acción.');
      }
  });

  async function getStockData(symbol) {
      let apiKey = 'ETR7FHK13BMNRW8O';//ENR7DHK11BMNEW8O
      let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

      try {
          let response = await fetch(url);
          let data = await response.json();

          console.log('Respuesta de la API:', data); // Ver la respuesta de la API

          if (data['Time Series (1min)']) {
              let timeSeries = data['Time Series (1min)'];
              let lastKey = Object.keys(timeSeries)[0];
              let lastDataPoint = timeSeries[lastKey];
              console.log('Último valor de open:', lastDataPoint['1. open']);
              PrecioAccion.innerText = `Precio de Apertura: $${lastDataPoint['1. open']}`;
              return { symbol };
          } else {
              console.log('No se encontraron datos.');
              PrecioAccion.innerText = 'No se encontraron datos';
          }
      } catch (error) {
          console.error('Error fetching stock data:', error);
          PrecioAccion.innerText = 'Error al obtener datos';
      }
  }
});
