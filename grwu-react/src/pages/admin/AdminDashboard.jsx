
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../data/Blogs';
import { getContactos } from '../../data/Contactos';
import { listarBoletas } from '../../services/boletas.js';
import { normalizarError } from '../../services/adapters.js';
import { totalVentas } from '../../utils/reportes.js';
import { formatearCLP } from '../../data/carritoData.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    contactos: 0,
    noLeidos: 0
  });
  const [boletas, setBoletas] = useState(null);
  const [errorBoletas, setErrorBoletas] = useState('');

  useEffect(() => {
    const blogs = getBlogs();
    const contactos = getContactos();

    setStats({
      blogs: blogs.length,
      contactos: contactos.length,
      noLeidos: contactos.filter(c => !c.leido).length
    });
  }, []);

  // Las boletas viven en MySQL y se leen por API; nada de localStorage.
  useEffect(() => {
    let activo = true;
    listarBoletas()
      .then((datos) => { if (activo) setBoletas(datos); })
      .catch((err) => { if (activo) setErrorBoletas(normalizarError(err).mensaje); });
    return () => { activo = false; };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Dashboard</h1>
          <p className="text-muted mb-0">Bienvenida, Katerine 👋</p>
        </div>
        <div className="badge bg-white text-dark border px-3 py-2 shadow-sm">
          🕐 {new Date().toLocaleDateString('es-CL')}
        </div>
      </div>

      {/* Ventas reales desde ms-boletas */}
      {errorBoletas && (
        <div className="alert alert-warning small">No se pudieron cargar las ventas: {errorBoletas}</div>
      )}
      {!errorBoletas && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid var(--color-primary, #4B1D5A)' }}>
              <p className="text-uppercase text-muted small fw-bold mb-1">Ventas registradas</p>
              <h2 className="display-6 fw-bold mb-0" style={{ color: 'var(--color-primario)' }}>
                {boletas ? formatearCLP(totalVentas(boletas)) : '...'}
              </h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid #198754' }}>
              <p className="text-uppercase text-muted small fw-bold mb-1">Órdenes concretadas</p>
              <h2 className="display-6 fw-bold mb-0 text-success">
                {boletas ? boletas.filter(b => ['pagada', 'enviada', 'entregada'].includes(b.estado)).length : '...'}
              </h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid #dc3545' }}>
              <p className="text-uppercase text-muted small fw-bold mb-1">Boletas rechazadas</p>
              <h2 className="display-6 fw-bold mb-0 text-danger">
                {boletas ? boletas.filter(b => b.estado === 'rechazada').length : '...'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de Estadísticas (contenido local: blogs y contactos) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid var(--color-primario)' }}>
            <p className="text-uppercase text-muted small fw-bold mb-1">Artículos del Blog</p>
            <h2 className="display-6 fw-bold mb-0" style={{ color: 'var(--color-primario)' }}>{stats.blogs}</h2>
            <Link to="/admin/blogs" className="text-decoration-none small mt-2 d-inline-block">Gestionar blogs →</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid var(--color-texto)' }}>
            <p className="text-uppercase text-muted small fw-bold mb-1">Mensajes Totales</p>
            <h2 className="display-6 fw-bold mb-0">{stats.contactos}</h2>
            <Link to="/admin/contactos" className="text-decoration-none small mt-2 d-inline-block">Ver mensajes →</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: '4px solid #dc3545' }}>
            <p className="text-uppercase text-muted small fw-bold mb-1">Mensajes sin leer</p>
            <h2 className="display-6 fw-bold mb-0 text-danger">{stats.noLeidos}</h2>
            <Link to="/admin/contactos" className="text-decoration-none small mt-2 d-inline-block">Revisar ahora →</Link>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h4 className="fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Accesos Rápidos</h4>
      <div className="row g-3">
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/blogs?action=nuevo" className="text-decoration-none">
            <div className="card border-0 shadow-sm text-center py-4 h-100 hover-elevate">
              <div className="fs-1 mb-2">✍️</div>
              <h6 className="fw-bold text-dark mb-0">Nuevo Artículo</h6>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/ordenes" className="text-decoration-none">
            <div className="card border-0 shadow-sm text-center py-4 h-100 hover-elevate">
              <div className="fs-1 mb-2">📦</div>
              <h6 className="fw-bold text-dark mb-0">Ver Órdenes</h6>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/reportes" className="text-decoration-none">
            <div className="card border-0 shadow-sm text-center py-4 h-100 hover-elevate">
              <div className="fs-1 mb-2">📊</div>
              <h6 className="fw-bold text-dark mb-0">Reportes</h6>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/contactos" className="text-decoration-none">
            <div className="card border-0 shadow-sm text-center py-4 h-100 hover-elevate">
              <div className="fs-1 mb-2">💬</div>
              <h6 className="fw-bold text-dark mb-0">Bandeja de Entrada</h6>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
