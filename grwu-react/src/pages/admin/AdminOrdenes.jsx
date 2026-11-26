import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarBoletas } from "../../services/boletas.js";
import { normalizarError } from "../../services/adapters.js";

const ESTADOS = ["", "pagada", "rechazada", "enviada", "entregada", "cancelada"];

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [estado, setEstado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarOrdenes = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setOrdenes(await listarBoletas(estado ? { estado } : {}));
    } catch (err) {
      const { mensaje } = normalizarError(err);
      setError(`No se pudieron cargar las órdenes: ${mensaje}`);
    } finally {
      setCargando(false);
    }
  }, [estado]);

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const getBadgeClass = (estadoBoleta) => {
    switch (estadoBoleta) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Órdenes y Boletas</h1>
          <p className="text-muted mb-0">Historial de compras de los clientes</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select form-select-sm" aria-label="Filtrar por estado"
                  value={estado} onChange={(e) => setEstado(e.target.value)}>
            {ESTADOS.map((opcion) => (
              <option key={opcion} value={opcion}>{opcion || "Todos los estados"}</option>
            ))}
          </select>
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={cargarOrdenes}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {cargando && <div className="p-4">Cargando órdenes...</div>}
      {!cargando && error && <div className="p-4 text-danger">{error}</div>}
      {!cargando && !error && (
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
                  ordenes.map((orden) => (
                    <tr key={orden.id}>
                      <td className="fw-bold">{orden.id}</td>
                      <td>{orden.cliente ? `${orden.cliente.nombre} ${orden.cliente.apellidos}` : 'Cliente sin nombre'}</td>
                      <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
                      <td>${Number(orden.total || 0).toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(orden.estado)}`}>
                          {(orden.estado || '').toUpperCase()}
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
      )}
    </div>
  );
}
