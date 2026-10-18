// storage.js - Capa mínima sobre localStorage (con respaldo en memoria).
// Autor: César
// Así los datos funcionan igual en el navegador, en Karma y en Node.

const memoria = new Map();

function hayLocalStorage() {
  try {
    return typeof localStorage !== "undefined" && localStorage !== null;
  } catch {
    return false;
  }
}

export function leer(clave, porDefecto = null) {
  try {
    const crudo = hayLocalStorage() ? localStorage.getItem(clave) : memoria.get(clave);
    return crudo ? JSON.parse(crudo) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  const crudo = JSON.stringify(valor);
  if (hayLocalStorage()) localStorage.setItem(clave, crudo);
  else memoria.set(clave, crudo);
}

export function borrar(clave) {
  if (hayLocalStorage()) localStorage.removeItem(clave);
  else memoria.delete(clave);
}
