import { Link } from 'react-router-dom';
import { useState } from 'react';
import { listarProductos, eliminarProducto } from '../../data/productosData';
import { formatearCLP } from '../../data/carritoData';
import { normalizarImagen } from '../../components/ProductCard';

export default function AdminProductos() {
  const [productos, setProductos] = useState(listarProductos());

  const borrar = (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    eliminarProducto(id);
    setProductos(listarProductos());
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Imagen</th><th>Nombre</th><th>Categoría</th>
              <th>Precio</th><th>Stock</th><th>Oferta</th><th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={normalizarImagen(p.imagen) || '/img/logoGRWU.png'} alt={p.nombre} width="48" height="48"
                       style={{ objectFit: 'cover' }}
                       onError={(e) => { e.currentTarget.src = '/img/logoGRWU.png'; }} />
                </td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatearCLP(p.precio)}</td>
                <td>
                  <span className={`badge ${p.stock <= 5 ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {p.stock}
                  </span>
                </td>
                <td>{p.oferta ? `${p.oferta}%` : '—'}</td>
                <td className="text-end">
                  <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(p.id, p.nombre)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted py-4">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}