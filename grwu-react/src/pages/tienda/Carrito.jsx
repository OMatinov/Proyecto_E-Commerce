// Carrito.jsx - Vista "Carrito de compras" (tienda).
// Autor: César
//
// No guarda estado propio: todo viene de useCarrito() (CarritoContext),
// por eso lo que se cambia aquí se refleja de inmediato en el contador del navbar.

import { Link } from "react-router-dom";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import ResumenTotales from "../../components/ResumenTotales.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { formatearCLP } from "../../data/carritoData.js";

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, totales } = useCarrito();

  if (items.length === 0) {
    return (
      <MensajeVacio titulo="Tu carrito está vacío" texto="Agrega productos para comenzar tu compra."
        enlace="/" textoEnlace="Ver productos" />
    );
  }

  const { subtotal, envio, total } = totales();

  return (
    <main className="container py-4">
      <h1 className="h3 mb-4">Carrito de compras</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr><th>Producto</th><th className="text-end">Precio</th><th className="text-center">Cantidad</th><th className="text-end">Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      {i.imagen && <img src={i.imagen} alt="" width="48" height="48" className="me-2 rounded object-fit-cover" />}
                      {i.nombre}
                    </td>
                    <td className="text-end">{formatearCLP(i.precio)}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${i.nombre}`}>
                        <button type="button" className="btn btn-outline-secondary" aria-label={`Quitar una unidad de ${i.nombre}`}
                          disabled={i.qty <= 1} onClick={() => cambiarCantidad(i.id, i.qty - 1)}>−</button>
                        <span className="btn btn-light disabled" data-testid={`qty-${i.id}`}>{i.qty}</span>
                        <button type="button" className="btn btn-outline-secondary" aria-label={`Agregar una unidad de ${i.nombre}`}
                          onClick={() => cambiarCantidad(i.id, i.qty + 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end">{formatearCLP(i.precio * i.qty)}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitar(i.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <ResumenTotales subtotal={subtotal} envio={envio} total={total} />
              <p className="small text-muted mt-2">Envío gratis en compras sobre {formatearCLP(44990)}.</p>
              <Link to="/checkout" className="btn btn-success w-100 mb-2">Ir a pagar</Link>
              <button type="button" className="btn btn-outline-secondary w-100" onClick={vaciar}>Vaciar carrito</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
