// DemoNavbar.jsx - Barra de navegación mínima para recorrer la demo.
// TEMPORAL: la reemplaza el navbar de Katerine (components/Navbar).
// Lo importante: muestra cómo se usan los dos contextos.
//   useSesion()   -> usuario, haySesion, esAdmin, cerrarSesion
//   useCarrito()  -> cantidad (el numerito del carrito)

import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";

export default function DemoNavbar() {
  const { usuario, haySesion, cerrarSesion } = useSesion();
  const { cantidad } = useCarrito();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark px-3">
      <Link to="/" className="navbar-brand fw-bold">GRWU</Link>
      <div className="ms-auto d-flex align-items-center gap-2">
        <Link to="/carrito" className="btn btn-outline-light btn-sm">
          🛒 Carrito <span className="badge text-bg-light" data-testid="contador-carrito">{cantidad}</span>
        </Link>
        {haySesion ? (
          <>
            <span className="navbar-text text-white">Hola, {usuario.nombre}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={salir}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-light btn-sm">Iniciar sesión</Link>
            <Link to="/registro" className="btn btn-primary btn-sm">Crear cuenta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
