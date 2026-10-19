// Productos.jsx - Catálogo completo con búsqueda y filtros.
// Autor: Matías

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import { listarCategorias, listarProductos } from "../data/productosData.js";

export default function Productos() {
  const productos = useMemo(() => listarProductos(), []);
  const categorias = useMemo(() => listarCategorias(), []);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [genero, setGenero] = useState("");

  const filtrados = productos.filter((p) => {
    if (categoriaId && p.categoriaId !== categoriaId) return false;
    if (genero && p.genero !== genero) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <main className="container py-4">
      <h1 className="h3 mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Catálogo</h1>
      <p className="text-muted">{filtrados.length} de {productos.length} productos</p>

      <div className="row g-2 align-items-end mb-4">
        <div className="col-md-5">
          <label htmlFor="busqueda" className="form-label small fw-bold">Buscar</label>
          <input id="busqueda" type="search" className="form-control" placeholder="Nombre del producto…"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label htmlFor="categoria" className="form-label small fw-bold">Categoría</label>
          <select id="categoria" className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="genero" className="form-label small fw-bold">Género</label>
          <select id="genero" className="form-select" value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="">Todos</option>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <MensajeVacio titulo="Sin resultados" texto="Prueba con otra búsqueda o quita los filtros."
          enlace="/productos" textoEnlace="Limpiar búsqueda" />
      ) : (
        <div className="row g-4">
          {filtrados.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-5">
        <Link to="/ofertas" className="btn btn-outline-danger rounded-pill px-4">Ver ofertas 🔥</Link>
      </div>
    </main>
  );
}
