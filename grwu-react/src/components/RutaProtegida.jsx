import { Navigate, Outlet } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';

export default function RutaProtegida() {
  const { haySesion, cargandoSesion } = useSesion();

  if (cargandoSesion) {
    return <div className="container py-5 text-center">Cargando sesión...</div>;
  }

  if (!haySesion) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}