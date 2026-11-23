// boletas.js - Único punto de acceso a ms-boletas (/api/v1/boletas).
// Los componentes no importan Axios directamente: usan estas funciones.
import api from "./api.js";
import { aRequestBoleta, adaptarBoleta, adaptarBoletas } from "./adapters.js";

function paramsLimpios(filtros) {
  return Object.fromEntries(
    Object.entries(filtros || {}).filter(([, valor]) => valor !== "" && valor != null)
  );
}

export async function crearBoleta(datos) {
  const { data } = await api.post("/boletas", aRequestBoleta(datos));
  return adaptarBoleta(data);
}

export async function listarBoletas(filtros = {}) {
  const { data } = await api.get("/boletas", { params: paramsLimpios(filtros) });
  return adaptarBoletas(data);
}

export async function obtenerBoleta(id) {
  const { data } = await api.get(`/boletas/${id}`);
  return adaptarBoleta(data);
}

export async function misBoletas() {
  const { data } = await api.get("/boletas/mias");
  return adaptarBoletas(data);
}

export async function reintentarPago(id) {
  const { data } = await api.post(`/boletas/${id}/reintentar-pago`);
  return adaptarBoleta(data);
}

export async function cambiarEstado(id, estado) {
  const { data } = await api.patch(`/boletas/${id}/estado`, { estado });
  return adaptarBoleta(data);
}

export async function cancelarBoleta(id) {
  await api.delete(`/boletas/${id}`);
}
