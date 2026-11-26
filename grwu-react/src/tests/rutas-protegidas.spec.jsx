// rutas-protegidas.spec.jsx - Se prueba que RutaProtegida exige sesión activa.
// Sin sesión: redirige a /login. Con sesión: permite la ruta protegida.
// La sesión se restaura de forma asíncrona (refresh + /usuarios/me), por eso se espera con findBy*.
// Los servicios se mockean con apoyo.jsx (sin backend ni MySQL).
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "../components/RutaProtegida.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { CLIENTE, conSesion, sinSesion } from "./apoyo.jsx";

function montar() {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/carrito"]}>
        <Routes>
          <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
          <Route path="/carrito" element={<RutaProtegida />}>
            <Route index element={<div>PÁGINA CARRITO</div>} />
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

it("RutaProtegida: sin sesión redirige a /login", async () => {
  sinSesion();
  montar();
  expect(await screen.findByText("PÁGINA LOGIN")).toBeTruthy();
  expect(screen.queryByText("PÁGINA CARRITO")).toBeNull();
});

it("RutaProtegida: con sesión permite entrar a la ruta protegida", async () => {
  conSesion(CLIENTE);
  montar();
  expect(await screen.findByText("PÁGINA CARRITO")).toBeTruthy();
  expect(screen.queryByText("PÁGINA LOGIN")).toBeNull();
});
