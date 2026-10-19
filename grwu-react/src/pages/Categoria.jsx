// Categoria.jsx - Productos de una categoría (ruta pública /categorias/:slug).
// Autor: Matías

import { Link, useParams } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import { obtenerCategoriaPorSlug, productosPorCategoria } from "../data/productosData.js";

export default function Categoria() {
  const { slug } = useParams();
  const categoria = obtenerCategoriaPorSlug(slug);

  if (!categoria) {
    return (
      <MensajeVacio titulo="Categoría no encontrada" texto={`No existe la categoría "${slug}".`}
        enlace="/categorias" textoEnlace="Ver categorías" />
    );
  }

  const productos = productosPorCategoria(categoria.id);

  return (
    <main className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
        </ol>
      </nav>
      <h1 className="h3 mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{categoria.nombre}</h1>
      <p className="text-muted">{productos.length} productos en esta categoría</p>

      {productos.length === 0 ? (
        <MensajeVacio titulo="Categoría vacía" texto="Aún no hay productos publicados aquí."
          enlace="/productos" textoEnlace="Ver todo el catálogo" />
      ) : (
        <div className="row g-4">
          {productos.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
