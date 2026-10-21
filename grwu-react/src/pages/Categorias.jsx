import { Link } from 'react-router-dom';
import { listarCategorias } from '../data/categoriasData';
import { listarPorCategoria } from '../data/productosData';
import { normalizarImagen } from '../components/ProductCard';

export default function Categorias() {
  const categorias = listarCategorias();

  return (
    <div className="container py-5">
      <div className="catalog-hero mb-5 text-center">
        <span className="catalog-hero-kicker">Colección GRWU</span>
        <h1 className="catalog-hero-title">Categorías</h1>
        <p className="catalog-hero-sub">Explora nuestra ropa por género o tipo de prenda.</p>
      </div>
      <div className="row g-4">
        {categorias.map((c) => {
          const total = listarPorCategoria(c.slug).length;
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm categoria-card">
                  <img
                    src={normalizarImagen(c.imagen) || '/img/logoGRWU.png'}
                    alt={c.nombre}
                    className="card-img-top"
                    style={{ height: 200, objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/img/logoGRWU.png'; }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-dark">{c.nombre}</h5>
                    <p className="card-text text-muted small">{c.descripcion}</p>
                    <span className="badge bg-secondary">{total} productos</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}