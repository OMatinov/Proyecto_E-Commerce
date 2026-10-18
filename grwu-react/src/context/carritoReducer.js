// carritoReducer.js - Reducer puro del carrito (se prueba sin React).
// Autor: César

import { agregarItem, quitarItem, cambiarCantidad } from "../data/carritoData.js";

export const ACCIONES_CARRITO = {
  AGREGAR: "agregar",
  QUITAR: "quitar",
  CAMBIAR_CANTIDAD: "cambiarCantidad",
  VACIAR: "vaciar"
};

export function carritoReducer(estado, accion) {
  switch (accion.tipo) {
    case ACCIONES_CARRITO.AGREGAR:
      return agregarItem(estado, accion.producto, accion.qty ?? 1);
    case ACCIONES_CARRITO.QUITAR:
      return quitarItem(estado, accion.id);
    case ACCIONES_CARRITO.CAMBIAR_CANTIDAD:
      return cambiarCantidad(estado, accion.id, accion.qty);
    case ACCIONES_CARRITO.VACIAR:
      return [];
    default:
      return estado;
  }
}
