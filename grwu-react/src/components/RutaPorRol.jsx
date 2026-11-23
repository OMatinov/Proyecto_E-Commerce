import { Navigate, Outlet } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';

export default function RutaPorRol({ rolesPermitidos }) {
  const { usuario, haySesion, cargandoSesion } = useSesion();

  if (cargandoSesion) {
    return <div className="container py-5 text-center">Cargando sesión...</div>;
  }

  if (!haySesion) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está en la lista de permitidos, lo mandamos a la tienda
  if (!rolesPermitidos.includes(usuario.tipoUsuario)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
}