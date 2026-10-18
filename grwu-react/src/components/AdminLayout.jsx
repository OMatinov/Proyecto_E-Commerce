import { Link, NavLink, Outlet } from 'react-router-dom'
import '../styles/admin.css'

const ENLACES = [
  { to: '/admin', texto: '📊 Dashboard', end: true },
  { to: '/admin/ordenes', texto: '🧾 Órdenes' },
  { to: '/admin/productos', texto: '👕 Productos' },
  { to: '/admin/categorias', texto: '🏷️ Categorías' },
  { to: '/admin/usuarios', texto: '👤 Usuarios' },
  { to: '/admin/reportes', texto: '📈 Reportes' },
  { to: '/admin/blogs', texto: '📝 Blogs' },
  { to: '/admin/contactos', texto: '💬 Contactos' },
  { to: '/admin/perfil', texto: '⚙️ Perfil' },
]

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/img/logoGRWU.png" alt="GRWU" className="sidebar-logo" />
          <div>
            <h1 className="sidebar-title">GRWU</h1>
            <p className="sidebar-subtitle">PANEL ADMIN</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {ENLACES.map(({ to, texto, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' sidebar-link-active' : '')}
            >
              {texto}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-footer-link">← Volver a la tienda</Link>
          <Link to="/login" className="sidebar-footer-link">🚪 Cerrar sesión</Link>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}