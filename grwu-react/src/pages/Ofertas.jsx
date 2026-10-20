import { listarOfertas } from '../data/productosData';
import ProductCard from '../components/ProductCard';

export default function Ofertas() {
  const ofertas = listarOfertas();

  return (
    <div className="container py-5">
      <h1 className="mb-4">Ofertas</h1>
      {ofertas.length === 0 ? (
        <p className="text-muted text-center py-5">No hay ofertas disponibles por el momento.</p>
      ) : (
        <div className="row g-4">
          {ofertas.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}