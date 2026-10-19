// AdminProductos.jsx - Listado de productos con búsqueda y acciones CRUD.
// Autor: Matías

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eliminarProducto, listarCategorias, listarProductos } from "../../data/productosData.js";
import { formatearCLP } from "../../data/carritoData.js";

export default function AdminProductos() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0); // fuerza recarga tras eliminar
  const productos = useMemo(() => listarProductos(), [version]);
  const categorias = useMemo(() => listarCategorias(), []);
  const [busqueda, setBusqueda] = useState("");

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
  const filtrados = productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()));

  const manejarEliminar = (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) return;
    eliminarProducto(p.id);
    setVersion((v) => v + 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Productos</h1>
          <p className="text-muted mb-0">{productos.length} productos en el catálogo</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-warning">⚠ Stock crítico</Link>
          <Link to="/admin/productos/nuevo" className="btn btn-dark">+ Nuevo producto</Link>
        </div>
      </div>

      <input type="search" className="form-control mb-3" placeholder="Buscar por nombre…"
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ maxWidth: 360 }} />

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Producto</th><th>Categoría</th><th>Género</th>
                <th className="text-end">Precio</th><th className="text-center">% Oferta</th>
                <th className="text-center">Stock</th><th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No hay productos que coincidan.</td></tr>
              ) : filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imagen} alt="" width="40" height="40" className="rounded object-fit-cover me-2" />
                    <span className="fw-semibold">{p.nombre}</span>
                  </td>
                  <td>{nombreCategoria(p.categoriaId)}</td>
                  <td className="text-capitalize">{p.genero}</td>
                  <td className="text-end">{formatearCLP(p.precio)}</td>
                  <td className="text-center">{p.descuento > 0 ? <span className="badge bg-danger">{p.descuento}%</span> : "—"}</td>
                  <td className="text-center">
                    <span className={`badge ${p.stock === 0 ? "bg-secondary" : p.stock <= 5 ? "bg-warning text-dark" : "bg-success"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button type="button" className="btn btn-outline-dark" onClick={() => navigate(`/admin/productos/${p.id}/editar`)}>Editar ✏️</button>
                      <button type="button" className="btn btn-outline-danger" onClick={() => manejarEliminar(p)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
