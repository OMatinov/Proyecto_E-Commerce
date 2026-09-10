// catalogo.js (VERSIÓN CORREGIDA)
// Eliminadas: formatoPrecioCLP, obtenerStockProducto, hayStockDisponible, renderizarTallasConStock
// Ahora vienen de utils.js
let productosFiltrados = [];
const PRODUCTOS_POR_PAGINA = 12;
let paginaActual = 1;

function renderizarProductos(lista) {
  const contenedor = document.getElementById('product-grid');
  contenedor.innerHTML = '';

  // Calcular índices de página
  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const fin = inicio + PRODUCTOS_POR_PAGINA;
  const productosPagina = lista.slice(inicio, fin);

  if (productosPagina.length === 0) {
    contenedor.innerHTML = '<p class="empty-state">No hay productos en esta página.</p>';
    return;
  }

  productosPagina.forEach(producto => {
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

  // Actualizar la paginación con el total de productos filtrados
  renderizarPaginacion(lista.length);
}

function renderizarPaginacion(totalProductos) {
  const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA);
  const contenedor = document.getElementById('pagination-container');
  if (!contenedor) return;

  if (totalPaginas <= 1) {
    contenedor.innerHTML = '';
    return;
  }

  let html = '<div class="pagination">';
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="page-btn ${i === paginaActual ? 'page-btn-active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += '</div>';
  contenedor.innerHTML = html;

  // Eventos a los botones
  contenedor.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      paginaActual = parseInt(btn.dataset.page);
      aplicarFiltrosYPaginacion();
    });
  });
}

function aplicarFiltrosYPaginacion() {
  let listaFiltrada = PRODUCTOS;

  const categoriaActiva = document.querySelector('.filter-button.active')?.dataset.category || 'todos';
  if (categoriaActiva !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoriaActiva);
  }

  const generoActivo = document.querySelector('.gender-button.active')?.dataset.gender || 'todos';
  if (generoActivo !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === generoActivo);
  }

  productosFiltrados = listaFiltrada; // guardamos para referencia
  renderizarProductos(productosFiltrados);
}

/*function filtrarPorCategoria(categoria) {
  let listaFiltrada = PRODUCTOS;
  if (categoria !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  }
  const generoActivo = document.querySelector('.gender-button.active')?.dataset.gender || 'todos';
  if (generoActivo !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === generoActivo);
  }
  renderizarPagina (listaFiltrada);
}*/

/*function filtrarPorGenero(genero) {
  let listaFiltrada = PRODUCTOS;
  if (genero !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === genero);
  }
  const categoriaActiva = document.querySelector('.filter-button.active')?.dataset.category || 'todos';
  if (categoriaActiva !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoriaActiva);
  }
  renderizarPagina(listaFiltrada);
}*/

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  paginaActual = 1;
  aplicarFiltrosYPaginacion();

  document.querySelectorAll('.filter-button').forEach(boton => {
    boton.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    paginaActual = 1; // reiniciar paginación al cambiar filtro
    aplicarFiltrosYPaginacion();
  });
});

  document.querySelectorAll('.gender-button').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.gender-button').forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      paginaActual = 1; // reiniciar paginación al cambiar filtro
      aplicarFiltrosYPaginacion();
    });
  });
});