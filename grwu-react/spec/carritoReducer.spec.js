import { carritoReducer, ACCIONES_CARRITO } from "../src/context/carritoReducer.js";

const polera = { id: "polera1", nombre: "Polera", precio: 9990, imagen: "x.png" };

describe("carritoReducer", () => {
  it("AGREGAR añade el producto", () => {
    const e = carritoReducer([], { tipo: ACCIONES_CARRITO.AGREGAR, producto: polera });
    expect(e.length).toBe(1);
  });

  it("CAMBIAR_CANTIDAD actualiza la cantidad", () => {
    const base = carritoReducer([], { tipo: ACCIONES_CARRITO.AGREGAR, producto: polera });
    const e = carritoReducer(base, { tipo: ACCIONES_CARRITO.CAMBIAR_CANTIDAD, id: "polera1", qty: 4 });
    expect(e[0].qty).toBe(4);
  });

  it("QUITAR elimina el producto", () => {
    const base = carritoReducer([], { tipo: ACCIONES_CARRITO.AGREGAR, producto: polera });
    expect(carritoReducer(base, { tipo: ACCIONES_CARRITO.QUITAR, id: "polera1" })).toEqual([]);
  });

  it("VACIAR deja el carrito en []", () => {
    const base = carritoReducer([], { tipo: ACCIONES_CARRITO.AGREGAR, producto: polera });
    expect(carritoReducer(base, { tipo: ACCIONES_CARRITO.VACIAR })).toEqual([]);
  });

  it("una acción desconocida devuelve el mismo estado", () => {
    const base = [];
    expect(carritoReducer(base, { tipo: "nada" })).toBe(base);
  });
});
