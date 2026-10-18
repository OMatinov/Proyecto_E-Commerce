// ResumenTotales.jsx - Subtotal, envío y total.
// Autor: César

import { formatearCLP } from "../data/carritoData.js";

export default function ResumenTotales({ subtotal, envio, total }) {
  return (
    <dl className="row mb-0">
      <dt className="col-6 fw-normal">Subtotal</dt>
      <dd className="col-6 text-end">{formatearCLP(subtotal)}</dd>
      <dt className="col-6 fw-normal">Envío</dt>
      <dd className="col-6 text-end">{envio === 0 ? "Gratis" : formatearCLP(envio)}</dd>
      <dt className="col-6 fs-5">Total</dt>
      <dd className="col-6 text-end fs-5 fw-bold">{formatearCLP(total)}</dd>
    </dl>
  );
}
