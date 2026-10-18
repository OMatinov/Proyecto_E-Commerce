// CarritoContext.jsx - Estado global del carrito (reemplaza js/cart.js + header.js).
// Autor: César
//
// Uso:  const { items, agregar, totales, cantidad } = useCarrito();
// Persiste en localStorage ("GRWU_Cart") cada vez que cambia.

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { carritoReducer, ACCIONES_CARRITO } from "./carritoReducer.js";
import { cargarCarrito, guardarCarrito, calcularTotal, cantidadTotal } from "../data/carritoData.js";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, undefined, cargarCarrito);

  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  const valor = useMemo(
    () => ({
      items,
      cantidad: cantidadTotal(items),
      agregar: (producto, qty = 1) => dispatch({ tipo: ACCIONES_CARRITO.AGREGAR, producto, qty }),
      quitar: (id) => dispatch({ tipo: ACCIONES_CARRITO.QUITAR, id }),
      cambiarCantidad: (id, qty) => dispatch({ tipo: ACCIONES_CARRITO.CAMBIAR_CANTIDAD, id, qty }),
      vaciar: () => dispatch({ tipo: ACCIONES_CARRITO.VACIAR }),
      totales: (despacho = "estandar") => calcularTotal(items, despacho)
    }),
    [items]
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>.");
  return ctx;
}
