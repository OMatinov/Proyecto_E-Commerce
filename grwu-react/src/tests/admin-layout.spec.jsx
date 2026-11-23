// admin-layout.spec.jsx - Se prueba el menú de AdminLayout según el rol:
// el Vendedor ve solo Órdenes y Productos; el Administrador ve todo.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout.jsx";
import { SesionProvider, CLAVE_SESION } from "../context/SesionContext.jsx";
import { guardar, borrar } from "../data/storage.js";

const RUN_ADMIN = "190110222";      // Camila Olmedo (Administrador, semilla)
const RUN_VENDEDOR = "888888888";   // César Muñoz (Vendedor, semilla)

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
  borrar(CLAVE_SESION);
});

it("El Vendedor ve solo Órdenes y Productos en el menú", () => {
  guardar(CLAVE_SESION, RUN_VENDEDOR);
  montar("/admin/ordenes");
  ver("Órdenes");
  ver("Productos");
  ["Dashboard", "Categorías", "Usuarios", "Reportes", "Blogs", "Contactos", "Perfil"].forEach(noVer);
});

it("El Administrador ve todos los enlaces del menú", () => {
  guardar(CLAVE_SESION, RUN_ADMIN);
  montar("/admin/ordenes");
  ["Dashboard", "Órdenes", "Productos", "Categorías", "Usuarios", "Reportes", "Blogs", "Contactos", "Perfil"].forEach(ver);
});
