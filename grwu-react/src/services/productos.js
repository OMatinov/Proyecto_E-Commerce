// productos.js - Llamadas al catalogo de productos de ms-catalogo (8082).
// Autor: Matias
//
// Todas las rutas son relativas (/api/v1/...) y pasan por la instancia unica de
// Axios (api.js), que agrega el Bearer y renueva el token si expira.
// El backend es la autoridad: los precios, el stock y la categoria los valida el.

import api from './api.js';
import { normalizarError } from './erroresApi.js';

// Las categorias de genero agrupan productos por su campo genero, no por la
// relacion categoria_id. Por eso se traducen al filtro ?genero=.
const CATEGORIAS_GENERO = ['hombre', 'mujer'];

/**
 * La API devuelve categoriaId + categoriaSlug; las pantallas existentes siguen
 * leyendo producto.categoria, asi que se expone ese alias en el limite del
 * servicio (no se cambian los componentes por el nombre del campo).
 */
function adaptarProducto(datos) {
  if (!datos) return null;
  return {
    ...datos,
    categoria: datos.categoriaSlug ?? datos.categoria ?? '',
    imagenes: Array.isArray(datos.imagenes) ? datos.imagenes : [],
  };
}

/** Convierte lo que escribe el formulario (texto) al JSON que espera la API. */
function aSolicitud(datos = {}) {
  return {
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: datos.descripcion ?? null,
    precio: Number(datos.precio),
    precioOriginal: Number(datos.precioOriginal) || 0,
    oferta: Number(datos.oferta) || 0,
    categoria: datos.categoria,
    genero: datos.genero,
    stock: Number(datos.stock),
    imagen: datos.imagen ?? null,
    imagenes: (datos.imagenes ?? []).filter(Boolean),
  };
}

/**
 * Lista productos activos. Filtros opcionales y combinables:
 * { categoria, genero, oferta, q, criticos, umbral }.
 */
export async function listarProductos(filtros = {}) {
  const params = {};
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.genero) params.genero = filtros.genero;
  if (filtros.oferta !== undefined && filtros.oferta !== null) params.oferta = filtros.oferta;
  if (filtros.q) params.q = filtros.q;
  if (filtros.criticos !== undefined && filtros.criticos !== null) params.criticos = filtros.criticos;
  if (filtros.umbral !== undefined && filtros.umbral !== null) params.umbral = filtros.umbral;

  try {
    const { data } = await api.get('/productos', { params });
    return (data ?? []).map(adaptarProducto);
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Detalle por ID. Devuelve null si el producto no existe o esta inactivo (404). */
export async function obtenerProducto(id) {
  try {
    const { data } = await api.get(`/productos/${encodeURIComponent(id)}`);
    return adaptarProducto(data);
  } catch (error) {
    const normalizado = normalizarError(error);
    if (normalizado.status === 404) return null;
    throw normalizado;
  }
}

/** Productos de una categoria. Si el slug es de genero, filtra por genero. */
export async function listarPorCategoria(categoria) {
  if (CATEGORIAS_GENERO.includes(categoria)) {
    return listarProductos({ genero: categoria });
  }
  return listarProductos({ categoria });
}

/** Productos con oferta (oferta > 0). */
export async function listarOfertas() {
  return listarProductos({ oferta: true });
}

/** Productos con stock igual o bajo el umbral (por defecto 5). */
export async function listarProductosCriticos(umbral = 5) {
  return listarProductos({ criticos: true, umbral });
}

/** Crea un producto. Requiere token de Administrador. */
export async function crearProducto(datos) {
  try {
    const { data } = await api.post('/productos', aSolicitud(datos));
    return adaptarProducto(data);
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Actualiza un producto. Requiere token de Administrador. */
export async function actualizarProducto(id, datos) {
  try {
    const { data } = await api.put(`/productos/${encodeURIComponent(id)}`, aSolicitud(datos));
    return adaptarProducto(data);
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Borrado logico (activo = false). Requiere token de Administrador. */
export async function eliminarProducto(id) {
  try {
    await api.delete(`/productos/${encodeURIComponent(id)}`);
    return true;
  } catch (error) {
    throw normalizarError(error);
  }
}
