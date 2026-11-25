import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProductosCriticos } from '../../services/productos';
import { formatearCLP } from '../../data/carritoData';

export default function AdminProductosCriticos() {
  const [criticos, setCriticos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;

    listarProductosCriticos(5)
      .then((lista) => {
        if (vigente) setCriticos(lista);
      })
      .catch((fallo) => {
        if (vigente) setError(fallo.mensaje);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="h3 mb-3">Productos con stock crítico (= 5)</h1>

      {cargando && <p className="text-muted">Cargando productos...</p>}

      {!cargando && error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!cargando && !error && criticos.length === 0 && (
        <div className="alert alert-success">Todo el inventario está por sobre el umbral.</div>
      )}

      {!cargando && !error && criticos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-warning">
              <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{formatearCLP(p.precio)}</td>
                  <td><span className="badge bg-danger">{p.stock}</span></td>
                  <td>
                    <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-primary">
                      Reabastecer
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
