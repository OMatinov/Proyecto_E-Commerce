import { Link } from 'react-router-dom';
import { listarProductos, listarOfertas } from '../data/productosData';
import { listarCategorias } from '../data/categoriasData';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const productos = listarProductos().slice(0, 4);
  const ofertas = listarOfertas().slice(0, 4);
  const categorias = listarCategorias();

  return (
    <>
      <section className="hero-grwu text-white text-center py-5">
        <div className="container py-5">
          <h1 className="display-4">Get Ready With Us</h1>
          <p className="lead">Moda urbana, envíos a todo Chile.</p>
          <Link to="/productos" className="btn btn-light btn-lg mt-3">
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Categorías</h2>
        <div className="row g-3">
          {categorias.map((c) => (
            <div className="col-6 col-md-4 col-lg" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
                <div className="card h-100 text-center p-3">
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    style={{ height: 120, objectFit: 'cover' }}
                    className="rounded mb-2"
                  />
                  <strong>{c.nombre}</strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Nuevos lanzamientos</h2>
        <div className="row g-4">
          {productos.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      </section>

      {ofertas.length > 0 && (
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Ofertas</h2>
            <Link to="/ofertas" className="btn btn-outline-primary">Ver todas</Link>
          </div>
          <div className="row g-4">
            {ofertas.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                <ProductCard producto={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}