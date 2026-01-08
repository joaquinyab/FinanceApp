document.addEventListener("DOMContentLoaded", () => {
  const AccionInput = document.getElementById("AccionInput");
  const NombreAccion = document.getElementById("NombreAccion");
  const PrecioAccion = document.getElementById("PrecioAccion");
  const BotonBuscar = document.getElementById("Buscar");
  const Estado = document.getElementById("Estado");

  const API_KEY = "ETR7FHK13BMNRW8O"; // ojo: esto expone la key en frontend (para demo está ok)
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

  const setStatus = (msg) => (Estado.textContent = msg || "");
  const setLoading = (on) => {
    BotonBuscar.disabled = on;
    BotonBuscar.textContent = on ? "Buscando..." : "Buscar";
  };

  const normSymbol = (s) => (s || "").trim().toUpperCase();

  function isValidSymbol(symbol) {
    // Alpha Vantage soporta símbolos con . y - (ej BRK.B)
    return /^[A-Z0-9.\-]{1,12}$/.test(symbol);
  }

  function cacheKey(symbol) {
    return `quote:${symbol}`;
  }

  function readCache(symbol) {
    try {
      const raw = sessionStorage.getItem(cacheKey(symbol));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch {
      return null;
    }
  }

  function writeCache(symbol, data) {
    try {
      sessionStorage.setItem(cacheKey(symbol), JSON.stringify({ savedAt: Date.now(), data }));
    } catch {}
  }

  async function getGlobalQuote(symbol) {
    const url =
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;

    const resp = await fetch(url);
    const data = await resp.json();

    // Rate limit o mensajes “Note”
    if (data && data.Note) {
      return { error: "rate_limit", note: data.Note };
    }
    if (data && data["Error Message"]) {
      return { error: "invalid", note: "Símbolo inválido o no soportado." };
    }

    const q = data?.["Global Quote"];
    const priceStr = q?.["05. price"];
    const lastTradingDay = q?.["07. latest trading day"];
    const changePct = q?.["10. change percent"];

    if (!priceStr) {
      return { error: "nodata", note: "No se encontraron datos." };
    }

    const price = Number(priceStr);
    return {
      symbol,
      price,
      lastTradingDay: lastTradingDay || null,
      changePct: changePct || null,
    };
  }

  async function runSearch() {
    const symbol = normSymbol(AccionInput.value);

    PrecioAccion.textContent = "";
    setStatus("");

    if (!symbol) {
      NombreAccion.textContent = "Listo para buscar";
      setStatus("Escribí un símbolo (ej: AAPL).");
      return;
    }

    if (!isValidSymbol(symbol)) {
      NombreAccion.textContent = "Símbolo inválido";
      setStatus("Usá solo letras/números y opcional . o - (ej BRK.B).");
      return;
    }

    // cache
    const cached = readCache(symbol);
    if (cached) {
      NombreAccion.textContent = `Símbolo: ${cached.symbol}`;
      PrecioAccion.textContent = `Precio: US$ ${cached.price.toFixed(2)}`;
      const extra = [
        cached.changePct ? `Variación: ${cached.changePct}` : null,
        cached.lastTradingDay ? `Último día: ${cached.lastTradingDay}` : null,
        "Fuente: cache (≤ 5 min)"
      ].filter(Boolean).join(" • ");
      setStatus(extra);
      return;
    }

    setLoading(true);
    NombreAccion.textContent = "Buscando…";

    try {
      const out = await getGlobalQuote(symbol);

      if (out.error === "rate_limit") {
        NombreAccion.textContent = "Límite alcanzado";
        setStatus("Alpha Vantage te frenó por rate-limit. Probá de nuevo en 1–2 minutos.");
        return;
      }

      if (out.error) {
        NombreAccion.textContent = "Sin resultados";
        setStatus(out.note || "No se encontraron datos.");
        return;
      }

      writeCache(symbol, out);

      NombreAccion.textContent = `Símbolo: ${out.symbol}`;
      PrecioAccion.textContent = `Precio: US$ ${out.price.toFixed(2)}`;

      const extra = [
        out.changePct ? `Variación: ${out.changePct}` : null,
        out.lastTradingDay ? `Último día: ${out.lastTradingDay}` : null,
        "Fuente: Alpha Vantage"
      ].filter(Boolean).join(" • ");
      setStatus(extra);

    } catch (e) {
      NombreAccion.textContent = "Error";
      setStatus("No pude conectar o la API respondió raro. Revisá tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  BotonBuscar.addEventListener("click", runSearch);
  AccionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
});
