// AdminHistorialCompras.jsx - Historial de compras de un usuario (/admin/usuarios/:id/historial).
// Columnas: Fecha, Monto, Comprador, Cantidad (unidades), Estado y Detalle (lleva a la boleta).

import { useParams, Link } from 'react-router-dom';
import { obtenerUsuario } from '../../data/usuariosData';
import { cantidadProductos, ordenesPorUsuario } from '../../data/ordenesData';
import { formatearCLP } from '../../data/carritoData';
import { formatearFecha } from '../../utils/formatos';

const CLASE_ESTADO = {
  pagada: 'bg-success',
  rechazada: 'bg-danger',
  enviada: 'bg-info text-dark',
  entregada: 'bg-primary',
  cancelada: 'bg-secondary'
};

// El comprador sale de la orden (datos del checkout); si falta, se usa el usuario del historial.
function nombreComprador(orden, usuario) {
  const c = orden.cliente;
  const nombre = c ? `${c.nombre || ''} ${c.apellidos || ''}`.trim() : '';
  return nombre || `${usuario.nombre} ${usuario.apellidos}`;
}

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
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Comprador</th>
                <th className="text-center">Cantidad</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td>{formatearCLP(o.total)}</td>
                  <td>{nombreComprador(o, usuario)}</td>
                  <td className="text-center">{cantidadProductos(o)}</td>
                  <td><span className={`badge ${CLASE_ESTADO[o.estado] || 'bg-warning text-dark'}`}>{o.estado}</span></td>
                  <td>
                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">
                      Ver detalle
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
