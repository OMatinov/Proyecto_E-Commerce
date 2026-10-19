import React, { useState, useEffect } from 'react';
import { listarOrdenes } from '../../data/ordenesData';

const AdminReportes = () => {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalOrdenes: 0,
    masVendidos: []
  });

  useEffect(() => {
    const ordenes = listarOrdenes();
    
    // Filtramos solo las órdenes que representan una venta real
    const ordenesValidas = ordenes.filter(o => o.estado === 'pagada' || o.estado === 'entregada');

    let ventas = 0;
    const conteoProductos = {};

    ordenesValidas.forEach(orden => {
      ventas += Number(orden.total) || 0;

      if (orden.items && Array.isArray(orden.items)) {
        orden.items.forEach(item => {
          const nombre = item.nombre;
          const cantidad = Number(item.cantidad) || 1;
          conteoProductos[nombre] = (conteoProductos[nombre] || 0) + cantidad;
        });
      }
    });

    // Ordenar productos de mayor a menor venta y sacar el Top 3
    const masVendidos = Object.keys(conteoProductos)
      .map(nombre => ({ nombre, cantidad: conteoProductos[nombre] }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);

    setStats({
      totalVentas: ventas,
      totalOrdenes: ordenesValidas.length,
      masVendidos
    });
  }, []);

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
            <h5 className="fw-bold mb-3">Ventas Reales</h5>
            <h2 className="display-5 fw-bold mb-0" style={{ color: 'var(--color-primario)' }}>
              ${stats.totalVentas.toLocaleString('es-CL')}
            </h2>
            <p className="text-muted small mb-4">Basado en {stats.totalOrdenes} órdenes pagadas/entregadas</p>
            
            <div className="mb-2 d-flex justify-content-between small fw-bold">
              <span>Meta Mensual ($2.000.000)</span>
              <span>{Math.min(Math.round((stats.totalVentas / 2000000) * 100), 100)}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${Math.min((stats.totalVentas / 2000000) * 100, 100)}%`, backgroundColor: 'var(--color-primario)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Reporte de Productos */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Top 3 Productos Más Vendidos</h5>
            {stats.masVendidos.length === 0 ? (
              <p className="text-muted small mt-3">Aún no hay ventas registradas.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {stats.masVendidos.map((prod, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    {index + 1}. {prod.nombre} 
                    <span className="badge bg-dark rounded-pill">{prod.cantidad} unidades</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportes;