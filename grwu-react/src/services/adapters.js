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
