import { useParams, Link } from 'react-router-dom';
import { obtenerUsuario } from '../../data/usuariosData';
import { ordenesPorUsuario } from '../../data/ordenesData';
import { formatearCLP } from '../../data/carritoData';
import { formatearFecha } from '../../utils/formatos';

export default function AdminHistorialCompras() {
  const { id: run } = useParams();
  const usuario = obtenerUsuario(run);
  const ordenes = ordenesPorUsuario(run);

  if (!usuario) {
    return (
      <div className="p-4">
        <h1 className="h3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary mt-3">Volver</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="h3 mb-1">Historial de compras</h1>
      <p className="text-muted mb-4">{usuario.nombre} {usuario.apellidos} · RUN {usuario.run}</p>

      {ordenes.length === 0 ? (
        <div className="alert alert-info">Este usuario aún no tiene compras registradas.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td><span className="badge bg-info text-dark">{o.estado}</span></td>
                  <td>{formatearCLP(o.total)}</td>
                  <td>
                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}