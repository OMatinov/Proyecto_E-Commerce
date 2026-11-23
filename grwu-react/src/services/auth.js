// auth.js - Servicio de autenticación (ms-usuarios: /api/v1/auth).
// Autor: César
//
// Se exporta como objeto (default) para poder mockearlo en los tests con spyOn(auth, "login").
// El access token queda en memoria y el refresh token en localStorage (ver tokenStore.js).

import api, { refrescarTokens } from "./api.js";
import { getRefreshToken, guardarTokens, limpiarTokens } from "./tokenStore.js";

const auth = {
  // Devuelve el usuario que entrega el backend y deja los tokens guardados.
  async login(correo, clave) {
    const { data } = await api.post("/auth/login", { correo: (correo || "").trim(), clave });
    guardarTokens(data);
    return data.usuario;
  },

  // El backend fuerza el rol Cliente en el registro público.
  async registro(datos) {
    const { data } = await api.post("/auth/registro", datos);
    return data;
  },

  // Al recargar la página: el access token se perdió, así que se pide uno nuevo con el refresh token
  // y luego se reconstruye el usuario con /usuarios/me. Devuelve null si no hay sesión guardada.
  async restaurar() {
    if (!getRefreshToken()) return null;
    await refrescarTokens();
    const { data } = await api.get("/usuarios/me");
    return data;
  },

  // Invalida el refresh token en el servidor (si se puede) y siempre limpia los tokens locales.
  async logout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken });
    } catch {
      /* la sesión ya estaba vencida: da igual */
    } finally {
      limpiarTokens();
    }
  }
};

export default auth;
