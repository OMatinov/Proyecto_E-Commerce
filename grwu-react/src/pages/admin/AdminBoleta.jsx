import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerOrden } from '../../data/ordenesData';

const AdminBoleta = () => {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    // Buscamos la orden real usando la función de César
    const found = obtenerOrden(id);
    setOrden(found);
  }, [id]);

  if (!orden) {
    return (
      <div className="text-center py-5">
        <h2 className="fw-bold">Orden no encontrada</h2>
        <Link to="/admin/ordenes" className="btn btn-primary mt-3">Volver a Órdenes</Link>
      </div>
    );
  }

  // Función para color del badge
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'pagada': return 'bg-success';
      case 'rechazada': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/admin/ordenes" className="text-decoration-none text-muted small mb-1 d-block">← Volver a Órdenes</Link>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Boleta {orden.id}
          </h1>
        </div>
        <button className="btn btn-outline-dark rounded-pill" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>
      </div>

      <div className="row g-4">
        {/* Boleta Principal */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              
              {/* Header Boleta */}
              <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                <div>
                  <h4 className="fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--color-primario)' }}>GRWU</h4>
                  <p className="text-muted small mb-0">Get Ready With Us</p>
                </div>
                <div className="text-end">
                  <p className="mb-0 fw-bold">Boleta Electrónica</p>
                  <p className="text-muted small mb-0">N° {orden.numero || orden.id}</p>
                </div>
              </div>

              {/* Info Cliente y Envío */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-muted text-uppercase small">Datos del Cliente</h6>
                  <p className="mb-1 fw-bold">{orden.cliente?.nombre || 'Cliente'}</p>
                  <p className="mb-1 small">{orden.cliente?.email || 'Sin correo'}</p>
                  <p className="mb-0 small">{orden.cliente?.telefono || 'Sin teléfono'}</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <h6 className="fw-bold text-muted text-uppercase small">Información de Envío</h6>
                  <p className="mb-1 small">{typeof orden.direccion === 'object' ? `${orden.direccion.calle || ''} ${orden.direccion.comuna || ''}` : orden.direccion || 'Sin dirección'}</p>
                  <p className="mb-0 small"><strong>Método de pago:</strong> {orden.metodoPago || 'No especificado'}</p>
                </div>
              </div>

              {/* Tabla de Productos (César los llama 'items') */}
              <div className="table-responsive mb-3">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.items?.map((prod, index) => (
                      <tr key={index}>
                        <td>{prod.nombre}</td>
                        <td className="text-center">{prod.cantidad}</td>
                        <td className="text-end">${prod.precio?.toLocaleString('es-CL')}</td>
                        <td className="text-end">${(prod.precio * prod.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales (César ya los calcula y los guarda en la orden) */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Subtotal</span>
                  <span>${orden.subtotal?.toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Envío</span>
                  <span>${orden.envio?.toLocaleString('es-CL')}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-2 pt-2 border-top">
                  <span>Total Pagado</span>
                  <span style={{ color: 'var(--color-primario)' }}>${orden.total?.toLocaleString('es-CL')}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted text-uppercase small mb-3">Estado de la Orden</h6>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className={`badge fs-6 ${getBadgeClass(orden.estado)}`}>
                  {orden.estado.toUpperCase()}
                </span>
              </div>
              <p className="small text-muted mb-0">Fecha: {new Date(orden.fecha).toLocaleString('es-CL')}</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted text-uppercase small mb-3">Acciones</h6>
              <button className="btn btn-primary w-100 mb-2" style={{ backgroundColor: 'var(--color-primario)', borderColor: 'var(--color-primario)' }}>
                📧 Enviar por correo
              </button>
              <button className="btn btn-outline-dark w-100">
                🖨️ Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoleta;