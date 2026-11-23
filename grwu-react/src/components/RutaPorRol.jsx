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

  // Rol insuficiente: redirección a la vista permitida, nunca un 403 crudo.
  if (!rolesPermitidos.includes(usuario.tipoUsuario)) {
    const destino = usuario.tipoUsuario === 'Vendedor' ? '/admin/productos' : '/';
    return <Navigate to={destino} replace />;
  }

  return <Outlet />;
}