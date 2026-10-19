import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";
import { SesionProvider, CLAVE_SESION } from "../context/SesionContext.jsx";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { CLAVE_USUARIOS } from "../data/usuariosData.js";
import { CLAVE_ORDENES, listarOrdenes } from "../data/ordenesData.js";
import { CLAVE_CARRITO } from "../data/carritoData.js";
import { borrar, guardar } from "../data/storage.js";

const montar = () => render(
    <SesionProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </CarritoProvider>
    </SesionProvider>
);

const ir = (nombre) => fireEvent.click(screen.getByRole("link", { name: new RegExp(nombre, "i") }));
const escribir = (e, v) => fireEvent.change(screen.getByLabelText(e), { target: { value: v } });

describe("Flujo de compra completo", () => {
  beforeEach(() => {
    [CLAVE_USUARIOS, CLAVE_SESION, CLAVE_ORDENES, CLAVE_CARRITO].forEach(borrar);
    // Simulamos que el pago siempre es aprobado (azar alto)
    spyOn(Math, "random").and.returnValue(0.99);
  });

  afterEach(() => {
    cleanup();
  });

  it("compra como invitado: carrito -> checkout -> pago correcto", () => {
    // 1. INYECTAMOS el carrito ANTES de montar
    guardar(CLAVE_CARRITO, [
      { id: "abrigo1", nombre: "Abrigo Classic Camel", precio: 59990, imagen: "x.png", qty: 1 },
      { id: "polera1", nombre: "Polera Básica", precio: 9990, imagen: "x.png", qty: 2 }
    ]);

    montar();
    ir("Carrito");
    expect(screen.getByText(/Carrito de compras/i)).toBeTruthy();

    ir("Ir a pagar");

    escribir("Nombre", "Pedro");
    escribir("Apellidos", "Hacker");
    escribir("Correo electrónico", "pedro@gmail.com");
    escribir("Calle y número", "Los Crisantemos 123");
    escribir("Región", "Región del Biobío");
    escribir("Comuna", "Concepción");
    escribir("Método de pago", "credito");

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));

    expect(screen.getByText(/Se ha realizado la compra/i)).toBeTruthy();
    expect(screen.getByText(/Pedro Hacker/i)).toBeTruthy();

    // ✅ Verificamos que el contador contenga un "0" (ej: "🛒 Carrito (0)")
    expect(screen.getByTestId("contador-carrito").textContent).toMatch(/0/);

    expect(listarOrdenes()[0].estado).toBe("pagada");
    expect(listarOrdenes()[0].usuarioRun).toBeNull();
  });

  it("con sesión iniciada el checkout viene prellenado y la orden queda ligada al RUN", () => {
    // ✅ INYECTAMOS sesión y carrito ANTES de montar para que el contexto los lea
    guardar(CLAVE_SESION, "205558993"); // RUN de Javiera
    guardar(CLAVE_CARRITO, [{ id: "p3", nombre: "Producto X", precio: 10000, imagen: "x.png", qty: 1 }]);

    montar();

    expect(screen.getByText(/Hola, Javiera/i)).toBeTruthy();

    ir("Carrito");
    ir("Ir a pagar");

    escribir("Método de pago", "debito");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));

    expect(screen.getByText(/Se ha realizado la compra/i)).toBeTruthy();
    expect(listarOrdenes()[0].usuarioRun).toBe("205558993");
  });

  it("pago rechazado: conserva el carrito, muestra error y permite reintentar", () => {
    // Forzamos el rechazo simulando un azar bajo (0)
    Math.random.and.returnValue(0);

    guardar(CLAVE_CARRITO, [{ id: "caro1", nombre: "Producto Caro", precio: 999999, imagen: "x.png", qty: 1 }]);

    montar();
    ir("Carrito");
    ir("Ir a pagar");

    escribir("Nombre", "Pedro");
    escribir("Apellidos", "Hacker");
    escribir("Correo electrónico", "pedro@gmail.com");
    escribir("Calle y número", "Los Crisantemos 123");
    escribir("Región", "Región del Biobío");
    escribir("Comuna", "Concepción");
    escribir("Método de pago", "credito");

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));

    expect(screen.getByText(/No se pudo realizar el pago/i)).toBeTruthy();

    // ✅ El carrito debe conservar el 1 item
    expect(screen.getByTestId("contador-carrito").textContent).toMatch(/1/);
    expect(listarOrdenes()[0].estado).toBe("rechazada");

    fireEvent.click(screen.getByRole("button", { name: /Volver a realizar el pago/i }));
    expect(screen.getByText(/No se pudo realizar el pago/i)).toBeTruthy();
    expect(listarOrdenes().length).toBe(1);
  });

  it("carrito vacío muestra aviso", () => {
    montar();
    ir("Carrito");
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
  });
});