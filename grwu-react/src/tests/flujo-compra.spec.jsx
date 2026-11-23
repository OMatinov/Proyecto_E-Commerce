// flujo-compra.spec.jsx - Compra completa contra ms-boletas (servicios mockeados) con la app y sus guards reales.
// Cliente con sesión: carrito -> checkout -> boleta pagada / rechazada -> pago-correcto / pago-error.
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import boletasService from "../services/boletas.js";
import { CLAVE_CARRITO } from "../data/carritoData.js";
import { borrar, guardar } from "../data/storage.js";
import { limpiarTokens } from "../services/tokenStore.js";
import { ADMIN, CLIENTE, conSesion, errorApi } from "./apoyo.jsx";

const montar = (ruta = "/") => render(
  <SesionProvider>
    <CarritoProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </CarritoProvider>
  </SesionProvider>
);

const ir = (nombre) => fireEvent.click(screen.getByRole("link", { name: new RegExp(nombre, "i") }));
const escribir = (e, v) => fireEvent.change(screen.getByLabelText(e), { target: { value: v } });
const pagar = () => fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));
const contador = () => screen.getByTestId("contador-carrito").textContent;

const CARRITO = [
  { id: "abrigo1", nombre: "Abrigo Classic Camel", precio: 59990, imagen: "x.png", qty: 1 },
  { id: "polera1", nombre: "Polera Básica", precio: 9990, imagen: "x.png", qty: 2 }
];

// Boleta tal como la devuelve ms-boletas.
const boleta = (extra) => ({
  id: "ORD-20260001", numero: 20260001, fecha: new Date().toISOString(), usuarioRun: CLIENTE.run,
  subtotal: 79970, envio: 0, total: 79970, despacho: "estandar", metodoPago: "credito", estado: "pagada", motivoRechazo: null,
  cliente: { nombre: "Javiera", apellidos: "Contreras Lara", correo: CLIENTE.correo },
  direccion: { calle: "Calle Falsa 123", region: CLIENTE.region, comuna: CLIENTE.comuna },
  items: [
    { productoId: "abrigo1", nombre: "Abrigo Classic Camel", precioUnitario: 59990, cantidad: 1, subtotal: 59990 },
    { productoId: "polera1", nombre: "Polera Básica", precioUnitario: 9990, cantidad: 2, subtotal: 19980 }
  ],
  ...extra
});

function llegarAlCheckout() {
  ir("Carrito");
  ir("Ir a pagar");
}

