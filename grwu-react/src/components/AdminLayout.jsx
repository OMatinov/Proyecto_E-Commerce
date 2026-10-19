import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import '../styles/admin.css'

const ENLACES = [
  { to: '/admin', texto: '📊 Dashboard', end: true },
  { to: '/admin/ordenes', texto: '🧾 Órdenes' },
  { to: '/admin/productos', texto: '👕 Productos' },
  { to: '/admin/categorias', texto: '🏷️ Categorías' },
  { to: '/admin/usuarios', texto: '👤 Usuarios' },
  { to: '/admin/reportes', texto: '📈 Reportes' },
  { to: '/admin/blogs', texto: '📝 Blogs' },
  { to: '/admin/contactos', texto: ' Contactos' },
  { to: '/admin/perfil', texto: '⚙️ Perfil' },
]

export default function AdminLayout() {
  const { usuario, cerrarSesion } = useSesion()
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

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
            <button onClick={handleCerrarSesion} className="sidebar-footer-link" style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              color: 'inherit',
              padding: '0',
              textDecoration: 'underline'
            }}>
              Cerrar sesión ({usuario?.nombre || 'Admin'})
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
  )
}