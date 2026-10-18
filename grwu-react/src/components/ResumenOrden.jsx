// ResumenOrden.jsx - Datos del cliente, dirección, productos y totales de una orden.
// Autor: César
// Lo comparten Pago correcto y Pago con error (y puede reutilizarlo "Mostrar boleta" del admin).

import TablaItems from "./TablaItems.jsx";
import ResumenTotales from "./ResumenTotales.jsx";
import { METODOS_PAGO } from "../services/pago.js";

export default function ResumenOrden({ orden }) {
  const { cliente, direccion } = orden;
  return (
    <section>
      <div className="row mb-3">
        <div className="col-md-6">
          <h2 className="h6 text-uppercase text-muted">Cliente</h2>
          <p className="mb-0">{cliente.nombre} {cliente.apellidos}</p>
          <p className="mb-0">{cliente.correo}</p>
          <p className="mb-0">Pago: {METODOS_PAGO[orden.metodoPago]}</p>
        </div>
        <div className="col-md-6">
          <h2 className="h6 text-uppercase text-muted">Entrega</h2>
          <p className="mb-0">{direccion.calle}{direccion.departamento ? `, ${direccion.departamento}` : ""}</p>
          <p className="mb-0">{direccion.comuna}, {direccion.region}</p>
          {direccion.indicaciones && <p className="mb-0 fst-italic">{direccion.indicaciones}</p>}
        </div>
      </div>
      <TablaItems items={orden.items} />
      <ResumenTotales subtotal={orden.subtotal} envio={orden.envio} total={orden.total} />
    </section>
  );
}
