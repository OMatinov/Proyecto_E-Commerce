// carritoData.js - Lógica del carrito (migrada de js/cart.js).
// Autor: César
//
// Las funciones "puras" reciben el carrito y devuelven uno NUEVO (sin mutar):
// así sirven directo para useReducer y son fáciles de probar.
//
// Forma de un ítem (acordar con Matías, que es dueño del modelo de producto):
//   { id, nombre, precio, imagen, qty }

import { leer, guardar } from "./storage.js";

export const CLAVE_CARRITO = "GRWU_Cart";
export const UMBRAL_ENVIO_GRATIS = 44990;
export const COSTO_ENVIO_ESTANDAR = 3990;
export const COSTO_ENVIO_PREMIUM = 5990;

export function cargarCarrito() {
  return leer(CLAVE_CARRITO, []);
}

export function guardarCarrito(carrito) {
  guardar(CLAVE_CARRITO, carrito);
}

export function agregarItem(carrito, producto, qty = 1) {
  const existe = carrito.some((i) => i.id === producto.id);
  if (existe) {
    return carrito.map((i) => (i.id === producto.id ? { ...i, qty: i.qty + qty } : i));
  }
  return [...carrito, { id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, qty }];
}

export function quitarItem(carrito, id) {
  return carrito.filter((i) => i.id !== id);
}

// Nunca deja la cantidad bajo 1 (para eliminar se usa quitarItem).
export function cambiarCantidad(carrito, id, qty) {
  return carrito.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
}

export function calcularSubtotal(carrito) {
  return carrito.reduce((t, i) => t + i.precio * i.qty, 0);
}

export function calcularEnvio(subtotal, tipoDespacho = "estandar") {
  if (tipoDespacho === "premium") return COSTO_ENVIO_PREMIUM;
  return subtotal >= UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO_ESTANDAR;
}

export function calcularTotal(carrito, tipoDespacho = "estandar") {
  const subtotal = calcularSubtotal(carrito);
  const envio = carrito.length === 0 ? 0 : calcularEnvio(subtotal, tipoDespacho);
  return { subtotal, envio, total: subtotal + envio };
}

export function cantidadTotal(carrito) {
  return carrito.reduce((t, i) => t + i.qty, 0);
}

export function formatearCLP(numero) {
  return numero.toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });
}
