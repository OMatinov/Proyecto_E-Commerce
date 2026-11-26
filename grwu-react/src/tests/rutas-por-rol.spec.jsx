// rutas-por-rol.spec.jsx - Se prueba que RutaPorRol redirige según el rol de la sesión.
// Cliente no puede entrar a /admin/ordenes (vuelve a la tienda).
// Vendedor puede entrar a /admin/ordenes.
// La sesión se restaura de forma asíncrona, por eso se espera con findBy*. Servicios mockeados con apoyo.jsx.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaPorRol from "../components/RutaPorRol.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { CLIENTE, VENDEDOR, conSesion, sinSesion } from "./apoyo.jsx";

function montar(ruta) {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
          <Route path="/" element={<div>PÁGINA TIENDA</div>} />
          <Route path="/admin/ordenes/*" element={<RutaPorRol rolesPermitidos={["Administrador", "Vendedor"]} />}>
            <Route index element={<div>PÁGINA ÓRDENES</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

afterEach(() => {
  cleanup();
  sinSesion();
});

it("RutaPorRol: sin sesión redirige a /login", async () => {
  sinSesion();
  montar("/admin/ordenes");
  expect(await screen.findByText("PÁGINA LOGIN")).toBeTruthy();
});

it("RutaPorRol: Cliente no puede entrar a /admin/ordenes y vuelve a la tienda", async () => {
  conSesion(CLIENTE);
  montar("/admin/ordenes");
  expect(await screen.findByText("PÁGINA TIENDA")).toBeTruthy();
  expect(screen.queryByText("PÁGINA ÓRDENES")).toBeNull();
});

it("RutaPorRol: Vendedor puede entrar a /admin/ordenes", async () => {
  conSesion(VENDEDOR);
  montar("/admin/ordenes");
  expect(await screen.findByText("PÁGINA ÓRDENES")).toBeTruthy();
});
