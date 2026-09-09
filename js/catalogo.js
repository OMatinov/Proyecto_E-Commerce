// catalogo.js (VERSIÓN CORREGIDA)
// Eliminadas: formatoPrecioCLP, obtenerStockProducto, hayStockDisponible, renderizarTallasConStock
// Ahora vienen de utils.js
function renderizarProductos(lista) {
  const contenedor = document.getElementById('product-grid');
  contenedor.innerHTML = '';

  lista.forEach(producto => {
    const stockTotal = producto.stock ? Object.values(producto.stock).reduce((a, b) => a + b, 0) : 0;
    const sinStock = stockTotal === 0;

    const tarjeta = `
      <a href="producto.html?id=${producto.id}" class="product-card-link ${sinStock ? 'product-sin-stock' : ''}">
        <article class="product-card ${sinStock ? 'product-card-sin-stock' : ''}">
          <div class="product-card-image">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            ${sinStock ? '<div class="badge-sin-stock">Agotado</div>' : ''}
          </div>
          <div class="product-body">
            <p class="product-category">${producto.categoria}</p>
            <h4 class="product-name">${producto.nombre}</h4>
            <p class="product-price">${formatoPrecioCLP(producto.precio)}</p>
          </div>
        </article>
      </a>
    `;
    contenedor.innerHTML += tarjeta;
  });
}

function filtrarPorCategoria(categoria) {
  let listaFiltrada = PRODUCTOS;
  if (categoria !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  }
  const generoActivo = document.querySelector('.gender-button.active')?.dataset.gender || 'todos';
  if (generoActivo !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === generoActivo);
  }
  renderizarProductos(listaFiltrada);
}

function filtrarPorGenero(genero) {
  let listaFiltrada = PRODUCTOS;
  if (genero !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === genero);
  }
  const categoriaActiva = document.querySelector('.filter-button.active')?.dataset.category || 'todos';
  if (categoriaActiva !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoriaActiva);
  }
  renderizarProductos(listaFiltrada);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos(PRODUCTOS);

  document.querySelectorAll('.filter-button').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      filtrarPorCategoria(boton.dataset.category);
    });
  });

  document.querySelectorAll('.gender-button').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.gender-button').forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      filtrarPorGenero(boton.dataset.gender);
    });
  });
});