// Función para formatear precio
function formatoPrecioCLP(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

// Función para renderizar los productos en el grid
function renderizarProductos(lista) {
  const contenedor = document.getElementById('product-grid');
  contenedor.innerHTML = '';

  lista.forEach(producto => {
    const tarjeta = `
      <a href="producto.html?id=${producto.id}" class="product-card-link">
        <article class="product-card">
          <div class="product-card-image">
            <img src="${producto.imagen}" alt="${producto.nombre}">
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

// Filtro por categoría
function filtrarPorCategoria(categoria) {
  let listaFiltrada = PRODUCTOS;
  if (categoria !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  }
  // Aplicar también el filtro de género actual
  const generoActivo = document.querySelector('.gender-button.active')?.dataset.gender || 'todos';
  if (generoActivo !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === generoActivo);
  }
  renderizarProductos(listaFiltrada);
}

// Filtro por género
function filtrarPorGenero(genero) {
  let listaFiltrada = PRODUCTOS;
  if (genero !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.genero === genero);
  }
  // Aplicar también el filtro de categoría actual
  const categoriaActiva = document.querySelector('.filter-button.active')?.dataset.category || 'todos';
  if (categoriaActiva !== 'todos') {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoriaActiva);
  }
  renderizarProductos(listaFiltrada);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos(PRODUCTOS);

  // Botones de categoría
  document.querySelectorAll('.filter-button').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      filtrarPorCategoria(boton.dataset.category);
    });
  });

  // Botones de género
  document.querySelectorAll('.gender-button').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.gender-button').forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      filtrarPorGenero(boton.dataset.gender);
    });
  });
});