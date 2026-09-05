// datos-admin.js - Persistencia compartida del panel admin (productos y usuarios)
// Autor: Katerine
//
// Como todavía no hay backend, el admin trabaja sobre localStorage:
// la primera vez que se visita el panel, se "siembra" con los arreglos
// base de productos.js y usuarios.js; desde ahí, crear/editar/eliminar
// se guarda en localStorage y sobrevive a recargar la página.
//
// Se carga en admin-index.html, admin-productos.html y admin-usuarios.html,
// después de productos.js y usuarios.js.

const CLAVE_PRODUCTOS_ADMIN = "grwu_productosAdmin";
const CLAVE_USUARIOS_ADMIN = "grwu_usuariosAdmin";

// ---------- Productos ----------

function cargarProductosAdmin() {
  const guardado = localStorage.getItem(CLAVE_PRODUCTOS_ADMIN);
  if (guardado) return JSON.parse(guardado);
  localStorage.setItem(CLAVE_PRODUCTOS_ADMIN, JSON.stringify(productos));
  return productos.slice();
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

// ---------- Usuarios ----------

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