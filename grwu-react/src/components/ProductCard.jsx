import { Link } from 'react-router-dom';
import { formatearCLP } from '../data/carritoData';
import { useCarrito } from '../context/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  if (!producto) return null;

  const tieneOferta = Number(producto.oferta) > 0;
  const sinStock = producto.stock === 0;

  return (
    <div className={`card product-card h-100${sinStock ? ' product-card-sin-stock' : ''}`}>
      <Link to={`/productos/${producto.id}`} className="text-decoration-none product-card-link">
        <div className="product-card-image position-relative">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="card-img-top"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
          />
          {tieneOferta && <span className="badge-oferta">-{producto.oferta}%</span>}
          {sinStock && <span className="badge-sin-stock">Agotado</span>}
        </div>
      </Link>
      <div className="card-body d-flex flex-column">
        <p className="product-category mb-1">{producto.genero || producto.categoria}</p>
        <Link to={`/productos/${producto.id}`} className="text-decoration-none text-dark">
          <h5 className="card-title product-name">{producto.nombre}</h5>
        </Link>
        <div className="mt-auto">
          {tieneOferta && (
            <small className="text-decoration-line-through text-muted d-block">
              {formatearCLP(producto.precioOriginal || producto.precio)}
            </small>
          )}
          <strong className={`fs-5 product-price${tieneOferta ? ' on-sale' : ''}`}>
            {formatearCLP(producto.precio)}
          </strong>
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => agregar(producto)}
          disabled={sinStock}
        >
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
