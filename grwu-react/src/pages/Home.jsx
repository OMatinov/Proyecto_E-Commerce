import { Link } from 'react-router-dom';
import { listarProductos, listarOfertas, listarPorCategoria } from '../data/productosData';
import { listarCategorias } from '../data/categoriasData';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const productos = listarProductos().slice(0, 4);
  const ofertas = listarOfertas().slice(0, 4);
  const categorias = listarCategorias();
  const categoriasDestacadas = categorias.slice(0, 8);

  return (
    <>
      <section className="hero-grwu text-white text-center py-5">
        <div className="container py-5">
          <span className="hero-kicker d-inline-block mb-3">Nueva colección</span>
          <h1 className="display-4 hero-title">Get Ready With Us</h1>
          <p className="lead hero-sub">Moda urbana, envíos a todo Chile.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
            <Link to="/productos" className="btn btn-light btn-lg hero-cta">
              Ver catálogo
            </Link>
            <Link to="/ofertas" className="btn btn-outline-light btn-lg hero-cta-alt">
              Ver ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* Accesos rápidos por género */}
      <section className="container py-4">
        <div className="row g-4">
          {['mujer', 'hombre'].map((g) => (
            <div className="col-12 col-md-6" key={g}>
              <Link to={`/categorias/${g}`} className="text-decoration-none">
                <div className="gender-banner gender-banner--cap" data-genero={g}>
                  <div className="gender-banner-content">
                    <h2 className="gender-banner-title">{g === 'mujer' ? 'Mujer' : 'Hombre'}</h2>
                    <p className="gender-banner-count">{listarPorCategoria(g).length} productos</p>
                    <span className="btn btn-light btn-sm">Explorar →</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="section-kicker">Explora</span>
            <h2 className="section-title mb-0">Categorías</h2>
          </div>
          <Link to="/categorias" className="link-ver-todo">Ver todas →</Link>
        </div>
        <div className="row g-3">
          {categoriasDestacadas.map((c) => (
            <div className="col-6 col-md-4 col-lg-3" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
                <div className="card h-100 text-center p-3 categoria-chip">
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    style={{ height: 120, objectFit: 'cover' }}
                    className="rounded mb-2"
                    onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
                  />
                  <strong>{c.nombre}</strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading mb-4">
          <span className="section-kicker">Recién llegados</span>
          <h2 className="section-title mb-0">Nuevos lanzamientos</h2>
        </div>
        <div className="row g-4">
          {productos.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      </section>

      {ofertas.length > 0 && (
        <section className="ofertas-strip py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="section-heading">
                <span className="section-kicker section-kicker--accent">% descuento</span>
                <h2 className="section-title mb-0">Ofertas</h2>
              </div>
              <Link to="/ofertas" className="btn btn-outline-primary">Ver todas</Link>
            </div>
            <div className="row g-4">
              {ofertas.map((p) => (
                <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
