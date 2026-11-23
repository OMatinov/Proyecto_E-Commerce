// AdminHistorialCompras.jsx - Historial de compras de un usuario (/admin/usuarios/:id/historial).
// Datos reales: el usuario viene de ms-usuarios y sus boletas de ms-boletas (GET /boletas?usuarioRun={run}).
// Columnas: Fecha, Monto, Comprador, Cantidad (unidades), Estado y Detalle (lleva a la boleta).

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import boletasService from '../../services/boletas';
import usuariosService from '../../services/usuarios';
import { normalizarError } from '../../services/errores';
import { formatearCLP } from '../../data/carritoData';
import { formatearFecha } from '../../utils/formatos';

const CLASE_ESTADO = {
  pagada: 'bg-success',
  rechazada: 'bg-danger',
  enviada: 'bg-info text-dark',
  entregada: 'bg-primary',
  cancelada: 'bg-secondary'
};

// El comprador sale de la boleta (datos del checkout); si falta, se usa el usuario del historial.
function nombreComprador(boleta, usuario) {
  const c = boleta.cliente;
  const nombre = c ? `${c.nombre || ''} ${c.apellidos || ''}`.trim() : '';
  return nombre || `${usuario.nombre} ${usuario.apellidos}`;
}

const unidades = (boleta) => (boleta.items || []).reduce((suma, i) => suma + (i.cantidad ?? 0), 0);

export default function AdminHistorialCompras() {
  const { id: run } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    let vigente = true;
    Promise.all([usuariosService.obtener(run), boletasService.porUsuario(run)])
      .then(([u, b]) => { if (vigente) { setUsuario(u); setBoletas(b); } })
      .catch((e) => {
        if (!vigente) return;
        const n = normalizarError(e);
        if (n.status === 404) setNoEncontrado(true);
        else setError(n.mensaje);
      })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [run]);

  if (cargando) return <div className="p-4">Cargando historial...</div>;

  if (error) return <div className="p-4"><div className="alert alert-danger" role="alert">{error}</div></div>;

  if (noEncontrado || !usuario) {
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

      {boletas.length === 0 ? (
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
              {boletas.map((o) => (
                <tr key={o.id}>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td>{formatearCLP(o.total)}</td>
                  <td>{nombreComprador(o, usuario)}</td>
                  <td className="text-center">{unidades(o)}</td>
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
