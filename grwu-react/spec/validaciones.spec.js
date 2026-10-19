import { validarRun, validarCorreo, validarPassword, validarTelefono, limpiarRun } from "../src/utils/validaciones.js";

describe("validaciones", () => {
  it("limpiarRun quita puntos y guion y deja la K en mayúscula", () => {
    expect(limpiarRun("19.011.022-k")).toBe("19011022K");
  });

  it("validarRun acepta un RUN con dígito verificador correcto", () => {
    expect(validarRun("190110222").valido).toBe(true);
  });

  it("validarRun rechaza un dígito verificador incorrecto", () => {
    const r = validarRun("190110221");
    expect(r.valido).toBe(false);
    expect(r.mensaje).toContain("dígito verificador");
  });

  it("validarCorreo solo acepta los dominios permitidos", () => {
    expect(validarCorreo("cesar@gmail.com").valido).toBe(true);
    expect(validarCorreo("cesar@hotmail.com").valido).toBe(false);
  });

  it("validarPassword respeta el largo mínimo y máximo", () => {
    expect(validarPassword("123").valido).toBe(false);
    expect(validarPassword("1234").valido).toBe(true);
    expect(validarPassword("12345678901").valido).toBe(false);
  });

  it("validarTelefono acepta formato chileno y rechaza texto", () => {
    expect(validarTelefono("+56 9 1234 5678").valido).toBe(true);
    expect(validarTelefono("hola").valido).toBe(false);
  });
});
