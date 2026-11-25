import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarCategorias } from '../services/categorias';
import { listarProductos } from '../services/productos';
import { normalizarImagen } from '../components/ProductCard';

const CATEGORIAS_GENERO = ['hombre', 'mujer'];

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;

    Promise.all([listarCategorias(), listarProductos()])
      .then(([listaCategorias, listaProductos]) => {
        if (!vigente) return;
        setCategorias(listaCategorias);
        setProductos(listaProductos);
      })
      .catch((fallo) => {
        if (vigente) setError(fallo.mensaje);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  // Las categorías de género agrupan por el campo genero del producto.
  const contar = (slug) =>
    CATEGORIAS_GENERO.includes(slug)
      ? productos.filter((p) => p.categoria === slug || p.genero === slug).length
      : productos.filter((p) => p.categoria === slug).length;

  return (
    <div className="container py-5">
      <div className="catalog-hero mb-5 text-center">
        <span className="catalog-hero-kicker">Colección GRWU</span>
        <h1 className="catalog-hero-title">Categorías</h1>
        <p className="catalog-hero-sub">Explora nuestra ropa por género o tipo de prenda.</p>
      </div>

      {cargando && <p className="text-center text-muted py-5">Cargando categorías...</p>}

      {!cargando && error && (
        <div className="alert alert-danger text-center" role="alert">{error}</div>
      )}

      {!cargando && !error && (
        <div className="row g-4">
          {categorias.map((c) => (
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
                    <span className="badge bg-secondary">{contar(c.slug)} productos</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
