import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerProducto, listarPorCategoria } from '../services/productos';
import { formatearCLP } from '../data/carritoData';
import { useCarrito } from '../context/CarritoContext';
import ProductCard, { normalizarImagen } from '../components/ProductCard';

export default function DetalleProducto() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [cantidad, setCantidad] = useState(1);
  // Todos los hooks van antes de cualquier return condicional (reglas de los hooks).
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    let vigente = true;

    setCargando(true);
    setError('');
    setProducto(null);
    setRelacionados([]);
    setCantidad(1);
    setImagenActiva(0);

    obtenerProducto(id)
      .then(async (encontrado) => {
        if (!vigente) return;
        setProducto(encontrado);
        if (!encontrado) return;

        const lista = await listarPorCategoria(encontrado.categoria);
        if (!vigente) return;
        setRelacionados(lista.filter((p) => p.id !== encontrado.id).slice(0, 4));
      })
      .catch((fallo) => {
        if (vigente) setError(fallo.mensaje);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [id]);

  if (cargando) {
    return <p className="container py-5 text-center text-muted">Cargando producto...</p>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">{error}</div>
        <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <p className="text-muted">El producto que buscas ya no está disponible.</p>
        <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  const tieneOferta = Number(producto.oferta) > 0;

  // Galería: imagen principal + imágenes adicionales del producto (sin duplicados).
  // normalizarImagen() convierte rutas relativas 'img/...' en absolutas '/img/...'
  // para que cargen también dentro de la ruta anidada /productos/:id.
  const galeria = [...new Set(
    [producto.imagen, ...(producto.imagenes || [])]
      .map(normalizarImagen)
      .filter(Boolean)
  )];

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
            key={galeria[imagenActiva]}
            src={galeria[imagenActiva] || '/img/logoGRWU.png'}
            alt={`${producto.nombre} - imagen ${imagenActiva + 1}`}
            className="img-fluid rounded"
            style={{ maxHeight: 480, objectFit: 'cover', width: '100%' }}
            onError={(e) => { e.currentTarget.src = '/img/logoGRWU.png'; }}
          />
          {galeria.length > 1 && (
            <div className="d-flex gap-2 mt-2 galeria-miniaturas flex-wrap">
              {galeria.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  className={`btn p-0 overflow-hidden${i === imagenActiva ? ' border border-primary' : ' border'}`}
                  style={{ width: 64, height: 64 }}
                  aria-label={`Ver imagen ${i + 1} de ${producto.nombre}`}
                  onClick={() => setImagenActiva(i)}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/img/logoGRWU.png'; }}
                  />
                </button>
              ))}
            </div>
          )}
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
