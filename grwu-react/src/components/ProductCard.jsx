import { Link } from 'react-router-dom';
import { formatearCLP } from '../data/carritoData';
import { useCarrito } from '../context/CarritoContext';

// Normaliza rutas de imágenes del catálogo: los datos guardan rutas relativas
// del tipo 'img/mujer/abrigo1.png'. En rutas anidadas (/productos/:id,
// /categorias/:slug) el navegador las resuelve como '/productos/img/...' o
// '/categorias/img/...' y la imagen nunca carga (404). Convertirlas a absolutas
// ('/img/...') lo corrige en cualquier vista.
export const normalizarImagen = (src) => {
  if (!src) return null;
  if (/^(https?:|data:|blob:|\/)/i.test(src)) return src; // ya absoluta o externa
  return `/${src}`; // 'img/...' -> '/img/...'
};

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  if (!producto) return null;

  const imagen = normalizarImagen(producto.imagen) || '/img/logoGRWU.png';
  const tieneOferta = Number(producto.oferta) > 0;
  const sinStock = producto.stock === 0;

  return (
    <div className={`card product-card h-100${sinStock ? ' product-card-sin-stock' : ''}`}>
      <Link to={`/productos/${producto.id}`} className="text-decoration-none product-card-link">
        <div className="product-card-image position-relative">
          <img
            src={imagen}
            alt={producto.nombre}
            className="card-img-top"
            loading="lazy"
            onError={(e) => {
              // Ruta absoluta: evita el bucle de error en rutas anidadas (/productos/:id)
              if (e.currentTarget.src !== window.location.origin + '/img/logoGRWU.png') {
                e.currentTarget.src = '/img/logoGRWU.png';
              }
            }}
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
