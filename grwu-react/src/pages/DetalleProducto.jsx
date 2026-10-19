// DetalleProducto.jsx - Ficha del producto (ruta pública /productos/:id).
// Autor: Matías
//
// Muestra imagen, precio (con descuento si aplica), stock y descripción, y permite
// agregar al carrito con una cantidad seleccionada. Otros productos de la misma
// categoría aparecen como sugerencias.

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { formatearCLP } from "../data/carritoData.js";
import { obtenerCategoria, obtenerProducto, precioConDescuento, productosPorCategoria } from "../data/productosData.js";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = obtenerProducto(id);
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (!producto) {
    return (
      <MensajeVacio titulo="Producto no encontrado" texto="Puede que hayamos retirado esta prenda."
        enlace="/productos" textoEnlace="Ver catálogo" />
    );
  }

  const categoria = obtenerCategoria(producto.categoriaId);
  const final = precioConDescuento(producto);
  const enOferta = final < producto.precio;
  const sugeridos = productosPorCategoria(producto.categoriaId).filter((p) => p.id !== producto.id).slice(0, 4);

  const manejarAgregar = () => {
    agregar({ id: producto.id, nombre: producto.nombre, precio: final, imagen: producto.imagen }, cantidad);
    setAgregado(true);
  };

  return (
    <main className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          {categoria && (
            <li className="breadcrumb-item"><Link to={`/categorias/${categoria.slug}`}>{categoria.nombre}</Link></li>
          )}
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="w-100 rounded shadow-sm"
            style={{ aspectRatio: "3 / 4", objectFit: "cover" }} />
        </div>
        <div className="col-md-6">
          <h1 className="h2 fw-bold">{producto.nombre}</h1>
          {categoria && <p className="text-muted mb-2">{categoria.nombre} · Para {producto.genero}</p>}
          <p className="fs-3 fw-bold mb-1">
            {formatearCLP(final)}{" "}
            {enOferta && (
              <>
                <span className="fs-6 text-muted text-decoration-line-through align-middle me-2">{formatearCLP(producto.precio)}</span>
                <span className="badge bg-danger align-middle">-{producto.descuento}%</span>
              </>
            )}
          </p>
          <p className={producto.stock > 5 ? "text-success" : "text-warning fw-semibold"}>
            {producto.stock === 0 ? "Sin stock disponible" : `${producto.stock} unidades disponibles`}
          </p>
          <hr />
          <p className="text-muted">{producto.descripcion}</p>

          <div className="d-flex align-items-center gap-2 mt-4">
            <label htmlFor="cantidad" className="form-label mb-0 fw-semibold">Cantidad</label>
            <input id="cantidad" type="number" min="1" max={Math.max(1, producto.stock)} className="form-control"
              style={{ width: 90 }} value={cantidad} disabled={producto.stock === 0}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))} />
            <button type="button" className="btn btn-dark rounded-pill px-4" onClick={manejarAgregar}
              disabled={producto.stock === 0}>
              Agregar al carrito
            </button>
          </div>
          {agregado && (
            <div className="alert alert-success mt-3 mb-0" role="status">
              ✔ Agregado. <Link to="/carrito" className="alert-link">Ir al carrito</Link>
            </div>
          )}
          <Link to="/productos" className="d-inline-block mt-3 text-decoration-none">← Seguir comprando</Link>
        </div>
      </div>

      {sugeridos.length > 0 && (
        <>
          <h2 className="h4 fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>También te puede gustar</h2>
          <div className="row g-4">
            {sugeridos.map((p) => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProductoCard producto={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
