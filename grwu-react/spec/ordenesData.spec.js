import {
  crearOrden, listarOrdenes, obtenerOrden, ordenesPorUsuario, actualizarEstadoOrden, eliminarOrden, CLAVE_ORDENES
} from "../src/data/ordenesData.js";
import { borrar } from "../src/data/storage.js";

const base = {
  cliente: { nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com" },
  direccion: { calle: "Los Carrera 1", departamento: "", region: "Región del Biobío", comuna: "Concepción", indicaciones: "" },
  items: [{ id: "polera1", nombre: "Polera", precio: 9990, qty: 1 }],
  subtotal: 9990, envio: 3990, total: 13980, despacho: "estandar", metodoPago: "credito", estado: "pagada"
};

describe("ordenesData", () => {
  beforeEach(() => borrar(CLAVE_ORDENES));

  it("crearOrden asigna id, número y fecha", () => {
    const o = crearOrden(base);
    expect(o.id).toBe("ORD-20260001");
    expect(o.numero).toBe(20260001);
    expect(new Date(o.fecha).toString()).not.toBe("Invalid Date");
  });

  it("los números de orden son correlativos", () => {
    crearOrden(base);
    expect(crearOrden(base).numero).toBe(20260002);
  });

  it("listarOrdenes devuelve las más recientes primero", () => {
    crearOrden(base);
    crearOrden(base);
    expect(listarOrdenes()[0].numero).toBe(20260002);
  });

  it("obtenerOrden busca por id o por número", () => {
    const o = crearOrden(base);
    expect(obtenerOrden(o.id).numero).toBe(o.numero);
    expect(obtenerOrden(o.numero).id).toBe(o.id);
    expect(obtenerOrden("no-existe")).toBeNull();
  });

  it("ordenesPorUsuario filtra por RUN (para el Historial de compras)", () => {
    crearOrden({ ...base, usuarioRun: "19.011.022-K" });
    crearOrden({ ...base, usuarioRun: "205558993" });
    crearOrden(base); // compra como invitado
    expect(ordenesPorUsuario("19011022K").length).toBe(1);
  });

  it("actualizarEstadoOrden cambia el estado (reintento de pago)", () => {
    const o = crearOrden({ ...base, estado: "rechazada" });
    expect(actualizarEstadoOrden(o.id, "pagada").estado).toBe("pagada");
  });

  it("actualizarEstadoOrden rechaza un estado inválido", () => {
    const o = crearOrden(base);
    expect(() => actualizarEstadoOrden(o.id, "volando")).toThrowError(/no válido/);
  });

  it("eliminarOrden borra la orden", () => {
    const o = crearOrden(base);
    expect(eliminarOrden(o.id)).toBeTrue();
    expect(listarOrdenes().length).toBe(0);
  });
});
