
import React from 'react';

const AdminOrdenes = () => {
  // Datos de prueba (reemplazar con import de '../../data/ordenes' cuando esté listo)
  const ordenesMock = [
    { id: '#ORD-001', cliente: 'Camila Olmedo', fecha: '2026-08-30', total: 35970, estado: 'Pagado' },
    { id: '#ORD-002', cliente: 'Carlos Rojas', fecha: '2026-08-29', total: 21990, estado: 'Pendiente' },
    { id: '#ORD-003', cliente: 'Valentina B.', fecha: '2026-08-28', total: 12990, estado: 'Pagado' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Órdenes y Boletas</h1>
        <p className="text-muted mb-0">Historial de compras de los clientes</p>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ordenesMock.map(orden => (
                <tr key={orden.id}>
                  <td className="fw-bold">{orden.id}</td>
                  <td>{orden.cliente}</td>
                  <td>{orden.fecha}</td>
                  <td>${orden.total.toLocaleString('es-CL')}</td>
                  <td>
                    <span className={`badge ${orden.estado === 'Pagado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-dark">Ver Boleta 📄</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdenes;
