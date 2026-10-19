import {
  agregarItem, quitarItem, cambiarCantidad, calcularSubtotal, calcularEnvio, calcularTotal,
  cantidadTotal, cargarCarrito, guardarCarrito, CLAVE_CARRITO,
  UMBRAL_ENVIO_GRATIS, COSTO_ENVIO_ESTANDAR, COSTO_ENVIO_PREMIUM
} from "../data/carritoData.js";
import { borrar } from "../data/storage.js";

const polera = { id: "polera1", nombre: "Polera Básica", precio: 9990, imagen: "img/polera1.png" };
const abrigo = { id: "abrigo1", nombre: "Abrigo Camel", precio: 18990, imagen: "img/abrigo1.png" };

describe("carritoData", () => {
  beforeEach(() => borrar(CLAVE_CARRITO));

  it("agregarItem agrega un producto nuevo con cantidad 1", () => {
    const c = agregarItem([], polera);
    expect(c.length).toBe(1);
    expect(c[0].qty).toBe(1);
  });

  it("agregarItem suma la cantidad si el producto ya estaba", () => {
    const c = agregarItem(agregarItem([], polera), polera, 2);
    expect(c.length).toBe(1);
    expect(c[0].qty).toBe(3);
  });

  it("agregarItem no muta el carrito original", () => {
    const original = [];
    agregarItem(original, polera);
    expect(original.length).toBe(0);
  });

  it("quitarItem elimina solo el producto indicado", () => {
    const c = quitarItem(agregarItem(agregarItem([], polera), abrigo), "polera1");
    expect(c.map((i) => i.id)).toEqual(["abrigo1"]);
  });

  it("cambiarCantidad nunca deja la cantidad bajo 1", () => {
    const c = cambiarCantidad(agregarItem([], polera), "polera1", -5);
    expect(c[0].qty).toBe(1);
  });

  it("calcularSubtotal suma precio por cantidad", () => {
    const c = agregarItem(agregarItem([], polera, 2), abrigo);
    expect(calcularSubtotal(c)).toBe(9990 * 2 + 18990);
  });

  it("calcularEnvio es gratis en estándar al superar el umbral", () => {
    expect(calcularEnvio(UMBRAL_ENVIO_GRATIS)).toBe(0);
    expect(calcularEnvio(UMBRAL_ENVIO_GRATIS - 1)).toBe(COSTO_ENVIO_ESTANDAR);
  });

  it("calcularEnvio premium siempre se cobra", () => {
    expect(calcularEnvio(999999, "premium")).toBe(COSTO_ENVIO_PREMIUM);
  });

  it("calcularTotal con carrito vacío no cobra envío", () => {
    expect(calcularTotal([])).toEqual({ subtotal: 0, envio: 0, total: 0 });
  });

  it("calcularTotal suma subtotal y envío", () => {
    const c = agregarItem([], polera);
    expect(calcularTotal(c).total).toBe(9990 + COSTO_ENVIO_ESTANDAR);
  });

  it("cantidadTotal suma todas las unidades", () => {
    expect(cantidadTotal(agregarItem(agregarItem([], polera, 2), abrigo))).toBe(3);
  });

  it("guardarCarrito y cargarCarrito conservan los datos", () => {
    const c = agregarItem([], polera, 2);
    guardarCarrito(c);
    expect(cargarCarrito()).toEqual(c);
  });
});
