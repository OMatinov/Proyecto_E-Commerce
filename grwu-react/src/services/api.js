import axios from 'axios';
import { getAccessToken, getRefreshToken, guardarTokens, limpiarTokens } from './tokenStore';

// Instancia única de Axios
const api = axios.create({
  baseURL: '/api/v1', // El proxy de Vite se encarga de redirigir esto
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE PETICIONES (Request)
// El access token vive en memoria (tokenStore), NO en localStorage.
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh compartido: si varias peticiones fallan con 401 a la vez, se hace un solo refresh.
let refrescando = null;

<<<<<<< HEAD
export function refrescarTokens() {
=======
function refrescarTokens() {
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc
  if (!refrescando) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.reject(new Error('Sin refresh token'));
    // axios "pelado" (no "api") para que este llamado no pase por los interceptores y no haya loop
    refrescando = axios
      .post('/api/v1/auth/refresh', { refreshToken })
      .then((res) => {
        guardarTokens(res.data);
        return res.data.accessToken;
      })
      .finally(() => {
        refrescando = null;
      });
  }
  return refrescando;
}

// INTERCEPTOR DE RESPUESTAS (Response)
// En 401: un solo refresh y reintento. Si falla, se cierra la sesión y se va a /login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const esAuth = original?.url?.includes('/auth/');

    if (status === 401 && original && !original._reintentado && !esAuth) {
      original._reintentado = true;
      try {
        const nuevoAccess = await refrescarTokens();
        original.headers.Authorization = `Bearer ${nuevoAccess}`;
        return api(original);
      } catch {
        limpiarTokens();
        if (window.location.pathname !== '/login') window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> 2daae4278814af8fc303cf0d34463c77d8af70dc
