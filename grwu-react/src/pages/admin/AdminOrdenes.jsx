import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // Ajusta la ruta si es necesario

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const respuesta = await api.get("/boletas");
        setOrdenes(respuesta.data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
        setError("No se pudieron cargar las órdenes. Revisa si el backend está levantado.");
      } finally {
        setCargando(false);
      }
    };
    cargarOrdenes();
  }, []);

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

  if (cargando) return <div className="p-4">Cargando órdenes...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

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
                    {/* En el DTO, el cliente viene como objeto */}
                    <td>{orden.cliente ? `${orden.cliente.nombre} ${orden.cliente.apellidos}` : 'Cliente sin nombre'}</td> 
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
}