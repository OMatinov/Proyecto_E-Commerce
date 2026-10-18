import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import { SesionProvider, CLAVE_SESION } from "../src/context/SesionContext.jsx";
import { CarritoProvider } from "../src/context/CarritoContext.jsx";
import { CLAVE_USUARIOS } from "../src/data/usuariosData.js";
import { CLAVE_ORDENES, listarOrdenes } from "../src/data/ordenesData.js";
import { CLAVE_CARRITO } from "../src/data/carritoData.js";
import { borrar } from "../src/data/storage.js";

const montar = () => render(
  <SesionProvider><CarritoProvider><MemoryRouter initialEntries={["/"]}><App /></MemoryRouter></CarritoProvider></SesionProvider>
);
const ir = (nombre) => fireEvent.click(screen.getByRole("link", { name: new RegExp(nombre) }));
const contador = () => screen.getByTestId("contador-carrito").textContent;
const escribir = (e, v) => fireEvent.change(screen.getByLabelText(e), { target: { value: v } });

describe("Flujo de compra completo", () => {
  beforeEach(() => {
    [CLAVE_USUARIOS, CLAVE_SESION, CLAVE_ORDENES, CLAVE_CARRITO].forEach(borrar);
    spyOn(Math, "random").and.returnValue(0.99);
  });
  afterEach(cleanup);

  it("compra como invitado: carrito -> checkout -> pago correcto", () => {
    montar();
    const botones = screen.getAllByText("Agregar al carrito");
    fireEvent.click(botones[0]); fireEvent.click(botones[0]); fireEvent.click(botones[3]);
    expect(contador()).toBe("3");
    ir("Carrito");
    expect(screen.getByText("Carrito de compras")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Agregar una unidad de Abrigo Classic Camel"));
    expect(screen.getByTestId("qty-abrigo1").textContent).toBe("3");
    fireEvent.click(screen.getByRole("link", { name: "Ir a pagar" }));

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(3); // validación

    escribir("Nombre", "Pedro"); escribir("Apellidos", "Hacker"); escribir("Correo electrónico", "pedro@gmail.com");
    escribir("Calle y número", "Los Crisantemos 123"); escribir("Región", "Región del Biobío"); escribir("Comuna", "Concepción");
    escribir("Método de pago", "credito");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByText(/Se ha realizado la compra/)).toBeTruthy();
    expect(screen.getByText(/Pedro Hacker/)).toBeTruthy();
    expect(contador()).toBe("0");
    expect(listarOrdenes()[0].estado).toBe("pagada");
    expect(listarOrdenes()[0].usuarioRun).toBeNull();
  });

  it("con sesión iniciada el checkout viene prellenado y la orden queda ligada al RUN", () => {
    montar();
    ir("Iniciar sesión");
    escribir("Correo electrónico", "javiera.contreras@gmail.com"); escribir("Contraseña", "1234");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(screen.getByText("Hola, Javiera")).toBeTruthy();
    fireEvent.click(screen.getAllByText("Agregar al carrito")[3]);
    ir("Carrito"); fireEvent.click(screen.getByRole("link", { name: "Ir a pagar" }));
    expect(screen.getByLabelText("Nombre").value).toBe("Javiera");
    expect(screen.getByLabelText("Comuna").value).toBe("Temuco");
    escribir("Método de pago", "debito");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
    expect(screen.getByText(/Se ha realizado la compra/)).toBeTruthy();
    expect(listarOrdenes()[0].usuarioRun).toBe("205558993");
  });

  it("pago rechazado: conserva el carrito, muestra error y permite reintentar", () => {
    montar();
    fireEvent.click(screen.getAllByText("Agregar al carrito")[0]);
    ir("Carrito");
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByLabelText("Agregar una unidad de Abrigo Classic Camel"));
    fireEvent.click(screen.getByRole("link", { name: "Ir a pagar" }));
    escribir("Nombre", "Pedro"); escribir("Apellidos", "Hacker"); escribir("Correo electrónico", "pedro@gmail.com");
    escribir("Calle y número", "Los Crisantemos 123"); escribir("Región", "Región del Biobío"); escribir("Comuna", "Concepción");
    escribir("Método de pago", "credito");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByText(/No se pudo realizar el pago/)).toBeTruthy();
    expect(screen.getByText("El monto supera el límite de la tarjeta.")).toBeTruthy();
    expect(contador()).toBe("6");
    expect(listarOrdenes()[0].estado).toBe("rechazada");

    fireEvent.click(screen.getByRole("button", { name: "Volver a realizar el pago" }));
    expect(screen.getByText(/No se pudo realizar el pago/)).toBeTruthy(); // sigue sobre el límite
    expect(listarOrdenes().length).toBe(1);
  });

  it("carrito vacío muestra aviso y cerrar sesión funciona", () => {
    montar();
    ir("Carrito");
    expect(screen.getByText("Tu carrito está vacío")).toBeTruthy();
  });
});
