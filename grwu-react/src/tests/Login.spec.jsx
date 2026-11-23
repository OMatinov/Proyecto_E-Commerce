import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import auth from "../services/auth.js";
import { limpiarTokens } from "../services/tokenStore.js";
import { ADMIN, CLIENTE, VENDEDOR, errorApi, errorDeRed } from "./apoyo.jsx";

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/admin" element={<h1>Panel admin</h1>} />
          <Route path="/admin/ordenes" element={<h1>Órdenes admin</h1>} />
          <Route path="/registro" element={<h1>Registro</h1>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

function completar(correo, clave) {
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: clave } });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Login", () => {
  beforeEach(limpiarTokens);
  afterEach(() => { cleanup(); limpiarTokens(); });

  it("renderiza los campos y el botón, sin enlace de recuperar contraseña", () => {
    montar();
    expect(screen.getByLabelText("Correo electrónico")).toBeTruthy();
    expect(screen.getByLabelText("Contraseña")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
    expect(screen.queryByText(/olvidaste/i)).toBeNull(); // la decisión D7 eliminó la recuperación
  });

  it("actualiza su estado al escribir en el correo", () => {
    montar();
    const input = screen.getByLabelText("Correo electrónico");
    fireEvent.change(input, { target: { value: "ana@gmail.com" } });
    expect(input.value).toBe("ana@gmail.com");
  });

  it("muestra errores de validación y NO llama al servidor con datos inválidos", () => {
    const login = spyOn(auth, "login");
    montar();
    completar("correo-malo", "");
    expect(screen.getAllByRole("alert").length).toBe(2);
    expect(login).not.toHaveBeenCalled();
  });

  it("muestra el error del backend si las credenciales son incorrectas", async () => {
    spyOn(auth, "login").and.rejectWith(errorApi(401, "Correo o contraseña incorrectos."));
    montar();
    completar("ana@gmail.com", "clavemala");
    expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Iniciar sesión" }).disabled).toBeFalse();
  });

  it("muestra un mensaje de conexión si el servicio está caído", async () => {
    spyOn(auth, "login").and.rejectWith(errorDeRed());
    montar();
    completar("ana@gmail.com", "1234");
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });

  it("un cliente inicia sesión y va al inicio", async () => {
    const login = spyOn(auth, "login").and.resolveTo(CLIENTE);
    montar();
    completar("javiera.contreras@gmail.com", "1234");
    expect(await screen.findByText("Página de inicio")).toBeTruthy();
    expect(login).toHaveBeenCalledWith("javiera.contreras@gmail.com", "1234");
  });

  it("un administrador es redirigido al panel", async () => {
    spyOn(auth, "login").and.resolveTo(ADMIN);
    montar();
    completar("camila.olmedo@duoc.cl", "1234");
    expect(await screen.findByText("Panel admin")).toBeTruthy();
  });

  it("un vendedor va directo a Órdenes (no tiene acceso al dashboard)", async () => {
    spyOn(auth, "login").and.resolveTo(VENDEDOR);
    montar();
    completar("matias.fuentes@duoc.cl", "1234");
    expect(await screen.findByText("Órdenes admin")).toBeTruthy();
  });

  it("deshabilita el botón mientras espera la respuesta", async () => {
    let resolver;
    spyOn(auth, "login").and.returnValue(new Promise((r) => { resolver = r; }));
    montar();
    completar("ana@gmail.com", "1234");
    const boton = await screen.findByRole("button", { name: "Ingresando..." });
    expect(boton.disabled).toBeTrue();
    resolver(CLIENTE);
    expect(await screen.findByText("Página de inicio")).toBeTruthy();
  });
});
