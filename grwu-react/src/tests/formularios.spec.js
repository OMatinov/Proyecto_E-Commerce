import { validarLogin, validarRegistro } from "../utils/formularios.js";

const registroValido = {
  run: "190110222", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", telefono: "",
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
