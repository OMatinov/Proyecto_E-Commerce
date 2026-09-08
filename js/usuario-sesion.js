// usuario-sesion.js - Puente entre el modelo de cliente y el admin.
// Autor: César
//
// registro.html y checkout.html guardan al cliente en localStorage con la
// clave "GRWU_Usuario" (un solo objeto: la cuenta activa en este
// navegador). Ese modelo es distinto y más simple que el que usa el panel
// de Katerine, que guarda un ARREGLO de usuarios en "grwu_usuariosAdmin"
// (clave definida también en js/admin/admin-datos.js) con campos extra
// (apellidos, fechaNacimiento, dirección).
//
// Este archivo sincroniza ambos mundos: cada vez que un cliente se registra
// o actualiza sus datos, además de guardarse en "GRWU_Usuario",
// queda reflejado en "grwu_usuariosAdmin" para que aparezca en la tabla de
// usuarios del admin.
//
// Requiere (opcional) que js/usuarios.js esté cargado antes: si el admin
// nunca se ha abierto en este navegador, usamos ese arreglo semilla como
// punto de partida, para no perder los usuarios de ejemplo de Katerine.

const CLAVE_USUARIOS_ADMIN = "grwu_usuariosAdmin";

// Separa "Camila Olmedo" en { nombre: "Camila", apellidos: "Olmedo" }.
// El registro del cliente solo pide "nombre completo" en un campo; el
// admin en cambio separa nombre y apellidos.
function separarNombreApellidos(nombreCompleto) {
  const partes = (nombreCompleto || "").trim().split(/\s+/);
  const nombre = partes.shift() || "";
  const apellidos = partes.join(" ");
  return { nombre, apellidos };
}

function cargarUsuariosAdminBase() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS_ADMIN);
  if (guardado) return JSON.parse(guardado);
  // Si el admin nunca sembró su localStorage, partimos desde el arreglo
  // semilla (usuarios.js) para no perder esos usuarios de ejemplo.
  return typeof usuarios !== "undefined" ? usuarios.slice() : [];
}

// Crea o actualiza (por RUN) un usuario dentro de "grwu_usuariosAdmin".
// `datosParciales` se combina con el registro existente si ya había uno,
// así no se pisan campos que el cliente no maneja (ej: apellidos,
// fechaNacimiento) si ya los había cargado el admin manualmente.
function sincronizarUsuarioAdmin(datosParciales) {
  const lista = cargarUsuariosAdminBase();
  const indice = lista.findIndex(function (u) { return u.run === datosParciales.run; });

  if (indice >= 0) {
    lista[indice] = Object.assign({}, lista[indice], datosParciales);
  } else {
    lista.push(Object.assign({
      apellidos: "",
      fechaNacimiento: "",
      direccion: ""
    }, datosParciales));
  }

  localStorage.setItem(CLAVE_USUARIOS_ADMIN, JSON.stringify(lista));
}
