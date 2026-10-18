// usuariosData.js - "Base de datos" de usuarios con CRUD (Evaluación 2).
// Autor: César
//
// Persistencia: localStorage, clave "grwu_usuarios". Si no existe, se siembra con
// USUARIOS_SEMILLA (los de js/usuarios.js, ahora con contraseña para poder hacer login).
// Las funciones que devuelven usuarios NUNCA incluyen la clave (ver sinClave).

import { leer, guardar } from "./storage.js";
import { limpiarRun } from "../utils/validaciones.js";

export const CLAVE_USUARIOS = "grwu_usuarios";

export const USUARIOS_SEMILLA = [
  { run: "190110222", nombre: "Camila", apellidos: "Olmedo Pérez", correo: "camila.olmedo@duoc.cl", clave: "1234", fechaNacimiento: "1998-04-12", tipoUsuario: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Av. Libertador Bernardo O'Higgins 1234", telefono: "+56 9 1234 5678" },
  { run: "172076920", nombre: "Matías", apellidos: "Fuentes Rivas", correo: "matias.fuentes@duoc.cl", clave: "1234", fechaNacimiento: "1999-09-03", tipoUsuario: "Vendedor", region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Calle Álvarez 456", telefono: "+56 9 8765 4321" },
  { run: "888888888", nombre: "César", apellidos: "Muñoz Díaz", correo: "cesar.munoz@gmail.com", clave: "1234", fechaNacimiento: "1997-01-20", tipoUsuario: "Vendedor", region: "Región del Biobío", comuna: "Concepción", direccion: "Los Carrera 789", telefono: "+56 9 5555 1122" },
  { run: "111111111", nombre: "Katerine", apellidos: "Soto Vega", correo: "katerine.soto@profesor.duoc.cl", clave: "1234", fechaNacimiento: "1995-11-08", tipoUsuario: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Providencia", direccion: "Av. 11 de Septiembre 2100", telefono: "+56 9 4444 3322" },
  { run: "205558993", nombre: "Javiera", apellidos: "Contreras Lara", correo: "javiera.contreras@gmail.com", clave: "1234", fechaNacimiento: "2000-06-25", tipoUsuario: "Cliente", region: "Región de la Araucanía", comuna: "Temuco", direccion: "Manuel Montt 321", telefono: "+56 9 3333 7788" },
  { run: "137954567", nombre: "Ignacio", apellidos: "Reyes Salinas", correo: "ignacio.reyes@gmail.com", clave: "1234", fechaNacimiento: "2001-02-14", tipoUsuario: "Cliente", region: "Región del Maule", comuna: "Talca", direccion: "1 Sur 654", telefono: "+56 9 2222 9900" }
];

export function sinClave(usuario) {
  if (!usuario) return null;
  const { clave: _clave, ...publico } = usuario;
  return publico;
}

function cargarTodos() {
  const guardados = leer(CLAVE_USUARIOS, null);
  if (guardados) return guardados;
  guardar(CLAVE_USUARIOS, USUARIOS_SEMILLA);
  return USUARIOS_SEMILLA.slice();
}

// ---------- READ ----------
export function listarUsuarios() {
  return cargarTodos().map(sinClave);
}

export function obtenerUsuario(run) {
  const buscado = limpiarRun(run);
  return sinClave(cargarTodos().find((u) => limpiarRun(u.run) === buscado));
}

export function obtenerUsuarioPorCorreo(correo) {
  const c = (correo || "").trim().toLowerCase();
  return sinClave(cargarTodos().find((u) => u.correo.toLowerCase() === c));
}

// ---------- CREATE ----------
// Lanza Error con un mensaje listo para mostrar si el RUN o el correo ya existen.
export function crearUsuario(datos) {
  const todos = cargarTodos();
  const run = limpiarRun(datos.run);
  if (todos.some((u) => limpiarRun(u.run) === run)) {
    throw new Error("Ya existe un usuario con ese RUN.");
  }
  if (todos.some((u) => u.correo.toLowerCase() === (datos.correo || "").trim().toLowerCase())) {
    throw new Error("Ya existe un usuario con ese correo.");
  }
  const nuevo = {
    apellidos: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    tipoUsuario: "Cliente",
    ...datos,
    run,
    correo: datos.correo.trim()
  };
  todos.push(nuevo);
  guardar(CLAVE_USUARIOS, todos);
  return sinClave(nuevo);
}

// ---------- UPDATE ----------
// No permite cambiar el RUN (es la llave). Devuelve null si el usuario no existe.
export function actualizarUsuario(run, cambios) {
  const todos = cargarTodos();
  const buscado = limpiarRun(run);
  const i = todos.findIndex((u) => limpiarRun(u.run) === buscado);
  if (i === -1) return null;
  const { run: _ignorado, ...permitidos } = cambios;
  if (permitidos.correo) {
    const c = permitidos.correo.trim().toLowerCase();
    if (todos.some((u, j) => j !== i && u.correo.toLowerCase() === c)) {
      throw new Error("Ya existe un usuario con ese correo.");
    }
  }
  todos[i] = { ...todos[i], ...permitidos };
  guardar(CLAVE_USUARIOS, todos);
  return sinClave(todos[i]);
}

// ---------- DELETE ----------
export function eliminarUsuario(run) {
  const todos = cargarTodos();
  const buscado = limpiarRun(run);
  const resto = todos.filter((u) => limpiarRun(u.run) !== buscado);
  if (resto.length === todos.length) return false;
  guardar(CLAVE_USUARIOS, resto);
  return true;
}

// ---------- LOGIN ----------
// Devuelve el usuario (sin clave) si las credenciales son correctas; si no, null.
export function autenticar(correo, clave) {
  const c = (correo || "").trim().toLowerCase();
  const u = cargarTodos().find((x) => x.correo.toLowerCase() === c);
  return u && u.clave === clave ? sinClave(u) : null;
}
