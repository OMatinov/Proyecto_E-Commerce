import { Link, NavLink, Outlet } from 'react-router-dom'

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
          {/* César: aquí va useAuth() para cambiar a "Cerrar sesión" */}
          <Link to="/login" className="action-link">Iniciar sesión</Link>
          <Link to="/registro" className="action-button">Registrarse</Link>
          {/* César: reemplazar el 0 por la cantidad del CarritoContext */}
          <Link to="/carrito" className="action-cart">🛒 Carrito (0)</Link>
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