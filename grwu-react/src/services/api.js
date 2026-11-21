import axios from 'axios';

// Creamos una instancia única de Axios
const api = axios.create({
  baseURL: '/api/v1', // El proxy de Vite se encarga de redirigir esto
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE PETICIONES (Request)
api.interceptors.request.use(
  (config) => {
    // Buscamos el token en el localStorage (lo guardaremos ahí cuando César haga el login)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPUESTAS (Response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend dice 401 (No autorizado) o 403 (Prohibido), podríamos cerrar sesión
    if (error.response && error.response.status === 401) {
      console.warn("Sesión expirada o no autorizada");
      // Aquí podrías redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;