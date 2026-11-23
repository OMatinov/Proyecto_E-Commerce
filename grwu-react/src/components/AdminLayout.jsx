import { useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import '../styles/admin.css'

// El Vendedor solo ve Órdenes y Productos (matriz de acceso, sección 8 de AGENTS.md).
const ENLACES = [
  { to: '/admin', texto: '📊 Dashboard', end: true, soloAdmin: true },
  { to: '/admin/ordenes', texto: '🧾 Órdenes' },
  { to: '/admin/productos', texto: '👕 Productos' },
  { to: '/admin/categorias', texto: '🏷️ Categorías', soloAdmin: true },
  { to: '/admin/usuarios', texto: '👤 Usuarios', soloAdmin: true },
  { to: '/admin/reportes', texto: '📈 Reportes', soloAdmin: true },
  { to: '/admin/blogs', texto: '📝 Blogs', soloAdmin: true },
  { to: '/admin/contactos', texto: ' Contactos', soloAdmin: true },
  { to: '/admin/perfil', texto: '⚙️ Perfil', soloAdmin: true },
]

export default function AdminLayout() {
  const { usuario, cerrarSesion } = useSesion()
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  const esAdmin = usuario?.tipoUsuario === 'Administrador'
  const enlacesVisibles = ENLACES.filter(({ soloAdmin }) => !soloAdmin || esAdmin)

  // Si el backend responde 403, llevamos al usuario a su vista permitida en vez de mostrar el error crudo.
  useEffect(() => {
    const alNoTenerPermisos = () => {
      navigate(usuario?.tipoUsuario === 'Vendedor' ? '/admin/productos' : '/', { replace: true })
    }
    window.addEventListener('grwu:sin-permisos', alNoTenerPermisos)
    return () => window.removeEventListener('grwu:sin-permisos', alNoTenerPermisos)
  }, [navigate, usuario?.tipoUsuario])

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
            {enlacesVisibles.map(({ to, texto, end }) => (
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