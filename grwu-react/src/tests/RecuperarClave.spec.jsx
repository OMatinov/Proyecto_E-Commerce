// RecuperarClave.spec.jsx - Pruebas de la vista "Recuperar contraseña" y sus funciones (César).
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecuperarClave from "../pages/RecuperarClave.jsx";
import { CLAVE_USUARIOS, autenticar, restablecerClave } from "../data/usuariosData.js";
import { validarNuevaClave } from "../utils/formularios.js";
import { borrar } from "../data/storage.js";

const CORREO = "ignacio.reyes@gmail.com";
const montar = () => render(<MemoryRouter><RecuperarClave /></MemoryRouter>);
const escribir = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const clic = (nombre) => fireEvent.click(screen.getByRole("button", { name: nombre }));

describe("restablecerClave y validarNuevaClave", () => {
  beforeEach(() => borrar(CLAVE_USUARIOS));
  afterEach(() => borrar(CLAVE_USUARIOS));

  it("restablecerClave cambia la clave y la anterior deja de servir", () => {
    expect(restablecerClave(CORREO, "nueva1")).toBe(true);
    expect(autenticar(CORREO, "nueva1")).not.toBeNull();
    expect(autenticar(CORREO, "1234")).toBeNull();
  });

  it("restablecerClave devuelve false si el correo no existe", () => {
    expect(restablecerClave("nadie@gmail.com", "nueva1")).toBe(false);
  });

  it("validarNuevaClave exige largo válido y que coincidan", () => {
    expect(validarNuevaClave({ clave: "abcd", clave2: "abcd" })).toEqual({});
    expect(validarNuevaClave({ clave: "ab", clave2: "ab" }).clave).toBeDefined();
    expect(validarNuevaClave({ clave: "abcd", clave2: "abce" }).clave2).toBe("Las contraseñas no coinciden.");
  });
});

describe("RecuperarClave (vista)", () => {
  beforeEach(() => borrar(CLAVE_USUARIOS));
  afterEach(() => { cleanup(); borrar(CLAVE_USUARIOS); });

  it("paso 1: muestra error con un correo de formato inválido", () => {
    montar();
    escribir("Correo electrónico", "mal");
    clic("Continuar");
    expect(screen.getByRole("alert").textContent).toContain("correos válidos");
  });

  it("paso 1: muestra error si no existe una cuenta con ese correo", () => {
    montar();
    escribir("Correo electrónico", "nadie@gmail.com");
    clic("Continuar");
    expect(screen.getByText("No existe una cuenta con ese correo.")).toBeTruthy();
  });

  it("paso 2: con un correo existente pide la nueva contraseña", () => {
    montar();
    escribir("Correo electrónico", CORREO);
    clic("Continuar");
    expect(screen.getByLabelText("Nueva contraseña")).toBeTruthy();
  });

  it("paso 2: no guarda si las contraseñas no coinciden", () => {
    montar();
    escribir("Correo electrónico", CORREO);
    clic("Continuar");
    escribir("Nueva contraseña", "nueva1");
    escribir("Confirmar nueva contraseña", "otra22");
    clic("Guardar contraseña");
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(autenticar(CORREO, "1234")).not.toBeNull();
  });

  it("flujo completo: cambia la contraseña y muestra el éxito", () => {
    montar();
    escribir("Correo electrónico", CORREO);
    clic("Continuar");
    escribir("Nueva contraseña", "nueva1");
    escribir("Confirmar nueva contraseña", "nueva1");
    clic("Guardar contraseña");
    expect(screen.getByText("Tu contraseña fue actualizada correctamente.")).toBeTruthy();
    expect(autenticar(CORREO, "nueva1")).not.toBeNull();
  });
});
