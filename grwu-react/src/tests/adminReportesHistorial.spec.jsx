// adminReportesHistorial.spec.jsx - Vistas admin "Historial de compras" y "Reportes" (César).
// Historial: usuario de ms-usuarios y boletas de ms-boletas (servicios mockeados con spyOn).
// Reportes: las órdenes se siembran en localStorage (aún usan ordenesData); los gráficos usan chart.js.
import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminHistorialCompras from "../pages/admin/AdminHistorialCompras.jsx";
import AdminReportes from "../pages/admin/AdminReportes.jsx";
import usuariosService from "../services/usuarios.js";
import boletasService from "../services/boletas.js";
import { CLAVE_ORDENES, cantidadProductos } from "../data/ordenesData.js";
import { formatearCLP } from "../data/carritoData.js";
import { borrar, guardar } from "../data/storage.js";
import { CLIENTE, errorApi, errorDeRed } from "./apoyo.jsx";

const RUN_CLIENTE = CLIENTE.run;
const fecha = (anio, mes) => new Date(anio, mes - 1, 15, 12).toISOString();

// Forma de las órdenes locales (Reportes todavía las lee de ordenesData).
const orden = (extra) => ({
  id: "ORD-1", numero: 1, fecha: fecha(2026, 10), usuarioRun: RUN_CLIENTE,
  cliente: { nombre: "Javiera", apellidos: "Contreras Lara", correo: "javiera.contreras@gmail.com" },
  direccion: {}, subtotal: 0, envio: 0, total: 0, metodoPago: "credito", estado: "pagada", items: [],
  ...extra
});

const ORDENES = [
  orden({ id: "ORD-1", numero: 1, total: 101000, estado: "pagada",
    items: [{ id: "p-001", nombre: "Abrigo Largo Paño", precio: 50000, qty: 2 }, { id: "p-002", nombre: "Abrigo Sastronil", precio: 1000, qty: 1 }] }),
  orden({ id: "ORD-2", numero: 2, fecha: fecha(2026, 9), total: 40000, estado: "entregada",
    items: [{ id: "p-001", nombre: "Abrigo Largo Paño", precio: 20000, qty: 2 }] }),
  orden({ id: "ORD-3", numero: 3, total: 77000, estado: "rechazada",
    items: [{ id: "p-003", nombre: "Producto rechazado", precio: 77000, qty: 1 }] })
];

// Forma de las boletas que devuelve ms-boletas (cantidad / precioUnitario).
const boleta = (extra) => ({
  id: "ORD-1", numero: 1, fecha: fecha(2026, 10), usuarioRun: RUN_CLIENTE, total: 0, estado: "pagada",
  cliente: { nombre: "Javiera", apellidos: "Contreras Lara", correo: "javiera.contreras@gmail.com" },
  items: [], ...extra
});

const BOLETAS = [
  boleta({ id: "ORD-1", total: 101000, estado: "pagada",
    items: [{ productoId: "p-001", nombre: "Abrigo Largo Paño", precioUnitario: 50000, cantidad: 2 }, { productoId: "p-002", nombre: "Abrigo Sastronil", precioUnitario: 1000, cantidad: 1 }] }),
  boleta({ id: "ORD-2", fecha: fecha(2026, 9), total: 40000, estado: "entregada",
    items: [{ productoId: "p-001", nombre: "Abrigo Largo Paño", precioUnitario: 20000, cantidad: 2 }] }),
  boleta({ id: "ORD-3", total: 77000, estado: "rechazada",
    items: [{ productoId: "p-003", nombre: "Producto rechazado", precioUnitario: 77000, cantidad: 1 }] })
];

const montarHistorial = (run) => render(
  <MemoryRouter initialEntries={[`/admin/usuarios/${run}/historial`]}>
    <Routes><Route path="/admin/usuarios/:id/historial" element={<AdminHistorialCompras />} /></Routes>
  </MemoryRouter>
);

