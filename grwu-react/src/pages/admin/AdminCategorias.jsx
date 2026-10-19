// AdminCategorias.jsx - Listado de categorías con acciones CRUD.
// Autor: Matías

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eliminarCategoria, listarCategorias, productosPorCategoria } from "../../data/productosData.js";

export default function AdminCategorias() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const categorias = useMemo(() => listarCategorias(), [version]);

  const manejarEliminar = (c) => {
    const cantidad = productosPorCategoria(c.id).length;
    if (cantidad > 0) {
      window.alert(`No se puede eliminar "${c.nombre}": tiene ${cantidad} producto(s) asignados.`);
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    eliminarCategoria(c.id);
    setVersion((v) => v + 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Categorías</h1>
          <p className="text-muted mb-0">{categorias.length} categorías registradas</p>
        </div>
        <Link to="/admin/categorias/nueva" className="btn btn-dark">+ Nueva categoría</Link>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr><th>Nombre</th><th>Slug (URL)</th><th className="text-center">Productos</th><th className="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => {
                const cantidad = productosPorCategoria(c.id).length;
                return (
                  <tr key={c.id}>
                    <td className="fw-semibold">{c.nombre}</td>
                    <td><code>/categorias/{c.slug}</code></td>
                    <td className="text-center">
                      <span className={`badge ${cantidad === 0 ? "bg-secondary" : "bg-info text-dark"}`}>{cantidad}</span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-outline-dark" onClick={() => navigate(`/admin/categorias/${c.id}/editar`)}>Editar ✏️</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => manejarEliminar(c)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
