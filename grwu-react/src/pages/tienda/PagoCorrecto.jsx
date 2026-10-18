// PagoCorrecto.jsx - Vista "Se ha realizado la compra".
// Autor: César
// Lee la orden desde ordenesData usando el :id de la URL (/pago-correcto/:id).

import { Link, useParams } from "react-router-dom";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import ResumenOrden from "../../components/ResumenOrden.jsx";
import { obtenerOrden } from "../../data/ordenesData.js";

export default function PagoCorrecto() {
  const { id } = useParams();
  const orden = obtenerOrden(id);

  if (!orden) {
    return <MensajeVacio titulo="Orden no encontrada" texto="No existe una compra con ese número." enlace="/" textoEnlace="Volver al inicio" />;
  }

  return (
    <main className="container py-4" style={{ maxWidth: 820 }}>
      <div className="alert alert-success d-flex justify-content-between flex-wrap" role="status">
        <h1 className="h4 mb-0">✔ Se ha realizado la compra. nro #{orden.numero}</h1>
        <span className="text-muted">Código de orden: {orden.id}</span>
      </div>
      <ResumenOrden orden={orden} />
      <div className="d-flex gap-2 mt-4">
        <Link to="/" className="btn btn-primary">Seguir comprando</Link>
        <button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>Imprimir boleta</button>
      </div>
    </main>
  );
}
