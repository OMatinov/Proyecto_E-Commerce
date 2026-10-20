import { Link } from 'react-router-dom';
import { listarProductosCriticos } from '../../data/productosData';
import { formatearCLP } from '../../data/carritoData';

export default function AdminProductosCriticos() {
  const criticos = listarProductosCriticos(5);

  return (
    <div className="p-4">
      <h1 className="h3 mb-3">Productos con stock crítico (≤ 5)</h1>
      {criticos.length === 0 ? (
        <div className="alert alert-success">Todo el inventario está por sobre el umbral.</div>
      ) : (
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