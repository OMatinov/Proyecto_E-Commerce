// reportes.js - Cálculos para los gráficos del panel "Reportes" (AdminReportes).
// Son funciones puras: reciben las órdenes y devuelven datos listos para chart.js.
//
// Una orden cuenta como venta si su pago se concretó (pagada, enviada o entregada).
// Las rechazadas y canceladas no suman.

export const ESTADOS_VENTA = ["pagada", "enviada", "entregada"];
export const SIN_CATEGORIA = "Sin categoría";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function ordenesDeVenta(ordenes) {
  return (ordenes || []).filter((o) => ESTADOS_VENTA.includes(o.estado));
}

export function totalVentas(ordenes) {
  return ordenesDeVenta(ordenes).reduce((suma, o) => suma + (Number(o.total) || 0), 0);
}

// Ventas agrupadas por mes, de la más antigua a la más reciente.
// Devuelve { etiquetas: ["Sep 2026", "Oct 2026"], valores: [12000, 45000] }
export function ventasPorMes(ordenes) {
  const meses = new Map(); // "2026-09" -> { etiqueta, total }
  ordenesDeVenta(ordenes).forEach((o) => {
    const fecha = new Date(o.fecha);
    if (Number.isNaN(fecha.getTime())) return;
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    const clave = `${anio}-${String(mes + 1).padStart(2, "0")}`;
    const actual = meses.get(clave) || { etiqueta: `${MESES[mes]} ${anio}`, total: 0 };
    actual.total += Number(o.total) || 0;
    meses.set(clave, actual);
  });
  const ordenados = [...meses.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  return { etiquetas: ordenados.map((m) => m.etiqueta), valores: ordenados.map((m) => m.total) };
}

// Ventas agrupadas por categoría de producto (monto = precio x cantidad de cada ítem).
// `categoriaDe(item)` devuelve el nombre de la categoría del ítem; si no, cae en "Sin categoría".
// Devuelve { etiquetas, valores } de mayor a menor monto.
export function ventasPorCategoria(ordenes, categoriaDe = () => SIN_CATEGORIA) {
  const categorias = new Map();
  ordenesDeVenta(ordenes).forEach((o) => {
    (o.items || []).forEach((item) => {
      const nombre = categoriaDe(item) || SIN_CATEGORIA;
      const monto = (Number(item.precio) || 0) * (Number(item.qty) || 0);
      categorias.set(nombre, (categorias.get(nombre) || 0) + monto);
    });
  });
  const ordenadas = [...categorias.entries()].sort((a, b) => b[1] - a[1]);
  return { etiquetas: ordenadas.map(([n]) => n), valores: ordenadas.map(([, v]) => v) };
}

// Productos más vendidos por unidades. Los ítems del carrito guardan la cantidad en `qty`.
export function productosMasVendidos(ordenes, limite = 3) {
  const conteo = new Map();
  ordenesDeVenta(ordenes).forEach((o) => {
    (o.items || []).forEach((item) => {
      conteo.set(item.nombre, (conteo.get(item.nombre) || 0) + (Number(item.qty) || 0));
    });
  });
  return [...conteo.entries()]
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limite);
}
