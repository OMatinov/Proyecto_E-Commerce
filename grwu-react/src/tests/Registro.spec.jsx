import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Registro from "../pages/Registro.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import auth from "../services/auth.js";
import { limpiarTokens } from "../services/tokenStore.js";
import { CLIENTE, errorApi } from "./apoyo.jsx";

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/registro"]}>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

function completarValido() {
  escribir("RUN", "205558993");
  escribir("Nombre", "Javiera");
  escribir("Apellidos", "Contreras Lara");
  escribir("Correo electrónico", "javiera.contreras@gmail.com");
  escribir("Fecha de nacimiento", "2000-06-25");
  escribir("Región", "Región de la Araucanía");
  escribir("Comuna", "Temuco");
  escribir("Contraseña", "abcd");
  escribir("Confirmar contraseña", "abcd");
}
const enviar = () => fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

describe("Registro", () => {
  beforeEach(limpiarTokens);
  afterEach(() => { cleanup(); limpiarTokens(); });

  it("renderiza todos los campos, incluida la fecha de nacimiento que exige el backend", () => {
    montar();
    ["RUN", "Nombre", "Apellidos", "Correo electrónico", "Fecha de nacimiento", "Teléfono (opcional)", "Región", "Comuna", "Contraseña", "Confirmar contraseña"]
      .forEach((e) => expect(screen.getByLabelText(e)).toBeTruthy());
  });

  it("la comuna está deshabilitada hasta elegir región y se vacía al cambiar de región", () => {
    montar();
    expect(screen.getByLabelText("Comuna").disabled).toBeTrue();
    escribir("Región", "Región de la Araucanía");
    expect(screen.getByLabelText("Comuna").disabled).toBeFalse();
    escribir("Comuna", "Temuco");
    escribir("Región", "Región del Biobío");
    expect(screen.getByLabelText("Comuna").value).toBe("");
  });

  it("con el formulario vacío muestra errores y NO llama al servidor", () => {
    const registro = spyOn(auth, "registro");
    montar();
    enviar();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(5);
    expect(screen.getByText("La fecha de nacimiento es obligatoria.")).toBeTruthy();
    expect(registro).not.toHaveBeenCalled();
  });

  it("registra al cliente, inicia sesión y va al inicio", async () => {
    const registro = spyOn(auth, "registro").and.resolveTo(CLIENTE);
    spyOn(auth, "login").and.resolveTo(CLIENTE);
    montar();
    completarValido();
    enviar();
    expect(await screen.findByText("Página de inicio")).toBeTruthy();
    const enviado = registro.calls.argsFor(0)[0];
    expect(enviado.run).toBe("205558993");
    expect(enviado.fechaNacimiento).toBe("2000-06-25");
    expect("clave2" in enviado).toBeFalse(); // la confirmación no viaja al servidor
    expect("tipoUsuario" in enviado).toBeFalse(); // el rol lo fuerza el backend
  });

  it("muestra el error en el campo RUN cuando el backend responde 409 por RUN duplicado", async () => {
    spyOn(auth, "registro").and.rejectWith(errorApi(409, "Ya existe un usuario con ese RUN."));
    montar();
    completarValido();
    enviar();
    expect(await screen.findByText("Ya existe un usuario con ese RUN.")).toBeTruthy();
    expect(screen.getByLabelText("RUN").getAttribute("aria-invalid")).toBe("true");
  });

  it("muestra el error en el campo correo cuando el correo ya existe", async () => {
    spyOn(auth, "registro").and.rejectWith(errorApi(409, "Ya existe un usuario con ese correo."));
    montar();
    completarValido();
    enviar();
    expect(await screen.findByText("Ya existe un usuario con ese correo.")).toBeTruthy();
    expect(screen.getByLabelText("Correo electrónico").getAttribute("aria-invalid")).toBe("true");
  });

  it("reparte los errores por campo que devuelve el backend (400)", async () => {
    spyOn(auth, "registro").and.rejectWith(errorApi(400, "Datos inválidos", { telefono: "Ingresa un teléfono válido, ej: +56 9 1234 5678." }));
    montar();
    completarValido();
    enviar();
    expect(await screen.findByText(/Ingresa un teléfono válido/)).toBeTruthy();
  });

  it("si el servicio está caído muestra un aviso general", async () => {
    spyOn(auth, "registro").and.rejectWith({ message: "Network Error" });
    montar();
    completarValido();
    enviar();
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });
});
