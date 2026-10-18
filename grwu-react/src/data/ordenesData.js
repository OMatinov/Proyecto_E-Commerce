// ordenesData.js - "Base de datos" de órdenes/boletas con CRUD.
// Autor: César
//
// Quién la usa:
//   - Checkout (César): crearOrden
//   - Admin Órdenes/Boletas y Mostrar boleta (Katerine): listarOrdenes, obtenerOrden
//   - Admin Historial de compras (Matías): ordenesPorUsuario(run)
//   - Reportes (Katerine): listarOrdenes + totales
//
// Estructura de una orden: ver docs/CONTRATO_DATOS.md

import { leer, guardar } from "./storage.js";
import { limpiarRun } from "../utils/validaciones.js";

export const CLAVE_ORDENES = "grwu_ordenes";
export const ESTADOS_ORDEN = ["pagada", "rechazada", "enviada", "entregada", "cancelada"];
const PRIMER_NUMERO = 20260001;

function cargarTodas() {
  return leer(CLAVE_ORDENES, []);
}

// ---------- CREATE ----------
// `estado` es "pagada" o "rechazada" según el resultado de services/pago.js.
export function crearOrden({ usuarioRun = null, cliente, direccion, items, subtotal, envio, total, despacho, metodoPago, estado }) {
  const todas = cargarTodas();
  const numero = PRIMER_NUMERO + todas.length;
  const orden = {
    id: "ORD-" + numero,
    numero,
    fecha: new Date().toISOString(),
    usuarioRun: usuarioRun ? limpiarRun(usuarioRun) : null,
    cliente,
    direccion,
    items,
    subtotal,
    envio,
    total,
    despacho,
    metodoPago,
    estado
  };
  todas.push(orden);
  guardar(CLAVE_ORDENES, todas);
  return orden;
}

// ---------- READ ----------
export function listarOrdenes() {
  return cargarTodas().slice().reverse(); // más recientes primero
}

export function obtenerOrden(id) {
  return cargarTodas().find((o) => o.id === id || String(o.numero) === String(id)) || null;
}

export function ordenesPorUsuario(run) {
  const r = limpiarRun(run);
  return listarOrdenes().filter((o) => o.usuarioRun === r);
}

// ---------- UPDATE ----------
// Sirve para "Volver a realizar el pago": la orden rechazada pasa a pagada.
export function actualizarEstadoOrden(id, estado) {
  if (!ESTADOS_ORDEN.includes(estado)) throw new Error("Estado de orden no válido: " + estado);
  const todas = cargarTodas();
  const i = todas.findIndex((o) => o.id === id);
  if (i === -1) return null;
  todas[i] = { ...todas[i], estado };
  guardar(CLAVE_ORDENES, todas);
  return todas[i];
}

// ---------- DELETE ----------
export function eliminarOrden(id) {
  const todas = cargarTodas();
  const resto = todas.filter((o) => o.id !== id);
  if (resto.length === todas.length) return false;
  guardar(CLAVE_ORDENES, resto);
  return true;
}
