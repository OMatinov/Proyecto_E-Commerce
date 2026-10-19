import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login.jsx";
import { SesionProvider, CLAVE_SESION } from "../src/context/SesionContext.jsx";
import { CLAVE_USUARIOS } from "../src/data/usuariosData.js";
import { borrar, leer } from "../src/data/storage.js";

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/admin" element={<h1>Panel admin</h1>} />
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
  beforeEach(() => { borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });
  afterEach(cleanup);

  it("renderiza los campos y el botón", () => {
    montar();
    expect(screen.getByLabelText("Correo electrónico")).toBeTruthy();
    expect(screen.getByLabelText("Contraseña")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
  });

  it("actualiza su estado al escribir en el correo", () => {
    montar();
    const input = screen.getByLabelText("Correo electrónico");
    fireEvent.change(input, { target: { value: "ana@gmail.com" } });
    expect(input.value).toBe("ana@gmail.com");
  });

  it("muestra errores de validación y no inicia sesión con datos inválidos", () => {
    montar();
    completar("correo-malo", "");
    expect(screen.getAllByRole("alert").length).toBe(2);
    expect(leer(CLAVE_SESION)).toBeNull();
  });

  it("muestra error general si las credenciales no existen", () => {
    montar();
    completar("ana@gmail.com", "clavemala");
    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeTruthy();
  });

  it("un cliente inicia sesión, se guarda su RUN y va al inicio", () => {
    montar();
    completar("javiera.contreras@gmail.com", "1234");
    expect(screen.getByText("Página de inicio")).toBeTruthy();
    expect(leer(CLAVE_SESION)).toBe("205558993");
  });

  it("un administrador es redirigido al panel", () => {
    montar();
    completar("camila.olmedo@duoc.cl", "1234");
    expect(screen.getByText("Panel admin")).toBeTruthy();
  });
});