describe("Flujo de compra completo (Cliente con sesión)", () => {
  beforeEach(() => {
    borrar(CLAVE_CARRITO);
    limpiarTokens();
    guardar(CLAVE_CARRITO, CARRITO);
  });
  afterEach(() => { cleanup(); borrar(CLAVE_CARRITO); limpiarTokens(); });

  it("el checkout viene prellenado, envía la compra a ms-boletas y muestra la boleta pagada", async () => {
    conSesion(CLIENTE);
    const crear = spyOn(boletasService, "crear").and.resolveTo(boleta());
    spyOn(boletasService, "obtener").and.resolveTo(boleta());

    montar();
    expect(await screen.findByText(/Hola, Javiera/i)).toBeTruthy();
    llegarAlCheckout();

    expect(screen.getByLabelText("Nombre").value).toBe("Javiera");
    expect(screen.getByLabelText("Correo electrónico").value).toBe(CLIENTE.correo);
    expect(screen.getByLabelText("Calle y número").value).toBe(CLIENTE.direccion);

    escribir("Método de pago", "debito");
    pagar();

    expect(await screen.findByText(/Se ha realizado la compra/i)).toBeTruthy();
    expect(screen.getByText(/Javiera Contreras Lara/)).toBeTruthy();
    expect(screen.getAllByText(/20260001/).length).toBeGreaterThan(0);

    const enviado = crear.calls.argsFor(0)[0];
    expect(enviado.items).toEqual([{ productoId: "abrigo1", cantidad: 1 }, { productoId: "polera1", cantidad: 2 }]);
    expect(enviado.metodoPago).toBe("debito");
    expect(enviado.cliente.correo).toBe(CLIENTE.correo);
    expect("usuarioRun" in enviado).toBeFalse(); // el RUN lo toma el backend del token, no del formulario
    expect(contador()).toMatch(/0/); // el carrito se vació
  });

  it("pago rechazado: conserva el carrito, muestra el motivo y permite reintentar hasta que se apruebe", async () => {
    conSesion(CLIENTE);
    const rechazada = boleta({ estado: "rechazada", motivoRechazo: "Pago rechazado por la pasarela simulada." });
    spyOn(boletasService, "crear").and.resolveTo(rechazada);
    spyOn(boletasService, "obtener").and.resolveTo(rechazada);
    const reintentar = spyOn(boletasService, "reintentarPago").and.returnValues(
      Promise.resolve({ ...rechazada, motivoRechazo: "Pago rechazado en el reintento." }),
      Promise.resolve(boleta({ estado: "pagada" }))
    );

    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    escribir("Método de pago", "credito");
    pagar();

    expect(await screen.findByText(/No se pudo realizar el pago/i)).toBeTruthy();
    expect(screen.getByText("Pago rechazado por la pasarela simulada.")).toBeTruthy();
    expect(contador()).toMatch(/3/); // el carrito sigue lleno (1 + 2 unidades)

    fireEvent.click(screen.getByRole("button", { name: /Volver a realizar el pago/i }));
    expect(await screen.findByText("Pago rechazado en el reintento.")).toBeTruthy();
    expect(reintentar).toHaveBeenCalledWith("ORD-20260001");

    fireEvent.click(screen.getByRole("button", { name: /Volver a realizar el pago/i }));
    expect(await screen.findByText(/Se ha realizado la compra/i)).toBeTruthy();
    await waitFor(() => { if (!/0/.test(contador())) throw new Error("el carrito aún no se vacía"); });
  });

  it("sin stock (409): muestra el mensaje del backend, no navega y conserva el carrito", async () => {
    conSesion(CLIENTE);
    spyOn(boletasService, "crear").and.rejectWith(errorApi(409, "Stock insuficiente para: Polera Básica"));

    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    escribir("Método de pago", "credito");
    pagar();

    expect(await screen.findByText("Stock insuficiente para: Polera Básica")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Pagar ahora/i }).disabled).toBe(false);
    expect(contador()).toMatch(/3/);
  });

  it("sesión vencida (401): avisa que inicie sesión de nuevo", async () => {
    conSesion(CLIENTE);
    spyOn(boletasService, "crear").and.rejectWith(errorApi(401, "No autenticado"));
    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    escribir("Método de pago", "credito");
    pagar();
    expect(await screen.findByText(/Tu sesión expiró/)).toBeTruthy();
  });

  it("sin permiso (403): avisa que solo los clientes pueden pagar", async () => {
    conSesion(CLIENTE);
    spyOn(boletasService, "crear").and.rejectWith(errorApi(403, "No tienes permisos"));
    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    escribir("Método de pago", "credito");
    pagar();
    expect(await screen.findByText(/solo los clientes pueden pagar/i)).toBeTruthy();
  });

  it("errores por campo del backend (400) se muestran en el formulario", async () => {
    conSesion(CLIENTE);
    spyOn(boletasService, "crear").and.rejectWith(errorApi(400, "Error de validación en los datos enviados", { "direccion.calle": "La calle es obligatoria" }));
    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    escribir("Método de pago", "credito");
    pagar();
    expect(await screen.findByText("Error de validación en los datos enviados")).toBeTruthy();
  });

  it("no envía nada si el formulario es inválido", async () => {
    conSesion(CLIENTE);
    const crear = spyOn(boletasService, "crear");
    montar();
    await screen.findByText(/Hola, Javiera/i);
    llegarAlCheckout();
    pagar(); // sin método de pago
    expect(screen.getByText("Selecciona un método de pago.")).toBeTruthy();
    expect(crear).not.toHaveBeenCalled();
  });

  it("carrito vacío muestra aviso", async () => {
    borrar(CLAVE_CARRITO);
    conSesion(CLIENTE);
    montar();
    await screen.findByText(/Hola, Javiera/i);
    ir("Carrito");
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
  });
});

describe("Guards del checkout (solo Cliente)", () => {
  beforeEach(() => { borrar(CLAVE_CARRITO); limpiarTokens(); guardar(CLAVE_CARRITO, CARRITO); });
  afterEach(() => { cleanup(); borrar(CLAVE_CARRITO); limpiarTokens(); });

  it("un invitado que entra a /checkout es enviado a /login", async () => {
    montar("/checkout");
    expect(await screen.findByText("Inicia sesión en tu cuenta")).toBeTruthy();
  });

  it("un administrador no puede pagar: /checkout lo devuelve a la tienda", async () => {
    conSesion(ADMIN);
    montar("/checkout");
    await waitFor(() => { if (screen.queryByText("Finalizar compra")) throw new Error("no debería ver el checkout"); });
    expect(screen.queryByText("Finalizar compra")).toBeNull();
  });

  it("mientras se restaura la sesión se muestra 'Cargando sesión...' y luego el checkout del cliente", async () => {
    conSesion(CLIENTE);
    montar("/checkout");
    expect(screen.getByText("Cargando sesión...")).toBeTruthy();
    expect(await screen.findByText("Finalizar compra")).toBeTruthy();
  });
});
