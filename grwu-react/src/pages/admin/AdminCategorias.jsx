import { Link } from 'react-router-dom';
import { useState } from 'react';
import { listarCategorias, eliminarCategoria } from '../../data/categoriasData';
import { normalizarImagen } from '../../components/ProductCard';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState(listarCategorias());

  const borrar = (id, nombre) => {
    if (!window.confirm(`¿Eliminar categoría "${nombre}"?`)) return;
    eliminarCategoria(id);
    setCategorias(listarCategorias());
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Imagen</th><th>Nombre</th><th>Slug</th><th></th></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>
                  <img src={normalizarImagen(c.imagen) || '/img/logoGRWU.png'} alt={c.nombre} width="48" height="48"
                       style={{ objectFit: 'cover' }}
                       onError={(e) => { e.currentTarget.src = '/img/logoGRWU.png'; }} />
                </td>
                <td>{c.nombre}</td>
                <td><code>{c.slug}</code></td>
                <td className="text-end">
                  <Link to={`/admin/categorias/${c.id}/editar`}
                        className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-outline-danger"
                          onClick={() => borrar(c.id, c.nombre)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}