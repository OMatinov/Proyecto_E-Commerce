import { aSolicitudBoleta, desdeBoleta, aSolicitudUsuario } from "../services/adapters.js";

const valores = {
  nombre: " Ana ", apellidos: " Pérez ", correo: " ana@gmail.com ", calle: " Los Robles 12 ", departamento: "",
  indicaciones: "", region: "Región del Biobío", comuna: "Concepción", despacho: "estandar", metodoPago: "credito"
};

describe("adapters: carrito <-> API de boletas", () => {
  it("aSolicitudBoleta convierte qty a cantidad e id a productoId", () => {
    const body = aSolicitudBoleta({ items: [{ id: "p-001", nombre: "X", precio: 10, qty: 3 }], valores });
    expect(body.items).toEqual([{ productoId: "p-001", cantidad: 3 }]);
  });

  it("aSolicitudBoleta limpia espacios y arma cliente y dirección", () => {
    const body = aSolicitudBoleta({ items: [{ id: "p-001", qty: 1 }], valores });
    expect(body.cliente).toEqual({ nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com" });
    expect(body.direccion.calle).toBe("Los Robles 12");
    expect(body.despacho).toBe("estandar");
    expect(body.metodoPago).toBe("credito");
  });

  it("aSolicitudBoleta usa cantidad 1 si el item no trae qty", () => {
    expect(aSolicitudBoleta({ items: [{ id: "p" }], valores }).items[0].cantidad).toBe(1);
  });

  it("desdeBoleta convierte cantidad a qty y precioUnitario a precio", () => {
    const orden = desdeBoleta({ id: "ORD-1", items: [{ productoId: "p-1", nombre: "Polera", precioUnitario: 9990, cantidad: 2, subtotal: 19980 }] });
    expect(orden.items).toEqual([{ id: "p-1", nombre: "Polera", imagen: undefined, precio: 9990, qty: 2 }]);
    expect(orden.id).toBe("ORD-1");
  });

  it("desdeBoleta tolera null y boletas sin items", () => {
    expect(desdeBoleta(null)).toBeNull();
    expect(desdeBoleta({ id: "x" }).items).toEqual([]);
  });
});

describe("adapters: usuario", () => {
  it("aSolicitudUsuario quita la confirmación, limpia el RUN y conserva el resto", () => {
    const cuerpo = aSolicitudUsuario({ run: "19.011.022-2", nombre: "Ana", clave: "abcd", clave2: "abcd" });
    expect(cuerpo).toEqual({ run: "190110222", nombre: "Ana", clave: "abcd" });
  });

  it("aSolicitudUsuario no envía la clave si viene vacía (edición)", () => {
    const cuerpo = aSolicitudUsuario({ run: undefined, nombre: "Ana", clave: "", clave2: "" });
    expect("clave" in cuerpo).toBeFalse();
    expect("run" in cuerpo).toBeFalse();
  });
});
