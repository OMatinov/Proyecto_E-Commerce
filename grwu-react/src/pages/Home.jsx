// Home.jsx - Página de inicio de la tienda.
// Autor: Matías
//
// Muestra portada, categorías destacadas, novedades del catálogo y una selección
// de ofertas. Todo se lee desde productosData.js (semilla + localStorage).

import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import { listarCategorias, listarProductos, productosEnOferta, precioConDescuento } from "../data/productosData.js";

export default function Home() {
  const categorias = listarCategorias();
  const novedades = listarProductos().slice(-8).reverse();
  const ofertas = productosEnOferta().slice(0, 4);

  return (
    <main>
      {/* Portada */}
      <section className="position-relative text-white">
        <img src="/img/portada.jpeg" alt="" className="w-100" style={{ height: "380px", objectFit: "cover", filter: "brightness(0.5)" }} />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
          <p className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "4px" }}>Get Ready With Us</p>
          <h1 className="display-3 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Tu estilo no necesita permiso</h1>
          <Link to="/productos" className="btn btn-light btn-lg rounded-pill px-4 mt-2">Ver catálogo</Link>
        </div>
      </section>

      <div className="container py-5">
        {/* Categorías */}
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className="h3 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Categorías</h2>
          <Link to="/categorias" className="text-decoration-none">Ver todas →</Link>
        </div>
        <div className="row g-2 mb-5">
          {categorias.slice(0, 6).map((c) => (
            <div key={c.id} className="col-6 col-md-4 col-lg-2">
              <Link to={`/categorias/${c.slug}`} className="btn btn-outline-dark w-100 rounded-pill py-3">
                {c.nombre}
              </Link>
            </div>
          ))}
        </div>

        {/* Novedades */}
        <h2 className="h3 fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Novedades</h2>
        <div className="row g-4 mb-5">
          {novedades.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>

        {/* Ofertas */}
        {ofertas.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-end mb-3">
              <h2 className="h3 fw-bold mb-0 text-danger" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>🔥 Ofertas</h2>
              <Link to="/ofertas" className="text-decoration-none">Ver todas las ofertas →</Link>
            </div>
            <div className="row g-4">
              {ofertas.map((p) => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductoCard producto={p} precioFinal={precioConDescuento(p)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
