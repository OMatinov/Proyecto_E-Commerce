import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useCarrito } from '../context/CarritoContext'

const ENLACES = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/categorias', texto: 'Categorías' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blogs', texto: 'Blogs' },
  { to: '/contacto', texto: 'Contacto' },
]

export default function Layout() {
  const { usuario, haySesion, cerrarSesion } = useSesion()
  const { cantidad } = useCarrito()

  return (
      <>
        <header className="site-header">
          <Link to="/" className="site-header-brand">
            <img src="/img/logoGRWU.png" alt="Logo GRWU" className="site-logo" />
            <div>
              <h1 className="site-title">GRWU</h1>
              <p className="site-subtitle">GET READY WITH US</p>
            </div>
          </Link>

          <nav className="site-nav">
            {ENLACES.map(({ to, texto, end }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                >
                  {texto}
                </NavLink>
            ))}
          </nav>

          <div className="site-header-actions">
            {haySesion ? (
                <>
                  <span className="action-link">Hola, {usuario.nombre}</span>
                  <button onClick={cerrarSesion} className="action-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', padding: '0', textDecoration: 'underline' }}>
                    Cerrar sesión
                  </button>
                </>
            ) : (
                <>
                  <Link to="/login" className="action-link">Iniciar sesión</Link>
                  <Link to="/registro" className="action-button">Registrarse</Link>
                </>
            )}
            {/* ✅ AQUÍ ESTÁ EL CAMBIO CLAVE: data-testid="contador-carrito" */}
            <Link to="/carrito" className="action-cart" data-testid="contador-carrito">
              🛒 Carrito ({cantidad})
            </Link>
          </div>
        </header>

        <Outlet />

        <footer>
          <div className="footer-content">
            <div>© 2026 GRWU - Get Ready With Us. Todos los derechos reservados.</div>
            <div className="footer-links">
              <a href="#">Cómo comprar</a>
              <a href="#">Cambios y devoluciones</a>
              <a href="#">Tiempos y costos de despacho</a>
              <a href="#">Medios de pago</a>
            </div>
          </div>
        </footer>
      </>
  )
}