// rutas-por-rol.spec.jsx - Se prueba que RutaPorRol redirige según el rol de la sesión.
// Cliente no puede entrar a /admin/ordenes (vuelve a la tienda).
// Vendedor puede entrar a /admin/ordenes.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaPorRol from "../components/RutaPorRol.jsx";
import { SesionProvider, CLAVE_SESION } from "../context/SesionContext.jsx";
import { guardar, borrar } from "../data/storage.js";

const RUN_CLIENTE = "205558993";   // Cliente (semilla)
const RUN_VENDEDOR = "888888888";  // César (Vendedor, semilla)

function montar(initialEntries) {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={[initialEntries]}>
        <RutasPrueba />
      </MemoryRouter>
    </SesionProvider>
  );
}

function RutasPrueba() {
  return (
    <Routes>
      <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
      <Route path="/" element={<div>PÁGINA TIENDA</div>} />
      <Route path="/admin/ordenes/*" element={<RutaPorRol rolesPermitidos={["Administrador", "Vendedor"]} />}>
        <Route index element={<div>PÁGINA ÓRDENES</div>} />
      </Route>
    </Routes>
  );
}

afterEach(() => {
  cleanup();
  borrar(CLAVE_SESION);
});

it("sin sesión redirige a /login", () => {
  montar("/admin/ordenes");
  expect(screen.getByText("PÁGINA LOGIN")).toBeTruthy();
});

it("Cliente no puede entrar a /admin/ordenes y vuelve a la tienda", () => {
  guardar(CLAVE_SESION, RUN_CLIENTE);
  montar("/admin/ordenes");
  expect(screen.getByText("PÁGINA TIENDA")).toBeTruthy();
  expect(screen.queryByText("PÁGINA ÓRDENES")).toBeNull();
});

it("Vendedor puede entrar a /admin/ordenes", () => {
  guardar(CLAVE_SESION, RUN_VENDEDOR);
  montar("/admin/ordenes");
  expect(screen.getByText("PÁGINA ÓRDENES")).toBeTruthy();
});