describe("AdminHistorialCompras", () => {
  beforeEach(() => { spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE); });
  afterEach(() => { cleanup(); });

  it("cantidadProductos suma las unidades (qty) de la orden local", () => {
    expect(cantidadProductos(ORDENES[0])).toBe(3);
    expect(cantidadProductos({ items: [] })).toBe(0);
    expect(cantidadProductos(undefined)).toBe(0);
  });

  it("pide al backend las boletas del RUN de la URL", async () => {
    const porUsuario = spyOn(boletasService, "porUsuario").and.resolveTo(BOLETAS);
    montarHistorial(RUN_CLIENTE);
    await screen.findByText("Historial de compras");
    expect(porUsuario).toHaveBeenCalledWith(RUN_CLIENTE);
  });

  it("muestra las columnas Fecha, Monto, Comprador, Cantidad, Estado y Detalle", async () => {
    spyOn(boletasService, "porUsuario").and.resolveTo(BOLETAS);
    montarHistorial(RUN_CLIENTE);
    for (const titulo of ["Fecha", "Monto", "Comprador", "Cantidad", "Estado", "Detalle"]) {
      expect(await screen.findByRole("columnheader", { name: titulo })).toBeTruthy();
    }
  });

  it("cada compra muestra monto, comprador, cantidad de unidades y enlace \"Ver detalle\"", async () => {
    spyOn(boletasService, "porUsuario").and.resolveTo(BOLETAS);
    montarHistorial(RUN_CLIENTE);
    const fila = (await screen.findByText(formatearCLP(101000))).closest("tr");
    expect(within(fila).getByText("Javiera Contreras Lara")).toBeTruthy();
    expect(within(fila).getByText("3")).toBeTruthy();
    expect(within(fila).getByRole("link", { name: "Ver detalle" }).getAttribute("href")).toBe("/admin/ordenes/ORD-1");
  });

  it("incluye el estado de cada compra (una rechazada no se confunde con una pagada)", async () => {
    spyOn(boletasService, "porUsuario").and.resolveTo(BOLETAS);
    montarHistorial(RUN_CLIENTE);
    await screen.findByText("rechazada");
    expect(screen.getAllByRole("row").length).toBe(4); // encabezado + 3 compras
    expect(screen.getByText("entregada")).toBeTruthy();
  });

  it("si la boleta no trae datos del comprador usa los del usuario", async () => {
    spyOn(boletasService, "porUsuario").and.resolveTo([boleta({ id: "ORD-9", total: 5000, cliente: null })]);
    montarHistorial(RUN_CLIENTE);
    expect(await screen.findByText("Javiera Contreras Lara")).toBeTruthy();
  });

  it("avisa cuando el usuario no tiene compras", async () => {
    spyOn(boletasService, "porUsuario").and.resolveTo([]);
    montarHistorial(RUN_CLIENTE);
    expect(await screen.findByText(/aún no tiene compras/i)).toBeTruthy();
  });

  it("avisa cuando el usuario no existe (404)", async () => {
    usuariosService.obtener.and.rejectWith(errorApi(404, "Usuario no encontrado."));
    spyOn(boletasService, "porUsuario").and.resolveTo([]);
    montarHistorial("000000000");
    expect(await screen.findByText("Usuario no encontrado")).toBeTruthy();
  });

  it("muestra el error del servidor si no se pueden cargar las compras", async () => {
    spyOn(boletasService, "porUsuario").and.rejectWith(errorDeRed());
    montarHistorial(RUN_CLIENTE);
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });

  it("muestra 'Cargando historial' mientras espera la respuesta", () => {
    spyOn(boletasService, "porUsuario").and.returnValue(new Promise(() => {}));
    montarHistorial(RUN_CLIENTE);
    expect(screen.getByText("Cargando historial...")).toBeTruthy();
  });
});

describe("AdminReportes", () => {
  beforeEach(() => { borrar(CLAVE_ORDENES); });
  afterEach(() => { cleanup(); });

  it("sin ventas muestra mensajes en lugar de gráficos", () => {
    render(<AdminReportes />);
    expect(screen.getByText("Aún no hay ventas registradas.")).toBeTruthy();
    expect(screen.getByText("Aún no hay ventas para graficar por mes.")).toBeTruthy();
    expect(screen.getByText("Aún no hay ventas para graficar por categoría.")).toBeTruthy();
    expect(screen.queryAllByRole("img").length).toBe(0);
  });

  it("muestra el total de ventas reales sin contar las órdenes rechazadas", () => {
    guardar(CLAVE_ORDENES, ORDENES);
    render(<AdminReportes />);
    expect(screen.getByText(formatearCLP(141000))).toBeTruthy(); // 101.000 + 40.000
    expect(screen.getByText(/Basado en 2 órdenes/)).toBeTruthy();
  });

  it("el top de productos cuenta unidades (qty): 2 + 2 del abrigo, no 2 líneas", () => {
    guardar(CLAVE_ORDENES, ORDENES);
    render(<AdminReportes />);
    expect(screen.getByText(/1\. Abrigo Largo Paño/)).toBeTruthy();
    expect(screen.getByText("4 unidades")).toBeTruthy();
    expect(screen.queryByText(/Producto rechazado/)).toBeNull();
  });

  it("dibuja los dos gráficos: ventas por mes (barras) y ventas por categoría (torta)", () => {
    guardar(CLAVE_ORDENES, ORDENES);
    render(<AdminReportes />);
    expect(screen.getByText("Ventas por mes")).toBeTruthy();
    expect(screen.getByText("Ventas por categoría")).toBeTruthy();
    expect(screen.getByRole("img", { name: /barras con las ventas por mes/i })).toBeTruthy();
    expect(screen.getByRole("img", { name: /torta con las ventas por categoría/i })).toBeTruthy();
  });
});
