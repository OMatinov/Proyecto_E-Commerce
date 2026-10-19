import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar describe, it, expect sin importarlos
    environment: 'jsdom', // Simula el navegador (ya incluye window, document, localStorage)
    // setupFiles: ['./spec/helpers/setup.js'], // <-- COMENTADO o ELIMINADO para evitar el error
  },
})