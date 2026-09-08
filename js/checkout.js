function renderCheckout() {
      const cart = getCart();
      const contenedorItems = document.getElementById("checkout-items");
      const contenedorTotales = document.getElementById("checkout-totals");

      if (cart.length === 0) {
        contenedorItems.innerHTML = "<p>Tu carrito está vacío.</p>";
        contenedorTotales.innerHTML = "";
        return;
      }

      contenedorItems.innerHTML = cart.map(item => `
        <div class="summary-item">
          <img class="summary-image" src="${item.image || 'img/logoGRWU.png'}" alt="${item.name}">
          <div class="summary-item-info">
            <p class="summary-name">${item.name}</p>
            <p class="summary-detail">Cantidad: ${item.qty}</p>
          </div>
          <p class="summary-price">${formatearCLP(item.price * item.qty)}</p>
          <button type="button" class="btn-eliminar" data-id="${item.id}">✕</button>
        </div>
      `).join("");

      const tipoDespacho = document.querySelector('input[name="envio"]:checked').value;
      const { subtotal, envio, total } = calcularTotal(cart, tipoDespacho);

      contenedorTotales.innerHTML = `
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatearCLP(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Despacho (${tipoDespacho === "premium" ? "premium" : "estándar"})</span>
          <span>${envio === 0 ? "Gratis" : formatearCLP(envio)}</span>
        </div>
        <div class="summary-row summary-row-total">
          <span>Total a pagar</span>
          <span>${formatearCLP(total)}</span>
        </div>
      `;

      // Conecta cada botón "✕" recién creado con removeFromCart
      document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
          removeFromCart(btn.dataset.id);
          renderCheckout(); // vuelve a dibujar todo con el carrito ya actualizado
          if (typeof getCart === "function") {
            const contador = document.getElementById("cart-count");
            if (contador) contador.textContent = getCart().reduce((t, i) => t + i.qty, 0);
          }
        });
      });
    }

    renderCheckout();

    // Cada vez que cambie el tipo de despacho, se recalcula el resumen (subtotal/envío/total)
    document.querySelectorAll('input[name="envio"]').forEach(radio => {
      radio.addEventListener("change", renderCheckout);
    });

    // ---------- Región / Comuna ----------
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");
    conectarRegionComuna(selectRegion, selectComuna);

    // ---------- Prellenar con los datos de la cuenta, si existen ----------
    const datosUsuario = localStorage.getItem("GRWU_Usuario");
    const avisoSesion = document.getElementById("avisoSesion");

    if (datosUsuario) {
      const usuario = JSON.parse(datosUsuario);

      document.getElementById("nombreEnvio").value = usuario.nombre || "";
      document.getElementById("telefono").value = usuario.telefono || "";
      document.getElementById("direccion").value = usuario.direccion || "";

      const indiceRegion = REGIONES.findIndex(r => r.nombre === usuario.region);
      if (indiceRegion !== -1) {
        selectRegion.value = indiceRegion;
        poblarSelectComunas(selectComuna, indiceRegion);
        selectComuna.value = usuario.comuna || "";
      }

      // El registro no pide dirección; si ya compró antes, la dirección también quedó guardada.
      const mensajeDireccion = usuario.direccion
        ? "precargamos tu nombre, teléfono, región, comuna y dirección."
        : "precargamos tu nombre, teléfono, región y comuna. Solo debes ingresar la dirección exacta.";
      avisoSesion.textContent = `Sesión iniciada como ${usuario.nombre}: ${mensajeDireccion}`;
      avisoSesion.style.display = "block";
    } else {
      avisoSesion.textContent = "No hay una sesión iniciada. Completa tus datos de envío manualmente, o inicia sesión para que se autocompleten.";
      avisoSesion.style.display = "block";
    }

    // ---------- Validaciones del formulario de envío ----------
    function validarCampoNombreEnvio() {
      const valor = document.getElementById("nombreEnvio").value.trim();
      const mensaje = !valor ? "El nombre es obligatorio." : "";
      mostrarError("nombreEnvio", mensaje);
      return !mensaje;
    }

    function validarCampoDireccion() {
      const valor = document.getElementById("direccion").value.trim();
      let mensaje = "";
      if (!valor) mensaje = "La dirección es obligatoria.";
      else if (valor.length > 300) mensaje = "La dirección no puede superar los 300 caracteres.";
      mostrarError("direccion", mensaje);
      return !mensaje;
    }

    function validarCampoRegionEnvio() {
      const mensaje = selectRegion.value === "" ? "Debes seleccionar una región." : "";
      mostrarError("region", mensaje);
      return !mensaje;
    }

    function validarCampoComunaEnvio() {
      const mensaje = selectComuna.value === "" ? "Debes seleccionar una comuna." : "";
      mostrarError("comuna", mensaje);
      return !mensaje;
    }

    function validarCampoTelefono() {
      const valor = document.getElementById("telefono").value.trim();
      // Acepta números, espacios, +, y guiones. Ej: +56 9 1234 5678
      const formatoValido = /^[+\d][\d\s-]{6,14}$/.test(valor);
      let mensaje = "";
      if (!valor) mensaje = "El teléfono es obligatorio.";
      else if (!formatoValido) mensaje = "Ingresa un teléfono válido, ej: +56 9 1234 5678.";
      mostrarError("telefono", mensaje);
      return !mensaje;
    }

    function validarMetodoPago() {
      const seleccionado = document.querySelector('input[name="metodoPago"]:checked');
      const mensaje = !seleccionado ? "Debes seleccionar un método de pago." : "";
      mostrarError("metodoPago", mensaje);
      return !mensaje;
    }

    document.getElementById("nombreEnvio").addEventListener("blur", validarCampoNombreEnvio);
    document.getElementById("direccion").addEventListener("blur", validarCampoDireccion);
    selectRegion.addEventListener("change", validarCampoRegionEnvio);
    selectComuna.addEventListener("change", validarCampoComunaEnvio);
    document.getElementById("telefono").addEventListener("blur", validarCampoTelefono);
    document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
      radio.addEventListener("change", validarMetodoPago);
    });

    document.getElementById("formCheckout").addEventListener("submit", (evento) => {
      evento.preventDefault();

      if (getCart().length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de continuar.");
        return;
      }

      const esValido = [
        validarCampoNombreEnvio(),
        validarCampoDireccion(),
        validarCampoRegionEnvio(),
        validarCampoComunaEnvio(),
        validarCampoTelefono(),
        validarMetodoPago()
      ].every(Boolean);

      if (!esValido) return;

      // Si hay sesión iniciada, guardamos la dirección para que la próxima compra también venga precargada.
      if (datosUsuario) {
        const usuarioActualizado = JSON.parse(localStorage.getItem("GRWU_Usuario"));
        usuarioActualizado.direccion = document.getElementById("direccion").value.trim();
        localStorage.setItem("GRWU_Usuario", JSON.stringify(usuarioActualizado));

        // También reflejamos la dirección nueva en el registro del admin.
        sincronizarUsuarioAdmin({
          run: usuarioActualizado.run,
          direccion: usuarioActualizado.direccion
        });
      }

      // Guardamos un resumen de la compra para mostrarlo en la pantalla de éxito
      const nombresMetodoPago = {
        credito: "Tarjeta de crédito",
        debito: "Tarjeta de débito",
        transferencia: "Transferencia electrónica"
      };
      const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;
      const tipoDespachoFinal = document.querySelector('input[name="envio"]:checked').value;
      const { total } = calcularTotal(getCart(), tipoDespachoFinal);

      sessionStorage.setItem("GRWU_UltimaCompra", JSON.stringify({
        numeroOrden: "GRWU-" + Date.now().toString().slice(-8),
        total,
        metodoPago: nombresMetodoPago[metodoPagoSeleccionado],
        nombre: document.getElementById("nombreEnvio").value.trim()
      }));

      // Compra confirmada: vaciamos el carrito y vamos a la pantalla de éxito
      saveCart([]);
      window.location.href = "compra-exitosa.html";
    });