import { validarRun, validarCorreo, validarPassword, validarTelefono, limpiarRun } from "../src/utils/validaciones.js";

describe("validaciones", () => {
  it("limpiarRun quita puntos y guion y deja la K en mayúscula", () => {
    expect(limpiarRun("19.011.022-k")).toBe("19011022K");
  });

  it("validarRun acepta un RUN con dígito verificador correcto", () => {
    expect(validarRun("190110222").valido).toBeTrue();
  });

  it("validarRun rechaza un dígito verificador incorrecto", () => {
    const r = validarRun("190110221");
    expect(r.valido).toBeFalse();
    expect(r.mensaje).toContain("dígito verificador");
  });

  it("validarCorreo solo acepta los dominios permitidos", () => {
    expect(validarCorreo("cesar@gmail.com").valido).toBeTrue();
    expect(validarCorreo("cesar@hotmail.com").valido).toBeFalse();
  });

  it("validarPassword respeta el largo mínimo y máximo", () => {
    expect(validarPassword("123").valido).toBeFalse();
    expect(validarPassword("1234").valido).toBeTrue();
    expect(validarPassword("12345678901").valido).toBeFalse();
  });

  it("validarTelefono acepta formato chileno y rechaza texto", () => {
    expect(validarTelefono("+56 9 1234 5678").valido).toBeTrue();
    expect(validarTelefono("hola").valido).toBeFalse();
  });
});
