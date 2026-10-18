// TablaItems.jsx - Tabla de solo lectura con los productos de una compra.
// Autor: César
// Se usa en Checkout, Pago correcto y Pago con error.

import { formatearCLP } from "../data/carritoData.js";

export default function TablaItems({ items }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="text-end">Precio</th>
            <th className="text-center">Cantidad</th>
            <th className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                {i.imagen && <img src={i.imagen} alt="" width="40" height="40" className="me-2 rounded object-fit-cover" />}
                {i.nombre}
              </td>
              <td className="text-end">{formatearCLP(i.precio)}</td>
              <td className="text-center">{i.qty}</td>
              <td className="text-end">{formatearCLP(i.precio * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
