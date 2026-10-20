import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerProducto, listarPorCategoria } from '../data/productosData';
import { formatearCLP } from '../data/carritoData';
import { useCarrito } from '../context/CarritoContext';
import ProductCard from '../components/ProductCard';

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = obtenerProducto(id);
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <p className="text-muted">El producto que buscas ya no está disponible.</p>
        <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  const relacionados = listarPorCategoria(producto.categoria)
    .filter((p) => p.id !== producto.id)
    .slice(0, 4);

  const tieneOferta = Number(producto.oferta) > 0;

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded"
            style={{ maxHeight: 480, objectFit: 'cover', width: '100%' }}
            onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
          />
        </div>
        <div className="col-12 col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="text-muted">Categoría: {producto.categoria}</p>
          {tieneOferta && (
            <div className="mb-2">
              <span className="badge bg-danger me-2">-{producto.oferta}%</span>
              <span className="text-decoration-line-through text-muted">
                {formatearCLP(producto.precioOriginal || producto.precio)}
              </span>
            </div>
          )}
          <h3 className="text-primary">{formatearCLP(producto.precio)}</h3>
          <p>{producto.descripcion}</p>

          <div className="d-flex align-items-center gap-2 my-3">
            <label htmlFor="cantidad" className="form-label mb-0">Cantidad:</label>
            <input
              id="cantidad"
              type="number"
              min="1"
              max={producto.stock || 1}
              className="form-control"
              style={{ width: 90 }}
              value={cantidad}
              onChange={(e) =>
                setCantidad(Math.max(1, Math.min(Number(e.target.value) || 1, producto.stock || 1)))
              }
            />
            <span className="text-muted small">Stock: {producto.stock}</span>
          </div>

          <button
            className="btn btn-primary btn-lg"
            disabled={producto.stock === 0}
            onClick={() => agregar({ ...producto, qty: cantidad })}
          >
            {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h3 className="mb-3">También te puede gustar</h3>
          <div className="row g-4">
            {relacionados.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                <ProductCard producto={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}