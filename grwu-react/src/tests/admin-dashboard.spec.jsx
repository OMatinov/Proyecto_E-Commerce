// admin-dashboard.spec.jsx - Se prueba AdminDashboard: ventas reales desde ms-boletas
// y el mensaje de error si no se pueden cargar.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import api from "../services/api.js";
import { formatearCLP } from "../data/carritoData.js";

afterEach(() => cleanup());

it("muestra el total de ventas reales desde ms-boletas", async () => {
  const ventas = [
    { id: "ORD-20260001", estado: "pagada", total: 35000, fecha: "2026-11-22T10:30:00Z" },
    { id: "ORD-20260002", estado: "rechazada", total: 4000, fecha: "2026-11-20T10:30:00Z" }
  ];
  spyOn(api, "get").and.returnValue(Promise.resolve({ data: ventas }));

  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

  expect(await screen.findByText(formatearCLP(35000))).toBeTruthy();
});

it("muestra el aviso de error si las ventas no se pueden cargar", async () => {
  spyOn(api, "get").and.returnValue(Promise.reject({
    response: { status: 500, data: { message: "Error interno del backend", errores: null } }
  }));

  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

  expect(await screen.findByText(/No se pudieron cargar las ventas/)).toBeTruthy();
});
