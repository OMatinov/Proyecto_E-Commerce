// ProductoCard.jsx - Tarjeta de producto reutilizable (tienda).
// Autor: Matías
//
// La usan Home, Productos, Categoria y Ofertas. Si viene `precioFinal` distinto de
// `producto.precio` (ofertas), muestra el precio original tachado y el badge de descuento.

import { Link } from "react-router-dom";
import { formatearCLP } from "../data/carritoData.js";
import { useCarrito } from "../context/CarritoContext.jsx";

export default function ProductoCard({ producto, precioFinal }) {
  const { agregar } = useCarrito();
  const final = precioFinal ?? producto.precio;
  const enOferta = final < producto.precio;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <Link to={`/productos/${producto.id}`} className="text-decoration-none text-dark">
        <div className="position-relative">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="card-img-top"
            style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
          />
          {producto.descuento > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2 text-uppercase">
              -{producto.descuento}%
            </span>
          )}
        </div>
      </Link>
      <div className="card-body d-flex flex-column">
        <h2 className="h6 mb-1">
          <Link to={`/productos/${producto.id}`} className="text-decoration-none text-dark">
            {producto.nombre}
          </Link>
        </h2>
        <p className="mb-2">
          {enOferta ? (
            <>
              <span className="fw-bold">{formatearCLP(final)}</span>{" "}
              <span className="text-muted small text-decoration-line-through">{formatearCLP(producto.precio)}</span>
            </>
          ) : (
            <span className="fw-bold">{formatearCLP(producto.precio)}</span>
          )}
        </p>
        <button
          type="button"
          className="btn btn-sm btn-dark mt-auto rounded-pill"
          onClick={() => agregar({ id: producto.id, nombre: producto.nombre, precio: final, imagen: producto.imagen })}
          disabled={producto.stock === 0}
        >
          {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
