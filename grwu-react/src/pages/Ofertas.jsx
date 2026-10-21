import { useMemo, useState } from 'react';
import { listarOfertas } from '../data/productosData';
import ProductCard from '../components/ProductCard';

export default function Ofertas() {
  const [genero, setGenero] = useState('');

  const ofertas = listarOfertas();
  const filtradas = useMemo(
    () => (genero ? ofertas.filter((p) => p.genero === genero) : ofertas),
    [ofertas, genero]
  );

  return (
    <div className="container py-5">
      <div className="offers-hero mb-5 text-center">
        <span className="offers-hero-badge">🔥 Descuentos</span>
        <h1 className="offers-hero-title">Ofertas</h1>
        <p className="offers-hero-sub">Hasta -{ofertas.reduce((max, p) => Math.max(max, Number(p.oferta)), 0)}% en selección de temporada.</p>
      </div>

      {ofertas.length > 0 && (
        <div className="gender-filters justify-content-center mb-4">
          {[
            { valor: '', etiqueta: 'Todas' },
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

      {filtradas.length === 0 ? (
        <p className="text-muted text-center py-5">No hay ofertas disponibles por el momento.</p>
      ) : (
        <>
          <p className="catalog-count text-muted mb-3">{filtradas.length} ofertas</p>
          <div className="row g-4">
            {filtradas.map((p) => (
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
