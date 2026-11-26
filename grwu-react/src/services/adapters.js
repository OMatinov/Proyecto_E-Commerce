// adapters.js - Traducción entre el contrato de ms-boletas y las formas que ya usan las vistas.
// La API entrega items con `cantidad` y `precioUnitario`; el carrito local y utils/reportes.js
// usan `qty` y `precio`. La conversión ocurre acá, en el límite del servicio.

const texto = (valor) => (valor == null ? "" : String(valor));

/**
 * Normaliza cualquier error de Axios a { mensaje, status, errores }.
 * No reemplaza el error original en api.js: Checkout (César) lee error.response.status.
 */
export function normalizarError(error) {
  const datos = error?.response?.data || {};
  return {
    mensaje: texto(datos.message || error?.message || "Error inesperado"),
    status: error?.response?.status ?? 0,
    errores: datos.errores || null
  };
}

/** Agrega los alias `precio` y `qty` sin quitar los campos del contrato. */
export function adaptarItem(item) {
  if (!item) return item;
  return {
    ...item,
    id: item.productoId ?? item.id,
    nombre: item.nombre ?? item.nombreProducto ?? "",
    precio: item.precioUnitario ?? item.precio ?? 0,
    qty: item.cantidad ?? item.qty ?? 0
  };
}

export function adaptarBoleta(boleta) {
  if (!boleta) return boleta;
  return {
    ...boleta,
    items: (boleta.items || []).map(adaptarItem)
  };
}

export function adaptarBoletas(lista) {
  return (lista || []).map(adaptarBoleta);
}

/**
 * Convierte el carrito local a CrearBoletaRequest.
 * Acepta items con `qty` (carrito) o con `cantidad` (ya adaptados).
 */
export function aRequestBoleta({ items = [], ...resto }) {
  return {
    ...resto,
    items: items.map((item) => ({
      productoId: item.productoId ?? item.id,
      cantidad: Number(item.cantidad ?? item.qty ?? 1)
    }))
  };
}

// --- Contrato alternativo de ms-boletas (consumido por Checkout/Pago* vinculados a main) ---

// Valores del formulario de boleta -> cuerpo CrearBoletaRequest.
export function aSolicitudBoleta({ items, valores }) {
  return {
    items: items.map((i) => ({ productoId: i.id, cantidad: i.qty || 1 })),
    despacho: valores.despacho,
    metodoPago: valores.metodoPago,
    cliente: {
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim()
    },
    direccion: {
      calle: valores.calle.trim(),
      departamento: valores.departamento.trim(),
      indicaciones: valores.indicaciones.trim(),
      region: valores.region,
      comuna: valores.comuna
    }
  };
}

// Boleta de ms-boletas -> forma que usan ResumenOrden/TablaItems.
export function desdeBoleta(boleta) {
  if (!boleta) return null;
  return {
    ...boleta,
    items: (boleta.items || []).map((i) => ({
      id: i.productoId,
      nombre: i.nombre,
      imagen: i.imagen,
      precio: i.precioUnitario,
      qty: i.cantidad
    }))
  };
}
