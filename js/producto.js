/**
 * producto.js - Lógica para la página de detalle de producto
 * Maneja: carrusel, selección de tallas, stock, agregar al carrito
 */

// Variables globales para el producto actual y talla seleccionada
let productoActual = null;
let tallaSeleccionada = null;

/**
 * Inicializa la página de producto
 */
function initProductoPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  productoActual = PRODUCTOS.find(p => p.id === productId);

  if (!productoActual) {
    mostrarProductoNoEncontrado();
    return;
  }

  renderizarDatosProducto(productoActual);
  renderizarTallasConStock(productoActual, '#tallas-container');
  actualizarInfoStock(productoActual);
  inicializarCarrusel(productoActual);
  inicializarEventosTallas();
  inicializarBotonAgregar();
}

/**
 * Muestra mensaje cuando el producto no existe
 */
function mostrarProductoNoEncontrado() {
  document.getElementById('p-title').textContent = 'Producto no encontrado';
  document.getElementById('p-category').textContent = '';
  document.getElementById('p-price').textContent = '';
  document.getElementById('p-description').textContent = '';
  document.getElementById('stock-info').textContent = '';
}

/**
 * Renderiza los datos básicos del producto en el DOM
 */
function renderizarDatosProducto(producto) {
  const precioFormateado = '$' + producto.precio.toLocaleString('es-CL');

  document.getElementById('p-category').textContent = producto.categoria;
  document.getElementById('p-title').textContent = producto.nombre;
  document.getElementById('p-price').textContent = precioFormateado;
  document.getElementById('p-description').textContent = producto.descripcion;
}

/**
 * Inicializa el carrusel de imágenes
 */
function inicializarCarrusel(producto) {
  let current = 0;
  const images = producto.imagenes || ['img/default.png'];
  const img = document.getElementById('carousel-img');
  const indicator = document.getElementById('carousel-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function updateCarousel() {
    img.src = images[current];
    img.alt = producto.nombre;
    indicator.textContent = (current + 1) + ' / ' + images.length;
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      current = (current - 1 + images.length) % images.length;
      updateCarousel();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      current = (current + 1) % images.length;
      updateCarousel();
    };
  }

  updateCarousel();
}

/**
 * Inicializa los eventos de selección de tallas
 */
function inicializarEventosTallas() {
  document.querySelectorAll('.size-chip:not(.size-chip-disabled)').forEach(chip => {
    chip.addEventListener('click', () => {
      // Remover selección previa
      document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('size-chip-active'));
      // Seleccionar nueva talla
      chip.classList.add('size-chip-active');
      tallaSeleccionada = chip.dataset.talla;

      // Actualizar estado del botón agregar al carrito
      validarBotonAgregar();
    });
  });
}

/**
 * Valida y actualiza el estado del botón "Agregar al carrito"
 */
function validarBotonAgregar() {
  const btnAgregar = document.getElementById('btn-agregar');

  if (!btnAgregar) return false;

  if (!tallaSeleccionada) {
    btnAgregar.disabled = true;
    btnAgregar.style.opacity = '0.6';
    btnAgregar.textContent = 'Selecciona una talla';
    return false;
  }

  const stockTalla = obtenerStockProducto(productoActual, tallaSeleccionada);
  if (stockTalla === 0) {
    btnAgregar.disabled = true;
    btnAgregar.style.opacity = '0.6';
    btnAgregar.textContent = 'Sin stock en esta talla';
    return false;
  }

  btnAgregar.disabled = false;
  btnAgregar.style.opacity = '1';
  btnAgregar.textContent = 'Agregar al carrito';
  return true;
}

/**
 * Actualiza la información de stock visible para el usuario
 */
function actualizarInfoStock(producto) {
  const stockInfo = document.getElementById('stock-info');

  if (!stockInfo || !producto.stock) {
    if (stockInfo) stockInfo.textContent = '';
    return;
  }

  const stockTotal = Object.values(producto.stock).reduce((a, b) => a + b, 0);

  if (stockTotal === 0) {
    stockInfo.textContent = '⚠️ Producto agotado. Pronto disponible.';
    stockInfo.style.color = 'var(--color-error)';
  } else if (stockTotal < 20) {
    stockInfo.textContent = `⚡ ¡Últimas unidades! Solo quedan ${stockTotal} productos.`;
    stockInfo.style.color = 'var(--color-acento)';
  } else {
    stockInfo.textContent = '✓ En stock - Despacho en 24-48 hrs';
    stockInfo.style.color = 'var(--color-primario)';
  }
}

/**
 * Inicializa el evento del botón "Agregar al carrito"
 */
function inicializarBotonAgregar() {
  const btnAgregar = document.getElementById('btn-agregar');

  if (!btnAgregar) return;

  btnAgregar.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validarBotonAgregar()) {
      return;
    }

    const stockDisponible = obtenerStockProducto(productoActual, tallaSeleccionada);
    if (stockDisponible < 1) {
      alert('Lo sentimos, no hay stock disponible en esta talla.');
      return;
    }

    addToCart({
      id: productoActual.id,
      name: productoActual.nombre,
      price: productoActual.precio,
      image: productoActual.imagen,
      qty: 1,
      talla: tallaSeleccionada
    });

        // Dentro del evento click del botón, justo después de addToCart:
    btnAgregar.textContent = '¡Agregado! ✓';
    btnAgregar.classList.add('agregado');
    btnAgregar.disabled = true;

    // Redirigir después de 800ms para que se vea el feedback
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 800);

    window.location.href = 'checkout.html';
  });

  // Validación inicial del botón
  validarBotonAgregar();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initProductoPage);
