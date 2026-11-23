// usuarios.js - Servicio de usuarios (ms-usuarios: /api/v1/usuarios).
// Autor: César
//
// Las rutas de administración exigen rol Administrador; /me y /me/clave sirven a cualquier usuario con sesión.
// Se exporta como objeto (default) para poder mockearlo en los tests.

import api from "./api.js";

const usuarios = {
  async listar() {
    const { data } = await api.get("/usuarios");
    return data;
  },

  async obtener(run) {
    const { data } = await api.get(`/usuarios/${run}`);
    return data;
  },

  async crear(datos) {
    const { data } = await api.post("/usuarios", datos);
    return data;
  },

  async actualizar(run, datos) {
    const { data } = await api.put(`/usuarios/${run}`, datos);
    return data;
  },

  // Borrado lógico: el backend deja al usuario con activo = false.
  async eliminar(run) {
    await api.delete(`/usuarios/${run}`);
  },

  async perfil() {
    const { data } = await api.get("/usuarios/me");
    return data;
  },

  async actualizarPerfil(datos) {
    const { data } = await api.put("/usuarios/me", datos);
    return data;
  },

  async cambiarClave({ claveActual, claveNueva }) {
    await api.put("/usuarios/me/clave", { claveActual, claveNueva });
  }
};

export default usuarios;
