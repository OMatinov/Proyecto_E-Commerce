// boletas.js - Servicio de boletas (ms-boletas: /api/v1/boletas).
// Se exporta como objeto (default) para poder mockearlo en los tests.

import api from "./api.js";

const boletas = {
  async crear(solicitud) {
    const { data } = await api.post("/boletas", solicitud);
    return data;
  },

  async listar() {
    const { data } = await api.get("/boletas");
    return data;
  },

  // Historial de un usuario (vista admin): GET /boletas?usuarioRun={run}
  async porUsuario(run) {
    const { data } = await api.get("/boletas", { params: { usuarioRun: run } });
    return data;
  },

  async mias() {
    const { data } = await api.get("/boletas/mias");
    return data;
  },

  async obtener(id) {
    const { data } = await api.get(`/boletas/${id}`);
    return data;
  },

  async reintentarPago(id) {
    const { data } = await api.post(`/boletas/${id}/reintentar-pago`);
    return data;
  }
};

export default boletas;
