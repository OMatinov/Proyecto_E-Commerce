const CLAVE_REFRESH = "GRWU_RefreshToken";

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(CLAVE_REFRESH);
  } catch {
    return null;
  }
}

export function setRefreshToken(token) {
  try {
    if (token) localStorage.setItem(CLAVE_REFRESH, token);
    else localStorage.removeItem(CLAVE_REFRESH);
  } catch {
    /* localStorage no disponible: la sesión no sobrevivirá a la recarga */
  }
}

export function guardarTokens({ accessToken: access, refreshToken: refresh }) {
  setAccessToken(access);
  setRefreshToken(refresh);
}

export function limpiarTokens() {
  accessToken = null;
  setRefreshToken(null);
}