import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Registro from "../src/pages/Registro.jsx";
import { SesionProvider, CLAVE_SESION } from "../src/context/SesionContext.jsx";
import { CLAVE_USUARIOS, obtenerUsuario } from "../src/data/usuariosData.js";
import { borrar, leer } from "../src/data/storage.js";

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/registro"]}>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<h1>Página de inicio</h1>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function completarFormulario(run = "123456785", correo = "nuevo@gmail.com") {
  escribir("RUN", run);
  escribir("Nombre", "Nuevo");
  escribir("Apellidos", "Usuario Prueba");
  escribir("Correo electrónico", correo);
  escribir("Región", "Región del Biobío");
  escribir("Comuna", "Concepción");
  escribir("Contraseña", "abcd");
  escribir("Confirmar contraseña", "abcd");
}

const enviar = () => fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

describe("Registro", () => {
  beforeEach(() => { borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });
  afterEach(cleanup);

  it("renderiza todos los campos del formulario", () => {
    montar();
    ["RUN", "Nombre", "Apellidos", "Correo electrónico", "Teléfono (opcional)", "Región", "Comuna", "Contraseña", "Confirmar contraseña"]
      .forEach((etiqueta) => expect(screen.getByLabelText(etiqueta)).toBeTruthy());
  });

  it("la comuna está deshabilitada hasta elegir una región", () => {
    montar();
    expect(screen.getByLabelText("Comuna").disabled).toBe(true);
    escribir("Región", "Región del Biobío");
    expect(screen.getByLabelText("Comuna").disabled).toBe(false);
  });

  it("al elegir región se cargan solo las comunas de esa región", () => {
    montar();
    escribir("Región", "Región del Maule");
    const textos = Array.from(screen.getByLabelText("Comuna").options).map((o) => o.textContent);
    expect(textos).toContain("Talca");
    expect(textos).not.toContain("Concepción");
  });

  it("al cambiar de región se vacía la comuna elegida", () => {
    montar();
    escribir("Región", "Región del Biobío");
    escribir("Comuna", "Concepción");
    escribir("Región", "Región del Maule");
    expect(screen.getByLabelText("Comuna").value).toBe("");
  });

  it("muestra errores y no crea el usuario si el formulario está vacío", () => {
    montar();
    enviar();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(5);
    expect(obtenerUsuario("123456785")).toBeNull();
  });

  it("muestra error si las contraseñas no coinciden", () => {
    montar();
    completarFormulario();
    escribir("Confirmar contraseña", "otra");
    enviar();
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
  });

  it("un registro válido crea el cliente, inicia sesión y va al inicio", () => {
    montar();
    completarFormulario();
    enviar();
    expect(screen.getByText("Página de inicio")).toBeTruthy();
    expect(obtenerUsuario("123456785").tipoUsuario).toBe("Cliente");
    expect(leer(CLAVE_SESION)).toBe("123456785");
  });

  it("muestra el error del servidor de datos si el correo ya existe", () => {
    montar();
    completarFormulario("123456785", "javiera.contreras@gmail.com");
    enviar();
    expect(screen.getByText("Ya existe un usuario con ese correo.")).toBeTruthy();
    expect(leer(CLAVE_SESION)).toBeNull();
  });
});
