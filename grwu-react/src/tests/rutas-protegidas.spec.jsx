// rutas-protegidas.spec.jsx - Se prueba que RutaProtegida exige sesión activa.
// Sin sesión: redirige a /login. Con sesión: permite la ruta protegida.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "../components/RutaProtegida.jsx";
import { SesionProvider, CLAVE_SESION } from "../context/SesionContext.jsx";
import { guardar, borrar } from "../data/storage.js";

const RUN_CLIENTE = "205558993"; // Javiera Contreras Lara (semilla)

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/carrito"]}>
        <RutasPrueba />
      </MemoryRouter>
    </SesionProvider>
  );
}

function RutasPrueba() {
  return (
    <Routes>
      <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
      <Route path="/carrito" element={<RutaProtegida />}>
        <Route index element={<div>PÁGINA CARRITO</div>} />
      </Route>
    </Routes>
  );
}

afterEach(() => {
  cleanup();
  borrar(CLAVE_SESION);
});

it("sin sesión redirige a /login", () => {
  montar();
  expect(screen.getByText("PÁGINA LOGIN")).toBeTruthy();
  expect(screen.queryByText("PÁGINA CARRITO")).toBeNull();
});

it("con sesión permite entrar a la ruta protegida", () => {
  guardar(CLAVE_SESION, RUN_CLIENTE);
  montar();
  expect(screen.getByText("PÁGINA CARRITO")).toBeTruthy();
  expect(screen.queryByText("PÁGINA LOGIN")).toBeNull();
});
