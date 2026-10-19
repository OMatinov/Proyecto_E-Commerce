// Categorias.jsx - Índice de categorías de la tienda (ruta pública).
// Autor: Matías

import { Link } from "react-router-dom";
import { listarCategorias, listarProductos } from "../data/productosData.js";

const IMAGEN_CATEGORIA = {
  "cat-abrigo": "/img/mujer/abrigo1.png",
  "cat-accesorio": "/img/mujer/accesorio1.png",
  "cat-calzado": "/img/mujer/calzado1.png",
  "cat-chaqueta": "/img/hombre/chaqueta1.jpeg",
  "cat-conjunto": "/img/mujer/conjunto1.png",
  "cat-falda": "/img/mujer/falda1.png",
  "cat-pantalon": "/img/hombre/pantalon1.jpeg",
  "cat-polera": "/img/hombre/poleron1.jpeg",
  "cat-vestido": "/img/mujer/vestido1.png",
};

export default function Categorias() {
  const categorias = listarCategorias();
  const productos = listarProductos();

  return (
    <main className="container py-5">
      <div className="text-center mb-4">
        <span className="text-uppercase fw-bold" style={{ color: "var(--color-secundario)", letterSpacing: "3px" }}>Explora</span>
        <h1 className="display-4 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Categorías</h1>
      </div>
      <div className="row g-4">
        {categorias.map((c) => {
          const cantidad = productos.filter((p) => p.categoriaId === c.id).length;
          return (
            <div key={c.id} className="col-6 col-md-4 col-lg-3">
              <Link to={`/categorias/${c.slug}`} className="card h-100 border-0 shadow-sm text-decoration-none text-dark overflow-hidden">
                <img src={IMAGEN_CATEGORIA[c.id] || "/img/portada.jpeg"} alt={c.nombre}
                  className="card-img-top" style={{ height: "180px", objectFit: "cover" }} />
                <div className="card-body text-center">
                  <h2 className="h6 fw-bold mb-0">{c.nombre}</h2>
                  <small className="text-muted">{cantidad} productos</small>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
