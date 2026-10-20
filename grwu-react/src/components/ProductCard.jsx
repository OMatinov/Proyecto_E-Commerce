import { Link } from 'react-router-dom';
import { formatearCLP } from '../data/carritoData';
import { useCarrito } from '../context/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  if (!producto) return null;

  const tieneOferta = Number(producto.oferta) > 0;

  return (
    <div className="card product-card h-100">
      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img-top"
          style={{ objectFit: 'cover', height: 260 }}
          onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/productos/${producto.id}`} className="text-decoration-none text-dark">
          <h5 className="card-title">{producto.nombre}</h5>
        </Link>
        <p className="text-muted small mb-2">{producto.categoria}</p>
        <div className="mt-auto">
          {tieneOferta && (
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger">-{producto.oferta}%</span>
              <small className="text-decoration-line-through text-muted">
                {formatearCLP(producto.precioOriginal || producto.precio)}
              </small>
            </div>
          )}
          <strong className="fs-5">{formatearCLP(producto.precio)}</strong>
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => agregar(producto)}
          disabled={producto.stock === 0}
        >
          {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}