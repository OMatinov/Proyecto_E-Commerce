// reportes.spec.js - Pruebas de los cálculos del panel de reportes (utils/reportes.js).
import {
  ESTADOS_VENTA, SIN_CATEGORIA,
  ordenesDeVenta, totalVentas, ventasPorMes, ventasPorCategoria, productosMasVendidos
} from "../utils/reportes.js";

// Fecha local a mediodía del día 15: evita que la zona horaria cambie el mes.
const fecha = (anio, mes) => new Date(anio, mes - 1, 15, 12).toISOString();

const ordenes = [
  { id: "A", estado: "pagada", total: 30000, fecha: fecha(2026, 9),
    items: [{ id: "p-001", nombre: "Abrigo", precio: 10000, qty: 2 }, { id: "p-900", nombre: "Gorro", precio: 5000, qty: 2 }] },
  { id: "B", estado: "entregada", total: 20000, fecha: fecha(2026, 10),
    items: [{ id: "p-001", nombre: "Abrigo", precio: 10000, qty: 1 }, { id: "p-010", nombre: "Polera", precio: 10000, qty: 1 }] },
  { id: "C", estado: "enviada", total: 15000, fecha: fecha(2026, 10),
    items: [{ id: "p-010", nombre: "Polera", precio: 7500, qty: 2 }] },
  { id: "D", estado: "rechazada", total: 99000, fecha: fecha(2026, 10), items: [{ id: "p-001", nombre: "Abrigo", precio: 99000, qty: 1 }] },
  { id: "E", estado: "cancelada", total: 88000, fecha: fecha(2026, 8), items: [] }
];

const categoriaDe = (item) => ({ "p-001": "Abrigos", "p-010": "Poleras" }[item.id]);

describe("reportes: ventas", () => {
  it("solo cuentan como venta las órdenes pagadas, enviadas o entregadas", () => {
    expect(ESTADOS_VENTA).toEqual(["pagada", "enviada", "entregada"]);
    expect(ordenesDeVenta(ordenes).map((o) => o.id)).toEqual(["A", "B", "C"]);
  });

  it("totalVentas suma solo las ventas (ignora rechazadas y canceladas)", () => {
    expect(totalVentas(ordenes)).toBe(65000);
  });

  it("sin órdenes todo da cero o vacío", () => {
    expect(totalVentas([])).toBe(0);
    expect(totalVentas(undefined)).toBe(0);
    expect(ventasPorMes([])).toEqual({ etiquetas: [], valores: [] });
    expect(ventasPorCategoria([])).toEqual({ etiquetas: [], valores: [] });
    expect(productosMasVendidos([])).toEqual([]);
  });
});

describe("reportes: ventas por mes", () => {
  it("agrupa por mes y los ordena del más antiguo al más reciente", () => {
    expect(ventasPorMes(ordenes)).toEqual({ etiquetas: ["Sep 2026", "Oct 2026"], valores: [30000, 35000] });
  });

  it("ordena bien los meses aunque cambie el año", () => {
    const r = ventasPorMes([
      { estado: "pagada", total: 1000, fecha: fecha(2027, 1) },
      { estado: "pagada", total: 2000, fecha: fecha(2026, 12) }
    ]);
    expect(r.etiquetas).toEqual(["Dic 2026", "Ene 2027"]);
  });

  it("ignora las órdenes con fecha inválida", () => {
    const r = ventasPorMes([{ estado: "pagada", total: 1000, fecha: "no-es-fecha" }]);
    expect(r.etiquetas).toEqual([]);
  });
});

describe("reportes: ventas por categoría", () => {
  it("suma precio x cantidad por categoría, de mayor a menor", () => {
    const r = ventasPorCategoria(ordenes, categoriaDe);
    // Abrigos: 10000x2 + 10000x1 = 30000 | Poleras: 10000x1 + 7500x2 = 25000 | Sin categoría: 5000x2 = 10000
    expect(r.etiquetas).toEqual(["Abrigos", "Poleras", SIN_CATEGORIA]);
    expect(r.valores).toEqual([30000, 25000, 10000]);
  });

  it("sin función de categorías todo cae en \"Sin categoría\"", () => {
    const r = ventasPorCategoria(ordenes);
    expect(r.etiquetas).toEqual([SIN_CATEGORIA]);
    expect(r.valores).toEqual([65000]);
  });
});

describe("reportes: productos más vendidos", () => {
  it("cuenta unidades con la cantidad (qty) de cada ítem, no líneas", () => {
    expect(productosMasVendidos(ordenes)).toEqual([
      { nombre: "Abrigo", cantidad: 3 },
      { nombre: "Polera", cantidad: 3 },
      { nombre: "Gorro", cantidad: 2 }
    ]);
  });

  it("respeta el límite pedido", () => {
    expect(productosMasVendidos(ordenes, 1).length).toBe(1);
  });
});
