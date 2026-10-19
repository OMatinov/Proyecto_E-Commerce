// AdminProductosCriticos.jsx - Productos con stock bajo (<= 5 unidades).
// Autor: Matías

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarCategorias, productosCriticos, actualizarProducto } from "../../data/productosData.js";
import { formatearCLP } from "../../data/carritoData.js";

const UMBRAL = 5;
const REPOSICION = 10;

export default function AdminProductosCriticos() {
  const [version, setVersion] = useState(0);
  const criticos = useMemo(() => productosCriticos(UMBRAL), [version]);
  const categorias = useMemo(() => listarCategorias(), []);

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";

  const reponer = (p) => {
    actualizarProducto(p.id, { stock: p.stock + REPOSION });
    setVersion((v) => v + 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Stock crítico</h1>
          <p className="text-muted mb-0">Productos con {UMBRAL} o menos unidades disponibles.</p>
        </div>
        <Link to="/admin/productos" className="btn btn-outline-dark">← Volver a Productos</Link>
      </div>

      {criticos.length === 0 ? (
        <div className="alert alert-success">🎉 Genial: no hay productos con stock crítico.</div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-warning">
                <tr>
                  <th>Producto</th><th>Categoría</th><th className="text-end">Precio</th>
                  <th className="text-center">Stock actual</th><th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.imagen} alt="" width="40" height="40" className="rounded object-fit-cover me-2" />
                      <span className="fw-semibold">{p.nombre}</span>
                    </td>
                    <td>{nombreCategoria(p.categoriaId)}</td>
                    <td className="text-end">{formatearCLP(p.precio)}</td>
                    <td className="text-center">
                      <span className={`badge ${p.stock === 0 ? "bg-danger" : "bg-warning text-dark"}`}>{p.stock}</span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button type="button" className="btn btn-outline-success" onClick={() => reponer(p)}>
                          +{REPOSION} unidades
                        </button>
                        <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-dark">Editar ✏️</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
