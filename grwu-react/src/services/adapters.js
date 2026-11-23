// adapters.js - Traduce entre el contrato de la API y las formas que usan los componentes.
// Se aplica en el límite de los servicios/páginas, para no cambiar el carrito entero por un nombre.
//   Carrito local:  { id, nombre, precio, imagen, qty }
//   API de boletas: { productoId, cantidad } al enviar; { productoId, nombre, precioUnitario, cantidad, subtotal } al recibir

import { limpiarRun } from "../utils/validaciones.js";

// qty -> cantidad (envío de la compra)
export function aSolicitudBoleta({ items, valores }) {
  return {
    items: items.map((i) => ({ productoId: i.id, cantidad: i.qty || 1 })),
    despacho: valores.despacho,
    metodoPago: valores.metodoPago,
    cliente: {
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim()
    },
    direccion: {
      calle: valores.calle.trim(),
      departamento: valores.departamento.trim(),
      indicaciones: valores.indicaciones.trim(),
      region: valores.region,
      comuna: valores.comuna
    }
  };
}

// cantidad -> qty, precioUnitario -> precio (para ResumenOrden / TablaItems)
export function desdeBoleta(boleta) {
  if (!boleta) return null;
  return {
    ...boleta,
    items: (boleta.items || []).map((i) => ({
      id: i.productoId,
      nombre: i.nombre,
      imagen: i.imagen,
      precio: i.precioUnitario,
      qty: i.cantidad
    }))
  };
}

// Valores del formulario de usuario -> cuerpo de UsuarioSolicitud.
// Quita la confirmación de clave y, si la clave viene vacía (edición), no la envía.
export function aSolicitudUsuario(valores) {
  const { clave2: _clave2, clave, run, ...resto } = valores;
  const cuerpo = { ...resto };
  if (run) cuerpo.run = limpiarRun(run);
  if (clave) cuerpo.clave = clave;
  return cuerpo;
}
