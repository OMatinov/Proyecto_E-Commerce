import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'

// Tienda
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Categoria from './pages/Categoria'
import Ofertas from './pages/Ofertas'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Registro from './pages/Registro'
import Login from './pages/Login'
import RecuperarClave from './pages/RecuperarClave'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import BlogDetalle from './pages/BlogDetalle'
import Contacto from './pages/Contacto'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrdenes from './pages/admin/AdminOrdenes'
import AdminBoleta from './pages/admin/AdminBoleta'
import AdminProductos from './pages/admin/AdminProductos'
import AdminProductoNuevo from './pages/admin/AdminProductoNuevo'
import AdminProductoEditar from './pages/admin/AdminProductoEditar'
import AdminProductosCriticos from './pages/admin/AdminProductosCriticos'
import AdminCategorias from './pages/admin/AdminCategorias'
import AdminCategoriaNueva from './pages/admin/AdminCategoriaNueva'
import AdminCategoriaEditar from './pages/admin/AdminCategoriaEditar'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminUsuarioNuevo from './pages/admin/AdminUsuarioNuevo'
import AdminUsuarioEditar from './pages/admin/AdminUsuarioEditar'
import AdminHistorialCompras from './pages/admin/AdminHistorialCompras'
import AdminReportes from './pages/admin/AdminReportes'
import AdminPerfil from './pages/admin/AdminPerfil'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminContactos from './pages/admin/AdminContactos'

export default function App() {
  return (
    <Routes>
      {/* Tienda (pública) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:slug" element={<Categoria />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto/:id" element={<PagoCorrecto />} />
        <Route path="/pago-error/:id" element={<PagoError />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-clave" element={<RecuperarClave />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<h1 className="container py-5">Página no encontrada</h1>} />
      </Route>

      {/* Administrador */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ordenes" element={<AdminOrdenes />} />
        <Route path="ordenes/:id" element={<AdminBoleta />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<AdminProductoNuevo />} />
        <Route path="productos/:id/editar" element={<AdminProductoEditar />} />
        <Route path="productos/criticos" element={<AdminProductosCriticos />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="categorias/nueva" element={<AdminCategoriaNueva />} />
        <Route path="categorias/:id/editar" element={<AdminCategoriaEditar />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="usuarios/nuevo" element={<AdminUsuarioNuevo />} />
        <Route path="usuarios/:id/editar" element={<AdminUsuarioEditar />} />
        <Route path="usuarios/:id/historial" element={<AdminHistorialCompras />} />
        <Route path="reportes" element={<AdminReportes />} />
        <Route path="perfil" element={<AdminPerfil />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="contactos" element={<AdminContactos />} />
      </Route>
    </Routes>
  )
}
