import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { SesionProvider } from './context/SesionContext.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'

// Los providers dan a toda la app acceso a la sesión (useSesion) y al carrito (useCarrito).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)
