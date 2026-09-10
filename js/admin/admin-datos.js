const CLAVE_PRODUCTOS_ADMIN = "grwu_productosAdmin";
const CLAVE_USUARIOS_ADMIN = "grwu_usuariosAdmin";

//  Productos 

function cargarProductosAdmin() {
  const guardado = localStorage.getItem(CLAVE_PRODUCTOS_ADMIN);
  if (guardado) return JSON.parse(guardado);

  const productosConInventario = PRODUCTOS.map(function (p) {
    // Convertir el objeto de stock por talla en un stock total numérico
    const stockTotal = p.stock ? Object.values(p.stock).reduce((a, b) => a + b, 0) : 10;
    return Object.assign({}, p, {
      codigo: p.id.toUpperCase(),
      stock: stockTotal,
      stockCritico: 3
    });
  });

  localStorage.setItem(CLAVE_PRODUCTOS_ADMIN, JSON.stringify(productosConInventario));
  return productosConInventario;
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS_ADMIN, JSON.stringify(lista));
}

function obtenerProductoPorId(id) {
  return cargarProductosAdmin().find(function (p) { return p.id === id; });
}

function guardarProducto(productoNuevo) {
  const lista = cargarProductosAdmin();
  const indice = lista.findIndex(function (p) { return p.id === productoNuevo.id; });
  if (indice >= 0) {
    lista[indice] = productoNuevo;
  } else {
    lista.push(productoNuevo);
  }
  guardarProductosAdmin(lista);
}

function eliminarProducto(id) {
  const lista = cargarProductosAdmin().filter(function (p) { return p.id !== id; });
  guardarProductosAdmin(lista);
}

// Usuarios 

function cargarUsuariosAdmin() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS_ADMIN);
  if (guardado) return JSON.parse(guardado);
  localStorage.setItem(CLAVE_USUARIOS_ADMIN, JSON.stringify(usuarios));
  return usuarios.slice();
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(CLAVE_USUARIOS_ADMIN, JSON.stringify(lista));
}

function obtenerUsuarioPorRun(run) {
  return cargarUsuariosAdmin().find(function (u) { return u.run === run; });
}

function guardarUsuario(usuarioNuevo) {
  const lista = cargarUsuariosAdmin();
  const indice = lista.findIndex(function (u) { return u.run === usuarioNuevo.run; });
  if (indice >= 0) {
    lista[indice] = usuarioNuevo;
  } else {
    lista.push(usuarioNuevo);
  }
  guardarUsuariosAdmin(lista);
}

function eliminarUsuario(run) {
  const lista = cargarUsuariosAdmin().filter(function (u) { return u.run !== run; });
  guardarUsuariosAdmin(lista);
}