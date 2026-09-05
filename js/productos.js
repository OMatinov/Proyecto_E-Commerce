
const PRODUCTOS_POR_PAGINA = 10;

let estadoProductos = {
  busqueda: "",
  categoria: "todos",
  genero: "todos",
  pagina: 1
};

function formatoPrecioCLP(numero) {
  return "$" + Number(numero).toLocaleString("es-CL");
}

function productosFiltrados() {
  let lista = cargarProductosAdmin();

  if (estadoProductos.categoria !== "todos") {
    lista = lista.filter(function (p) { return p.categoria === estadoProductos.categoria; });
  }
  if (estadoProductos.genero !== "todos") {
    lista = lista.filter(function (p) { return p.genero === estadoProductos.genero; });
  }
  if (estadoProductos.busqueda.trim() !== "") {
    const termino = estadoProductos.busqueda.trim().toLowerCase();
    lista = lista.filter(function (p) {
      return p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino);
    });
  }
  return lista;
}

function renderizarTablaProductos() {
  const todos = productosFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(todos.length / PRODUCTOS_POR_PAGINA));
  if (estadoProductos.pagina > totalPaginas) estadoProductos.pagina = totalPaginas;

  const inicio = (estadoProductos.pagina - 1) * PRODUCTOS_POR_PAGINA;
  const pagina = todos.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  const cuerpo = document.getElementById("tablaProductosBody");

  if (pagina.length === 0) {
    cuerpo.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><p>📭 No hay productos</p>' +
      "<p>Prueba con otro filtro o crea un producto nuevo.</p></div></td></tr>";
  } else {
    cuerpo.innerHTML = pagina.map(function (p) {
      const alertaStock =
        p.stockCritico !== null && p.stockCritico !== undefined && p.stock <= p.stockCritico
          ? ' <span class="table-badge badge-oscuro">crítico</span>'
          : "";

      return (
        "<tr>" +
        '<td><div class="table-product">' +
        '<img class="table-product-img" src="../' + (p.imagen || "img/LogoTiendasUrbano.jpeg") + '" alt="' + p.nombre + '">' +
        '<span class="table-product-name">' + p.nombre + "</span>" +
        "</div></td>" +
        "<td>" + p.categoria + "</td>" +
        "<td>" + p.genero + "</td>" +
        '<td class="table-price">' + formatoPrecioCLP(p.precio) + "</td>" +
        "<td>" + p.stock + alertaStock + "</td>" +
        '<td class="table-actions solo-admin">' +
        '<button class="btn-icon btn-icon-edit" title="Editar" data-editar-id="' + p.id + '">✏️</button>' +
        '<button class="btn-icon btn-icon-delete" title="Eliminar" data-eliminar-id="' + p.id + '">🗑️</button>' +
        "</td>" +
        "</tr>"
      );
    }).join("");
  }

  document.getElementById("paginacionInfo").textContent =
    "Mostrando " + pagina.length + " de " + todos.length + " productos";

  const contenedorBotones = document.getElementById("paginacionBotones");
  let botonesHtml = "";
  for (let i = 1; i <= totalPaginas; i++) {
    botonesHtml +=
      '<button class="page-btn' + (i === estadoProductos.pagina ? " page-btn-active" : "") +
      '" data-pagina="' + i + '">' + i + "</button>";
  }
  contenedorBotones.innerHTML = botonesHtml;

  document.querySelectorAll("[data-pagina]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      estadoProductos.pagina = parseInt(boton.dataset.pagina, 10);
      renderizarTablaProductos();
    });
  });

  document.querySelectorAll("[data-editar-id]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirModalProducto(boton.dataset.editarId);
    });
  });

  document.querySelectorAll("[data-eliminar-id]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const id = boton.dataset.eliminarId;
      if (confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) {
        eliminarProducto(id);
        renderizarTablaProductos();
      }
    });
  });

  // vuelve a aplicar las restricciones de rol sobre los botones recién creados
  aplicarRestriccionesDeRol();
}

// ---------- Modal ----------

function abrirModalProducto(id) {
  const formulario = document.getElementById("formProducto");
  formulario.reset();
  ["codigoProducto", "nombreProducto", "descripcionProducto", "precioProducto", "stockProducto", "stockCriticoProducto", "categoriaProducto", "generoProducto"]
    .forEach(function (idCampo) { mostrarError(idCampo, ""); });

  if (id) {
    const producto = obtenerProductoPorId(id);
    document.getElementById("tituloModalProducto").textContent = "Editar producto";
    document.getElementById("idProductoEditando").value = producto.id;
    document.getElementById("codigoProducto").value = producto.codigo;
    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("descripcionProducto").value = producto.descripcion || "";
    document.getElementById("precioProducto").value = producto.precio;
    document.getElementById("stockProducto").value = producto.stock;
    document.getElementById("stockCriticoProducto").value =
      producto.stockCritico === null || producto.stockCritico === undefined ? "" : producto.stockCritico;
    document.getElementById("categoriaProducto").value = producto.categoria;
    document.getElementById("generoProducto").value = producto.genero;
    document.getElementById("imagenProducto").value = producto.imagen || "";
  } else {
    document.getElementById("tituloModalProducto").textContent = "Nuevo producto";
    document.getElementById("idProductoEditando").value = "";
  }

  document.getElementById("modalProducto").classList.add("active");
}

