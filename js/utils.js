// js/utils.js - Funciones compartidas entre catálogo y producto

function formatoPrecioCLP(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

function obtenerStockProducto(producto, talla) {
  if (!producto || !producto.stock) return 0;
  return producto.stock[talla] || 0;
}

function hayStockDisponible(producto, talla, cantidad = 1) {
  const stock = obtenerStockProducto(producto, talla);
  return stock >= cantidad;
}

function renderizarTallasConStock(producto, contenedorSelector) {
  const contenedor = document.querySelector(contenedorSelector);
  if (!contenedor || !producto) return;

  // Puedes usar las tallas definidas en CONFIG_STOCK.tallasDisponibles si lo prefieres
  const tallas = ["S", "M", "L", "XL"];

  contenedor.innerHTML = '';

  tallas.forEach(talla => {
    const stock = obtenerStockProducto(producto, talla);
    const chip = document.createElement('button');
    chip.className = 'size-chip';
    chip.textContent = talla;
    chip.dataset.talla = talla;
    chip.dataset.stock = stock;

    if (stock === 0) {
      chip.classList.add('size-chip-disabled');
      chip.disabled = true;
      chip.title = 'Sin stock';
    } else if (stock < 5) {
      chip.classList.add('size-chip-low-stock');
      chip.title = `Solo ${stock} unidades`;
    } else {
      chip.classList.add('size-chip-active'); // seleccionable por defecto
    }

    contenedor.appendChild(chip);
  });
}
console.log("utils.js cargado correctamente");