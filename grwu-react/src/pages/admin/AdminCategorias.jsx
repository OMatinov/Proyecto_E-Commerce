import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarCategorias, eliminarCategoria } from '../../services/categorias';
import { normalizarImagen } from '../../components/ProductCard';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(() => {
    setCargando(true);
    setError('');
    return listarCategorias()
      .then((lista) => setCategorias(lista))
      .catch((fallo) => setError(fallo.mensaje))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const borrar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar categoría "${nombre}"?`)) return;
    try {
      await eliminarCategoria(id);
      await cargar();
    } catch (fallo) {
      // 409: la categoría tiene productos asociados.
      setError(fallo.mensaje);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {cargando ? (
        <p className="text-muted">Cargando categorías...</p>
      ) : (
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
              {categorias.length === 0 && (
                <tr><td colSpan="4" className="text-center text-muted py-4">No hay categorías.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
