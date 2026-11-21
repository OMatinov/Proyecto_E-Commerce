import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige las llamadas al microservicio de usuarios (César)
      '/api/v1/auth': 'http://localhost:8081',
      '/api/v1/usuarios': 'http://localhost:8081',
      // Redirige las llamadas al microservicio de catálogo (Matías)
      '/api/v1/productos': 'http://localhost:8082',
      '/api/v1/categorias': 'http://localhost:8082',
      // Redirige las llamadas a TU microservicio de boletas
      '/api/v1/boletas': 'http://localhost:8083',
    }
  }
})