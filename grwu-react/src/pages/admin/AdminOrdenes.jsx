import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarOrdenes } from '../../data/ordenesData';

const AdminOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    // Cargamos las órdenes desde la base de datos de César
    setOrdenes(listarOrdenes());
  }, []);

  // Función auxiliar para pintar el color del badge según el estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'pagada': return 'bg-success';
      case 'rechazada': return 'bg-danger';
      case 'enviada': return 'bg-info text-dark';
      case 'entregada': return 'bg-primary';
      case 'cancelada': return 'bg-secondary';
      default: return 'bg-warning text-dark';
    }
  };

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
              {ordenes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No hay órdenes registradas aún.</td>
                </tr>
              ) : (
                ordenes.map(orden => (
                  <tr key={orden.id}>
                    <td className="fw-bold">{orden.id}</td>
                    {/* César guarda el nombre dentro de cliente.nombre */}
                    <td>{orden.cliente?.nombre || 'Cliente sin nombre'}</td> 
                    <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                    <td>${orden.total?.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(orden.estado)}`}>
                        {orden.estado.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/ordenes/${orden.id}`} className="btn btn-sm btn-outline-dark">
                        Ver Boleta 📄
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdenes;