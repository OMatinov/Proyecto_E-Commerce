import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listarPorCategoria } from '../data/productosData';
import { obtenerCategoriaPorSlug } from '../data/categoriasData';
import ProductCard from '../components/ProductCard';

const CATEGORIAS_GENERO = ['hombre', 'mujer'];

export default function Categoria() {
  const { slug } = useParams();
  const categoria = obtenerCategoriaPorSlug(slug);
  const [genero, setGenero] = useState('');

  if (!categoria) {
    return (
      <div className="container py-5 text-center">
        <h2>Categoría no encontrada</h2>
        <Link to="/categorias" className="btn btn-primary mt-3">Ver todas las categorías</Link>
      </div>
    );
  }

  let productos = listarPorCategoria(slug);
  // En categorías de género no tiene sentido volver a filtrar por el mismo género
  const mostrarFiltroGenero = !CATEGORIAS_GENERO.includes(slug);
  if (mostrarFiltroGenero && genero) {
    productos = productos.filter((p) => p.genero === genero);
  }

  return (
    <div className="container py-5">
      <div className="catalog-hero mb-5 text-center">
        <span className="catalog-hero-kicker">GRWU</span>
        <h1 className="catalog-hero-title">{categoria.nombre}</h1>
        <p className="catalog-hero-sub">{categoria.descripcion}</p>
      </div>

      {mostrarFiltroGenero && (
        <div className="gender-filters justify-content-center mb-4" style={{ borderTop: 'none' }}>
          {[
            { valor: '', etiqueta: 'Todos' },
            { valor: 'mujer', etiqueta: 'Mujer' },
            { valor: 'hombre', etiqueta: 'Hombre' },
          ].map((g) => (
            <button
              key={g.valor || 'todos'}
              type="button"
              className={`gender-button${genero === g.valor ? ' active' : ''}`}
              onClick={() => setGenero(g.valor)}
            >
              {g.etiqueta}
            </button>
          ))}
        </div>
      )}

      {productos.length === 0 ? (
        <p className="text-center text-muted py-5">Aún no hay productos en esta categoría.</p>
      ) : (
        <>
          <p className="catalog-count text-muted mb-3">{productos.length} productos</p>
          <div className="row g-4">
            {productos.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                <ProductCard producto={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
