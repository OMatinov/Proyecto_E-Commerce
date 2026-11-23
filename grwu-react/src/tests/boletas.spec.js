// boletas.spec.js - Servicios y adaptadores de ms-boletas (Katerine).
// Se mockea services/api.js con spyOn: las pruebas no necesitan backend ni MySQL.
import api from "../services/api.js";
import { normalizarError, adaptarBoleta, aRequestBoleta, desdeBoleta, aSolicitudBoleta } from "../services/adapters.js";
import boletasPorDefecto, {
  listarBoletas,
  obtenerBoleta,
  cambiarEstado,
  cancelarBoleta,
  crearBoleta,
  misBoletas,
  reintentarPago
} from "../services/boletas.js";

const boletaDeApi = () => ({
  id: "ORD-20260001",
  estado: "pagada",
  total: 25000,
  items: [{ productoId: "p-001", nombre: "Polera", precioUnitario: 12500, cantidad: 2, subtotal: 25000 }]
});

describe("adaptadores de boletas", () => {
  it("expone qty y precio sin quitar cantidad y precioUnitario", () => {
    const boleta = adaptarBoleta(boletaDeApi());
    const item = boleta.items[0];

    expect(item.qty).toBe(2);
    expect(item.precio).toBe(12500);
    expect(item.cantidad).toBe(2);
    expect(item.precioUnitario).toBe(12500);
    expect(item.id).toBe("p-001");
  });

  it("convierte qty del carrito a cantidad al armar la request", () => {
    const request = aRequestBoleta({
      items: [{ id: "p-001", qty: 3 }],
      despacho: "estandar"
    });

    expect(request.items).toEqual([{ productoId: "p-001", cantidad: 3 }]);
    expect(request.despacho).toBe("estandar");
  });

  it("normaliza errores del formato único del backend", () => {
    const error = {
      response: {
        status: 409,
        data: { message: "Stock insuficiente para p-010", errores: { "items[0].cantidad": "Solo quedan 2" } }
      }
    };

    const normalizado = normalizarError(error);
    expect(normalizado.status).toBe(409);
    expect(normalizado.mensaje).toBe("Stock insuficiente para p-010");
    expect(normalizado.errores["items[0].cantidad"]).toBe("Solo quedan 2");
  });

  it("desdeBoleta devuelve los ítems adaptados a la forma de vista (id, nombre, precio, qty)", () => {
    const boleta = desdeBoleta(boletaDeApi());
    const item = boleta.items[0];

    expect(item.id).toBe("p-001");
    expect(item.nombre).toBe("Polera");
    expect(item.precio).toBe(12500);
    expect(item.qty).toBe(2);
    expect(item.cantidad).toBeUndefined(); // Desde la API se mueve a la forma de vista (qty)
  });

  it("aSolicitudBoleta convierte el carrito en la request de ms-boletas", () => {
    const solicitud = aSolicitudBoleta({
      items: [{ id: "p-001", qty: 2 }, { id: "p-010", qty: 1 }],
      valores: {
        despacho: "premium",
        metodoPago: "debito",
        nombre: "Matías",
        apellidos: "Fuentes Rivas",
        correo: "matias.fuentes@duoc.cl",
        calle: "Calle Falsa 123",
        departamento: "",
        indicaciones: "",
        region: "Región Metropolitana de Santiago",
        comuna: "Santiago"
      }
    });

    expect(solicitud.items).toEqual([
      { productoId: "p-001", cantidad: 2 },
      { productoId: "p-010", cantidad: 1 }
    ]);
    expect(solicitud.despacho).toBe("premium");
    expect(solicitud.metodoPago).toBe("debito");
    expect(solicitud.cliente.nombre).toBe("Matías");
    expect(solicitud.direccion.comuna).toBe("Santiago");
  });
});

