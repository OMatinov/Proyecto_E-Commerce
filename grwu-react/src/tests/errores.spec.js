import { normalizarError, repartirError } from "../services/errores.js";
import { errorApi, errorDeRed } from "./apoyo.jsx";

describe("normalizarError", () => {
  it("sin respuesta (servicio caído) devuelve status 0 y un mensaje de conexión", () => {
    const e = normalizarError(errorDeRed());
    expect(e.status).toBe(0);
    expect(e.mensaje).toMatch(/No se pudo conectar/);
    expect(e.errores).toBeNull();
  });

  it("toma el mensaje y el status que entrega el backend", () => {
    const e = normalizarError(errorApi(409, "Stock insuficiente para: Polera"));
    expect(e.status).toBe(409);
    expect(e.mensaje).toBe("Stock insuficiente para: Polera");
  });

  it("conserva el mapa de errores por campo (400)", () => {
    const e = normalizarError(errorApi(400, "Datos inválidos", { correo: "Correo inválido" }));
    expect(e.errores).toEqual({ correo: "Correo inválido" });
  });

  it("usa un mensaje genérico si la respuesta no trae uno", () => {
    expect(normalizarError({ response: { status: 500, data: "<html>" } }).mensaje).toMatch(/error inesperado/i);
  });
});

describe("repartirError", () => {
  it("400 con errores: los reparte por campo", () => {
    expect(repartirError({ mensaje: "x", status: 400, errores: { run: "RUN inválido" } }))
      .toEqual({ campos: { run: "RUN inválido" }, general: "" });
  });

  it("409 por RUN duplicado va al campo run", () => {
    expect(repartirError({ mensaje: "Ya existe un usuario con ese RUN.", status: 409, errores: null }).campos)
      .toEqual({ run: "Ya existe un usuario con ese RUN." });
  });

  it("409 por correo duplicado va al campo correo", () => {
    expect(repartirError({ mensaje: "Ya existe un usuario con ese correo.", status: 409, errores: null }).campos)
      .toEqual({ correo: "Ya existe un usuario con ese correo." });
  });

  it("cualquier otro error queda como mensaje general", () => {
    expect(repartirError({ mensaje: "Servidor caído", status: 0, errores: null }))
      .toEqual({ campos: {}, general: "Servidor caído" });
  });
});
