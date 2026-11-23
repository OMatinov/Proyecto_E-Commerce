import { validarLogin, validarRegistro } from "../utils/formularios.js";

const registroValido = {
  run: "190110222", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", telefono: "", fechaNacimiento: "1995-03-02",
  region: "Región del Biobío", comuna: "Concepción", clave: "abcd", clave2: "abcd"
};

describe("validarLogin", () => {
  it("no devuelve errores con datos correctos", () => {
    expect(validarLogin({ correo: "ana@gmail.com", clave: "abcd" })).toEqual({});
  });

  it("marca correo inválido y clave vacía", () => {
    const e = validarLogin({ correo: "ana@hotmail.com", clave: "" });
    expect(e.correo).toBeTruthy();
    expect(e.clave).toBe("La contraseña es obligatoria.");
  });
});

describe("validarRegistro", () => {
  it("acepta un registro completo (teléfono opcional)", () => {
    expect(validarRegistro(registroValido)).toEqual({});
  });

  it("exige región y comuna", () => {
    const e = validarRegistro({ ...registroValido, region: "", comuna: "" });
    expect(e.region).toBeTruthy();
    expect(e.comuna).toBeTruthy();
  });

  it("detecta contraseñas que no coinciden", () => {
    expect(validarRegistro({ ...registroValido, clave2: "otra" }).clave2).toBe("Las contraseñas no coinciden.");
  });

  it("valida el teléfono solo si se escribió", () => {
    expect(validarRegistro({ ...registroValido, telefono: "hola" }).telefono).toBeTruthy();
    expect(validarRegistro({ ...registroValido, telefono: "+56 9 1234 5678" }).telefono).toBeUndefined();
  });
});

describe("validarRegistro: campos que exige el backend", () => {
  it("exige la fecha de nacimiento", () => {
    expect(validarRegistro({ ...registroValido, fechaNacimiento: "" }).fechaNacimiento).toBe("La fecha de nacimiento es obligatoria.");
  });

  it("rechaza una fecha futura", () => {
    expect(validarRegistro({ ...registroValido, fechaNacimiento: "2999-01-01" }).fechaNacimiento).toMatch(/futura/);
  });

  it("limita los apellidos a 80 caracteres (largo del backend)", () => {
    expect(validarRegistro({ ...registroValido, apellidos: "a".repeat(81) }).apellidos).toMatch(/80/);
    expect(validarRegistro({ ...registroValido, apellidos: "a".repeat(80) }).apellidos).toBeUndefined();
  });
});