describe("servicio boletas", () => {
  it("listarBoletas envía solo los filtros con valor y adapta la respuesta", async () => {
    spyOn(api, "get").and.returnValue(Promise.resolve({ data: [boletaDeApi()] }));

    const resultado = await listarBoletas({ estado: "pagada", usuarioRun: "", desde: null });

    expect(api.get).toHaveBeenCalledWith("/boletas", { params: { estado: "pagada" } });
    expect(resultado[0].items[0].qty).toBe(2);
  });

  it("obtenerBoleta pide el detalle por id", async () => {
    spyOn(api, "get").and.returnValue(Promise.resolve({ data: boletaDeApi() }));

    const boleta = await obtenerBoleta("ORD-20260001");

    expect(api.get).toHaveBeenCalledWith("/boletas/ORD-20260001");
    expect(boleta.id).toBe("ORD-20260001");
  });

  it("cambiarEstado envía PATCH con el estado nuevo", async () => {
    spyOn(api, "patch").and.returnValue(Promise.resolve({ data: boletaDeApi() }));

    await cambiarEstado("ORD-20260001", "enviada");

    expect(api.patch).toHaveBeenCalledWith("/boletas/ORD-20260001/estado", { estado: "enviada" });
  });

  it("cancelarBoleta envía DELETE", async () => {
    spyOn(api, "delete").and.returnValue(Promise.resolve({ status: 204 }));

    await cancelarBoleta("ORD-20260001");

    expect(api.delete).toHaveBeenCalledWith("/boletas/ORD-20260001");
  });

  it("crearBoleta envía la request adaptada y devuelve la boleta adaptada", async () => {
    spyOn(api, "post").and.returnValue(Promise.resolve({ data: boletaDeApi() }));

    const resultado = await crearBoleta({
      items: [{ id: "p-001", qty: 2 }],
      despacho: "estandar",
      metodoPago: "credito",
      cliente: { nombre: "Matías", apellidos: "Fuentes Rivas", correo: "matias.fuentes@duoc.cl" },
      direccion: { calle: "Calle Falsa 123", region: "Región Metropolitana de Santiago", comuna: "Santiago" }
    });

    expect(api.post).toHaveBeenCalledWith("/boletas", {
      items: [{ productoId: "p-001", cantidad: 2 }],
      despacho: "estandar",
      metodoPago: "credito",
      cliente: { nombre: "Matías", apellidos: "Fuentes Rivas", correo: "matias.fuentes@duoc.cl" },
      direccion: { calle: "Calle Falsa 123", region: "Región Metropolitana de Santiago", comuna: "Santiago" }
    });
    expect(resultado.id).toBe("ORD-20260001");
    expect(resultado.items[0].qty).toBe(2);
  });

  it("misBoletas pide /boletas/mias y adapta la respuesta", async () => {
    spyOn(api, "get").and.returnValue(Promise.resolve({ data: [boletaDeApi()] }));

    const resultado = await misBoletas();

    expect(api.get).toHaveBeenCalledWith("/boletas/mias");
    expect(resultado[0].items[0].qty).toBe(2);
  });

  it("reintentarPago pide el reintento de pago y devuelve la boleta adaptada", async () => {
    spyOn(api, "post").and.returnValue(Promise.resolve({ data: boletaDeApi() }));

    const resultado = await reintentarPago("ORD-20260001");

    expect(api.post).toHaveBeenCalledWith("/boletas/ORD-20260001/reintentar-pago");
    expect(resultado.items[0].qty).toBe(2);
  });

  it("el export por defecto expone todos los métodos con los alias esperados", () => {
    expect(typeof boletasPorDefecto.crear).toBe("function");
    expect(typeof boletasPorDefecto.listar).toBe("function");
    expect(typeof boletasPorDefecto.obtener).toBe("function");
    expect(typeof boletasPorDefecto.mias).toBe("function");
    expect(typeof boletasPorDefecto.porUsuario).toBe("function");
    expect(typeof boletasPorDefecto.reintentarPago).toBe("function");
    expect(typeof boletasPorDefecto.cambiarEstado).toBe("function");
    expect(typeof boletasPorDefecto.cancelarBoleta).toBe("function");
  });
});
