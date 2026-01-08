// ui-cartera.js
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("ListaAccionesUsuario");
  const inputTicker = document.getElementById("NombreAccion");
  const inputPrecio = document.getElementById("PrecioAccion");
  const inputCant = document.getElementById("CantidadAcciones");
  const btnAgregar = document.getElementById("Agregar");

  if (!list || !inputTicker || !inputPrecio || !inputCant || !btnAgregar) return;

  // --- Helpers ---
  const norm = (s) => (s || "").trim();
  const normTicker = (s) => norm(s).toUpperCase();

  function guessTickerFromLi(li) {
    // Intenta sacar el ticker del texto del <li>.
    // Ej: "AAPL - Precio: 123 - Cantidad: 3" => "AAPL"
    const txt = norm(li.getAttribute("data-ticker")) || norm(li.textContent);
    const m = txt.match(/\b([A-Z]{1,6}(?:\.[A-Z]{1,2})?)\b/);
    return m ? m[1] : "";
  }

  function guessNumbersFromLi(li) {
    // Busca números en el texto para “autorrellenar” el editor
    // Agarra los primeros 2: precio, cantidad (si están).
    const txt = li.textContent.replace(/\s+/g, " ");
    const nums = txt.match(/(\d+(?:[.,]\d+)?)/g) || [];
    const toNum = (x) => (x ? Number(x.replace(",", ".")) : NaN);
    const precio = toNum(nums[0]);
    const cantidad = toNum(nums[1]);
    return { precio, cantidad };
  }

  function clickAgregarCon(ticker, precio, cantidad) {
    inputTicker.value = normTicker(ticker);
    inputPrecio.value = String(precio);
    inputCant.value = String(cantidad);
    btnAgregar.click();
  }

  // --- UI injection ---
  function ensureActions(li) {
    if (!(li instanceof HTMLElement)) return;
    if (li.querySelector(".li-actions")) return; // ya agregado

    const ticker = guessTickerFromLi(li);
    if (!ticker) return;

    li.dataset.ticker = ticker;

    const actions = document.createElement("div");
    actions.className = "li-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "li-btn";
    editBtn.textContent = "✏️ Editar";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "li-btn danger";
    delBtn.textContent = "🗑️ Eliminar";

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    // --- Edit ---
    editBtn.addEventListener("click", () => {
      // Si ya está abierto, no lo dupliques
      if (li.querySelector(".inline-editor")) return;

      const { precio, cantidad } = guessNumbersFromLi(li);

      const editor = document.createElement("div");
      editor.className = "inline-editor";

      editor.innerHTML = `
        <div class="inline-grid">
          <div class="inline-field">
            <label>Precio (ARS)</label>
            <input class="edit-precio" type="text" inputmode="decimal" placeholder="Ej: 12500" />
          </div>
          <div class="inline-field">
            <label>Cantidad</label>
            <input class="edit-cant" type="text" inputmode="numeric" placeholder="Ej: 3" />
          </div>
        </div>
        <div class="inline-actions">
          <button type="button" class="li-btn save">Guardar</button>
          <button type="button" class="li-btn secondary cancel">Cancelar</button>
        </div>
      `;

      li.appendChild(editor);

      const p = editor.querySelector(".edit-precio");
      const c = editor.querySelector(".edit-cant");
      const save = editor.querySelector(".save");
      const cancel = editor.querySelector(".cancel");

      // Autorrelleno si pudimos “adivinar” valores
      if (!Number.isNaN(precio)) p.value = String(precio).replace(".", ",");
      if (!Number.isNaN(cantidad)) c.value = String(cantidad);

      const closeEditor = () => editor.remove();

      cancel.addEventListener("click", closeEditor);

      save.addEventListener("click", () => {
        const newPrecio = Number((p.value || "").replace(",", "."));
        const newCant = Number((c.value || "").replace(",", "."));

        if (!Number.isFinite(newPrecio) || newPrecio < 0) {
          p.focus();
          p.select();
          return;
        }
        if (!Number.isFinite(newCant) || newCant < 0) {
          c.focus();
          c.select();
          return;
        }

        clickAgregarCon(ticker, newPrecio, newCant);
        closeEditor();
      });
    });

    // --- Delete ---
    delBtn.addEventListener("click", () => {
      // Eliminar sin preguntar (si querés confirmación te la agrego)
      clickAgregarCon(ticker, 0, 0);
    });
  }

  function scanList() {
    list.querySelectorAll("li").forEach(ensureActions);
  }

  // Primera pasada
  scanList();

  // Cada vez que tu JS re-renderiza la lista, volvemos a inyectar botones
  const obs = new MutationObserver(() => scanList());
  obs.observe(list, { childList: true, subtree: true });
});
