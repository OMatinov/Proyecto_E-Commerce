
import React from 'react';

const AdminReportes = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Reportes</h1>
        <p className="text-muted mb-0">Resumen de rendimiento de la tienda</p>
      </div>

      <div className="row g-4">
        {/* Reporte de Ventas */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Ventas del Mes</h5>
            <h2 className="display-5 fw-bold mb-0" style={{ color: 'var(--color-primario)' }}>$1.450.000</h2>
            <p className="text-success small mb-4">↑ +15% en comparación al mes anterior</p>
            
            <div className="mb-2 d-flex justify-content-between small fw-bold">
              <span>Meta Mensual ($2.000.000)</span>
              <span>72%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: '72%', backgroundColor: 'var(--color-primario)' }}></div>
            </div>
          </div>
        </div>

        {/* Reporte de Productos */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Productos Más Vendidos</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                1. Polera Oversize Negra <span className="badge bg-dark rounded-pill">45 ventas</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                2. Jeans Wide Black <span className="badge bg-dark rounded-pill">32 ventas</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                3. Abrigo Classic Camel <span className="badge bg-dark rounded-pill">28 ventas</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Reporte de Tráfico (Mock) */}
        <div className="col-12">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Tráfico del Sitio</h5>
            <div className="row text-center">
              <div className="col-md-3 border-end">
                <h3 className="fw-bold">1,240</h3>
                <p className="text-muted small mb-0">Visitas Hoy</p>
              </div>
              <div className="col-md-3 border-end">
                <h3 className="fw-bold">85</h3>
                <p className="text-muted small mb-0">Nuevos Registros</p>
              </div>
              <div className="col-md-3 border-end">
                <h3 className="fw-bold">4.5%</h3>
                <p className="text-muted small mb-0">Tasa de Conversión</p>
              </div>
              <div className="col-md-3">
                <h3 className="fw-bold">12</h3>
                <p className="text-muted small mb-0">Mensajes Nuevos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportes;