import { Link } from 'react-router-dom';
import { listarCategorias } from '../data/categoriasData';
import { listarProductos } from '../data/productosData';

export default function Categorias() {
  const categorias = listarCategorias();
  const productos = listarProductos();

  return (
    <div className="container py-5">
      <h1 className="mb-4">Categorías</h1>
      <div className="row g-4">
        {categorias.map((c) => {
          const total = productos.filter((p) => p.categoria === c.slug).length;
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm">
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    className="card-img-top"
                    style={{ height: 200, objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
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