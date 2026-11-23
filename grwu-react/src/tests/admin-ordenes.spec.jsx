// admin-ordenes.spec.jsx - Se prueba AdminOrdenes: carga, error, vacío y filtro de estado.
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminOrdenes from "../pages/admin/AdminOrdenes.jsx";
import api from "../services/api.js";

const ORDEN = {
  id: "ORD-20260001",
  estado: "pagada",
  total: 25000,
  fecha: "2026-11-22T10:30:00Z",
  cliente: { nombre: "Matías", apellidos: "Fuentes Rivas" },
  items: [{ productoId: "p-001", nombre: "Polera", precioUnitario: 12500, cantidad: 2, subtotal: 25000 }]
};

function montar() {
  return render(
    <MemoryRouter initialEntries={["/admin/ordenes"]}>
      <AdminOrdenes />
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

it("muestra el listado de órdenes", async () => {
  spyOn(api, "get").and.returnValue(Promise.resolve({ data: [ORDEN] }));

  montar();

  expect(await screen.findByText("ORD-20260001")).toBeTruthy();
  expect(screen.getByText("Matías Fuentes Rivas")).toBeTruthy();
  expect(screen.getByText("PAGADA")).toBeTruthy();
  expect(api.get).toHaveBeenCalledWith("/boletas", { params: {} });
});

it("pide las órdenes filtrando por el estado seleccionado", async () => {
  spyOn(api, "get").and.returnValue(Promise.resolve({ data: [] }));

  montar();
  await screen.findByText("No hay órdenes registradas aún.");

  fireEvent.change(screen.getByLabelText("Filtrar por estado"), { target: { value: "pagada" } });
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(api.get.calls.allArgs()).toContain(["/boletas", { params: { estado: "pagada" } }]);
});

it("muestra el mensaje vacío cuando no hay órdenes", async () => {
  spyOn(api, "get").and.returnValue(Promise.resolve({ data: [] }));

  montar();

  expect(await screen.findByText("No hay órdenes registradas aún.")).toBeTruthy();
});

it("muestra el error normalizado cuando no tiene permisos", async () => {
  spyOn(api, "get").and.returnValue(Promise.reject({
    response: { status: 403, data: { message: "No tienes permisos para acceder a este recurso", errores: null } }
  }));

  montar();

  expect(await screen.findByText(/No se pudieron cargar las órdenes/)).toBeTruthy();
});