function cerrarModalProducto() {
  document.getElementById("modalProducto").classList.remove("active");
}

// ---------- Validación del formulario ----------

function validarCodigoProducto() {
  const valor = document.getElementById("codigoProducto").value.trim();
  let mensaje = "";
  if (!valor) mensaje = "El código es obligatorio.";
  else if (valor.length < 3) mensaje = "El código debe tener al menos 3 caracteres.";
  mostrarError("codigoProducto", mensaje);
  return !mensaje;
}

function validarNombreProducto() {
  const valor = document.getElementById("nombreProducto").value.trim();
  let mensaje = "";
  if (!valor) mensaje = "El nombre es obligatorio.";
  else if (valor.length > 100) mensaje = "El nombre no puede superar los 100 caracteres.";
  mostrarError("nombreProducto", mensaje);
  return !mensaje;
}

function validarDescripcionProducto() {
  const valor = document.getElementById("descripcionProducto").value.trim();
  const mensaje = valor.length > 500 ? "La descripción no puede superar los 500 caracteres." : "";
  mostrarError("descripcionProducto", mensaje);
  return !mensaje;
}

function validarPrecioProducto() {
  const valor = document.getElementById("precioProducto").value;
  let mensaje = "";
  if (valor === "") mensaje = "El precio es obligatorio.";
  else if (Number(valor) < 0) mensaje = "El precio no puede ser negativo.";
  mostrarError("precioProducto", mensaje);
  return !mensaje;
}

function validarStockProducto() {
  const valor = document.getElementById("stockProducto").value;
  let mensaje = "";
  if (valor === "") mensaje = "El stock es obligatorio.";
  else if (!Number.isInteger(Number(valor)) || Number(valor) < 0) mensaje = "El stock debe ser un entero igual o mayor a 0.";
  mostrarError("stockProducto", mensaje);
  return !mensaje;
}

function validarStockCriticoProducto() {
  const valor = document.getElementById("stockCriticoProducto").value;
  let mensaje = "";
  if (valor !== "" && (!Number.isInteger(Number(valor)) || Number(valor) < 0)) {
    mensaje = "El stock crítico debe ser un entero igual o mayor a 0.";
  }
  mostrarError("stockCriticoProducto", mensaje);
  return !mensaje;
}

function validarCategoriaProducto() {
  const valor = document.getElementById("categoriaProducto").value;
  const mensaje = valor === "" ? "Selecciona una categoría." : "";
  mostrarError("categoriaProducto", mensaje);
  return !mensaje;
}

function validarGeneroProducto() {
  const valor = document.getElementById("generoProducto").value;
  const mensaje = valor === "" ? "Selecciona un género." : "";
  mostrarError("generoProducto", mensaje);
  return !mensaje;
}

// ---------- Inicialización ----------

document.addEventListener("DOMContentLoaded", function () {
  renderizarTablaProductos();

  document.getElementById("buscarProducto").addEventListener("input", function (evento) {
    estadoProductos.busqueda = evento.target.value;
    estadoProductos.pagina = 1;
    renderizarTablaProductos();
  });
  document.getElementById("filtroCategoria").addEventListener("change", function (evento) {
    estadoProductos.categoria = evento.target.value;
    estadoProductos.pagina = 1;
    renderizarTablaProductos();
  });
  document.getElementById("filtroGenero").addEventListener("change", function (evento) {
    estadoProductos.genero = evento.target.value;
    estadoProductos.pagina = 1;
    renderizarTablaProductos();
  });

  [
    ["codigoProducto", validarCodigoProducto],
    ["nombreProducto", validarNombreProducto],
    ["descripcionProducto", validarDescripcionProducto],
    ["precioProducto", validarPrecioProducto],
    ["stockProducto", validarStockProducto],
    ["stockCriticoProducto", validarStockCriticoProducto],
    ["categoriaProducto", validarCategoriaProducto],
    ["generoProducto", validarGeneroProducto]
  ].forEach(function (par) {
    const campo = document.getElementById(par[0]);
    campo.addEventListener("blur", par[1]);
    campo.addEventListener("change", par[1]);
  });

  document.getElementById("formProducto").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const valido = [
      validarCodigoProducto(), validarNombreProducto(), validarDescripcionProducto(),
      validarPrecioProducto(), validarStockProducto(), validarStockCriticoProducto(),
      validarCategoriaProducto(), validarGeneroProducto()
    ].every(Boolean);

    if (!valido) return;

    const idEditando = document.getElementById("idProductoEditando").value;
    const codigo = document.getElementById("codigoProducto").value.trim();
    const stockCriticoValor = document.getElementById("stockCriticoProducto").value;

    const producto = {
      id: idEditando || (codigo.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()),
      codigo: codigo,
      nombre: document.getElementById("nombreProducto").value.trim(),
      categoria: document.getElementById("categoriaProducto").value,
      genero: document.getElementById("generoProducto").value,
      precio: Number(document.getElementById("precioProducto").value),
      stock: Number(document.getElementById("stockProducto").value),
      stockCritico: stockCriticoValor === "" ? null : Number(stockCriticoValor),
      imagen: document.getElementById("imagenProducto").value.trim() || "img/LogoTiendasUrbano.jpeg",
      descripcion: document.getElementById("descripcionProducto").value.trim()
    };

    guardarProducto(producto);
    cerrarModalProducto();
    renderizarTablaProductos();
  });
});