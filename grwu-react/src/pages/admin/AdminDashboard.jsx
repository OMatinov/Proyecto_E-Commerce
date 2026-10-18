
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../data/Blogs';
import { getContactos } from '../../data/Contactos';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    contactos: 0,
    noLeidos: 0
  });

  useEffect(() => {
    const blogs = getBlogs();
    const contactos = getContactos();
    
    setStats({
      blogs: blogs.length,
      contactos: contactos.length,
      noLeidos: contactos.filter(c => !c.leido).length
    });
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

      {/* Tarjetas de Estadísticas */}
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
