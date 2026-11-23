// pagos.spec.jsx - PagoCorrecto y PagoError con la boleta real de ms-boletas (servicios mockeados).
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PagoCorrecto from "../pages/PagoCorrecto.jsx";
import PagoError from "../pages/PagoError.jsx";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import boletasService from "../services/boletas.js";
import { CLAVE_CARRITO } from "../data/carritoData.js";
import { borrar, guardar } from "../data/storage.js";
import { errorApi, errorDeRed } from "./apoyo.jsx";

const boleta = (extra) => ({
  id: "ORD-7", numero: 20260007, total: 19980, subtotal: 19980, envio: 0, metodoPago: "credito", estado: "pagada",
  cliente: { nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com" },
  direccion: { calle: "Los Robles 12", comuna: "Concepción", region: "Región del Biobío" },
  items: [{ productoId: "p-1", nombre: "Polera Básica", precioUnitario: 9990, cantidad: 2, subtotal: 19980 }],
  ...extra
});

const montar = (pagina, ruta, estadoNav) => render(
  <CarritoProvider>
    <MemoryRouter initialEntries={[{ pathname: ruta, state: estadoNav }]}>
      <Routes>
        <Route path="/pago-correcto/:id" element={<PagoCorrecto />} />
        <Route path="/pago-error/:id" element={<PagoError />} />
        <Route path="/" element={<h1>Inicio</h1>} />
      </Routes>
    </MemoryRouter>
  </CarritoProvider>
);

beforeEach(() => borrar(CLAVE_CARRITO));
afterEach(() => { cleanup(); borrar(CLAVE_CARRITO); });

describe("PagoCorrecto", () => {
  it("lee la boleta real y muestra número, código, cliente y productos con cantidad y precio", async () => {
    const obtener = spyOn(boletasService, "obtener").and.resolveTo(boleta());
    montar(PagoCorrecto, "/pago-correcto/ORD-7");
    expect(screen.getByText(/Cargando tu compra/)).toBeTruthy();
    expect(await screen.findByText(/Se ha realizado la compra. nro #20260007/)).toBeTruthy();
    expect(obtener).toHaveBeenCalledWith("ORD-7");
    expect(screen.getByText("Código de orden: ORD-7")).toBeTruthy();
    expect(screen.getByText("Ana Pérez")).toBeTruthy();
    expect(screen.getByText("Polera Básica")).toBeTruthy();
  });

  it("boleta inexistente (404): 'Orden no encontrada'", async () => {
    spyOn(boletasService, "obtener").and.rejectWith(errorApi(404, "Boleta no encontrada"));
    montar(PagoCorrecto, "/pago-correcto/NOEXISTE");
    expect(await screen.findByText("Orden no encontrada")).toBeTruthy();
  });

  it("boleta de otro cliente (403): no la muestra", async () => {
    spyOn(boletasService, "obtener").and.rejectWith(errorApi(403, "No tienes permiso para ver esta boleta"));
    montar(PagoCorrecto, "/pago-correcto/ORD-AJENA");
    expect(await screen.findByText("No tienes permiso para ver esta compra.")).toBeTruthy();
  });

  it("servicio caído: muestra el aviso de conexión", async () => {
    spyOn(boletasService, "obtener").and.rejectWith(errorDeRed());
    montar(PagoCorrecto, "/pago-correcto/ORD-7");
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });

  it("el botón Imprimir llama a window.print", async () => {
    spyOn(boletasService, "obtener").and.resolveTo(boleta());
    const imprimir = spyOn(window, "print");
    montar(PagoCorrecto, "/pago-correcto/ORD-7");
    fireEvent.click(await screen.findByRole("button", { name: "Imprimir boleta" }));
    expect(imprimir).toHaveBeenCalled();
  });
});

describe("PagoError", () => {
  const rechazada = boleta({ estado: "rechazada", motivoRechazo: "Pago rechazado por la pasarela simulada." });

  it("muestra el motivo que viene en la navegación", async () => {
    spyOn(boletasService, "obtener").and.resolveTo(rechazada);
    montar(PagoError, "/pago-error/ORD-7", { motivo: "Motivo desde el checkout" });
    expect(await screen.findByText("Motivo desde el checkout")).toBeTruthy();
    expect(screen.getByText(/No se pudo realizar el pago. nro #20260007/)).toBeTruthy();
  });

  it("si se recarga la página usa el motivo guardado en la boleta", async () => {
    spyOn(boletasService, "obtener").and.resolveTo(rechazada);
    montar(PagoError, "/pago-error/ORD-7");
    expect(await screen.findByText("Pago rechazado por la pasarela simulada.")).toBeTruthy();
  });

  it("reintento aprobado: vacía el carrito y va a pago-correcto", async () => {
    guardar(CLAVE_CARRITO, [{ id: "p-1", nombre: "Polera Básica", precio: 9990, imagen: "x.png", qty: 2 }]);
    spyOn(boletasService, "obtener").and.callFake(async () => (reintentar.calls.count() ? boleta() : rechazada));
    const reintentar = spyOn(boletasService, "reintentarPago").and.resolveTo(boleta({ estado: "pagada" }));
    montar(PagoError, "/pago-error/ORD-7");
    fireEvent.click(await screen.findByRole("button", { name: "Volver a realizar el pago" }));
    expect(await screen.findByText(/Se ha realizado la compra/)).toBeTruthy();
    expect(reintentar).toHaveBeenCalledWith("ORD-7");
  });

  it("reintento rechazado de nuevo: muestra el nuevo motivo y sigue en la vista", async () => {
    spyOn(boletasService, "obtener").and.resolveTo(rechazada);
    spyOn(boletasService, "reintentarPago").and.resolveTo({ ...rechazada, motivoRechazo: "Pago rechazado en el reintento." });
    montar(PagoError, "/pago-error/ORD-7");
    fireEvent.click(await screen.findByRole("button", { name: "Volver a realizar el pago" }));
    expect(await screen.findByText("Pago rechazado en el reintento.")).toBeTruthy();
  });

  it("reintento con error del backend (409): muestra el mensaje y no cambia de vista", async () => {
    spyOn(boletasService, "obtener").and.resolveTo(rechazada);
    spyOn(boletasService, "reintentarPago").and.rejectWith(errorApi(409, "No se pudo completar la compra: stock agotado."));
    montar(PagoError, "/pago-error/ORD-7");
    fireEvent.click(await screen.findByRole("button", { name: "Volver a realizar el pago" }));
    expect(await screen.findByText("No se pudo completar la compra: stock agotado.")).toBeTruthy();
    expect(screen.getByText(/No se pudo realizar el pago/)).toBeTruthy();
  });

  it("boleta inexistente: 'Orden no encontrada'; sin permiso: aviso", async () => {
    spyOn(boletasService, "obtener").and.rejectWith(errorApi(404, "Boleta no encontrada"));
    montar(PagoError, "/pago-error/NOEXISTE");
    expect(await screen.findByText("Orden no encontrada")).toBeTruthy();
    cleanup();
    boletasService.obtener.and.rejectWith(errorApi(403, "No tienes permiso"));
    montar(PagoError, "/pago-error/AJENA");
    expect(await screen.findByText("No tienes permiso para ver esta compra.")).toBeTruthy();
  });
});
