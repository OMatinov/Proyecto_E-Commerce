// categorias.js - Llamadas a las categorias de ms-catalogo (8082).
// Autor: Matias
//
// Rutas relativas sobre la instancia unica de Axios. GET es publico; crear,
// actualizar y eliminar exigen token de Administrador (lo valida el backend).

import api from './api.js';
import { normalizarError } from './erroresApi.js';

/** Convierte lo que escribe el formulario al JSON de CategoriaRequest. */
function aSolicitud(datos = {}) {
  return {
    slug: String(datos.slug ?? '').trim().toLowerCase(),
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: datos.descripcion ?? null,
    imagen: datos.imagen ?? null,
    genero: datos.genero || null,
  };
}

/** Lista todas las categorias (de genero y de prenda). */
export async function listarCategorias() {
  try {
    const { data } = await api.get('/categorias');
    return data ?? [];
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Detalle por ID. Devuelve null si no existe (404). */
export async function obtenerCategoria(id) {
  try {
    const { data } = await api.get(`/categorias/${encodeURIComponent(id)}`);
    return data;
  } catch (error) {
    const normalizado = normalizarError(error);
    if (normalizado.status === 404) return null;
    throw normalizado;
  }
}

/** Detalle por slug. Devuelve null si no existe (404). */
export async function obtenerCategoriaPorSlug(slug) {
  try {
    const { data } = await api.get(`/categorias/slug/${encodeURIComponent(slug)}`);
    return data;
  } catch (error) {
    const normalizado = normalizarError(error);
    if (normalizado.status === 404) return null;
    throw normalizado;
  }
}

/** Crea una categoria. Requiere token de Administrador. */
export async function crearCategoria(datos) {
  try {
    const { data } = await api.post('/categorias', aSolicitud(datos));
    return data;
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Actualiza una categoria. Requiere token de Administrador. */
export async function actualizarCategoria(id, datos) {
  try {
    const { data } = await api.put(`/categorias/${encodeURIComponent(id)}`, aSolicitud(datos));
    return data;
  } catch (error) {
    throw normalizarError(error);
  }
}

/** Elimina una categoria. Responde 409 si tiene productos asociados. */
export async function eliminarCategoria(id) {
  try {
    await api.delete(`/categorias/${encodeURIComponent(id)}`);
    return true;
  } catch (error) {
    throw normalizarError(error);
  }
}
