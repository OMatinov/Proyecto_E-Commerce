// admin-layout.spec.jsx - Se prueba el menú de AdminLayout según el rol:
// el Vendedor ve solo Órdenes y Productos; el Administrador ve todo.
// La sesión se restaura de forma asíncrona, por eso se espera con findBy*. Servicios mockeados con apoyo.jsx.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { ADMIN, VENDEDOR, conSesion, sinSesion } from "./apoyo.jsx";

function montar(rutaInicial) {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={[rutaInicial]}>
        <Routes>
          <Route path="/admin/ordenes" element={<AdminLayout />} />
          <Route path="/admin/productos" element={<AdminLayout />} />
          <Route path="/admin/categorias" element={<AdminLayout />} />
          <Route path="/admin/usuarios" element={<AdminLayout />} />
          <Route path="/admin/reportes" element={<AdminLayout />} />
          <Route path="/admin/blogs" element={<AdminLayout />} />
          <Route path="/admin/contactos" element={<AdminLayout />} />
          <Route path="/admin/perfil" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

const ver = (etiqueta) => expect(screen.getByText(new RegExp(etiqueta))).toBeTruthy();
const noVer = (etiqueta) => expect(screen.queryByText(new RegExp(etiqueta))).toBeNull();

afterEach(() => {
  cleanup();
  sinSesion();
});

it("AdminLayout: el Vendedor ve solo Órdenes y Productos en el menú", async () => {
  conSesion(VENDEDOR);
  montar("/admin/ordenes");
  expect(await screen.findByText(/Órdenes/)).toBeTruthy();
  ver("Productos");
  ["Dashboard", "Categorías", "Usuarios", "Reportes", "Blogs", "Contactos", "Perfil"].forEach(noVer);
});

it("AdminLayout: el Administrador ve todos los enlaces del menú", async () => {
  conSesion(ADMIN);
  montar("/admin/ordenes");
  expect(await screen.findByText(/Dashboard/)).toBeTruthy();
  ["Órdenes", "Productos", "Categorías", "Usuarios", "Reportes", "Blogs", "Contactos", "Perfil"].forEach(ver);
});
