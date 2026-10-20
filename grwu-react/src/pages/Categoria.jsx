import { Link, useParams } from 'react-router-dom';
import { listarPorCategoria } from '../data/productosData';
import { obtenerCategoriaPorSlug } from '../data/categoriasData';
import ProductCard from '../components/ProductCard';

export default function Categoria() {
  const { slug } = useParams();
  const categoria = obtenerCategoriaPorSlug(slug);
  const productos = listarPorCategoria(slug);

  if (!categoria) {
    return (
      <div className="container py-5 text-center">
        <h2>Categoría no encontrada</h2>
        <Link to="/categorias" className="btn btn-primary mt-3">Ver todas las categorías</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-2">{categoria.nombre}</h1>
      <p className="text-muted mb-4">{categoria.descripcion}</p>

      {productos.length === 0 ? (
        <p className="text-center text-muted py-5">Aún no hay productos en esta categoría.</p>
      ) : (
        <div className="row g-4">
          {productos.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}