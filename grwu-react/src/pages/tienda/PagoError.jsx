// PagoError.jsx - Vista "No se pudo realizar el pago".
// Autor: César
//
// La orden ya existe con estado "rechazada". "Volver a realizar el pago" repite el cobro:
//   aprobado -> la orden pasa a "pagada", se vacía el carrito y va a /pago-correcto/:id
//   rechazado -> se muestra el nuevo motivo y se queda en esta vista

import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import ResumenOrden from "../../components/ResumenOrden.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { actualizarEstadoOrden, obtenerOrden } from "../../data/ordenesData.js";
import { procesarPago } from "../../services/pago.js";

export default function PagoError() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { vaciar } = useCarrito();
  const orden = obtenerOrden(id);
  const [motivo, setMotivo] = useState(state?.motivo ?? "No se pudo completar la transacción.");

  if (!orden) {
    return <MensajeVacio titulo="Orden no encontrada" texto="No existe una compra con ese número." enlace="/" textoEnlace="Volver al inicio" />;
  }

  const reintentar = () => {
    const pago = procesarPago({ metodoPago: orden.metodoPago, total: orden.total });
    if (pago.aprobado) {
      actualizarEstadoOrden(orden.id, "pagada");
      vaciar();
      navigate(`/pago-correcto/${orden.id}`, { replace: true });
    } else {
      setMotivo(pago.motivo);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: 820 }}>
      <div className="alert alert-danger" role="alert">
        <h1 className="h4">✖ No se pudo realizar el pago. nro #{orden.numero}</h1>
        <p className="mb-0">{motivo}</p>
      </div>
      <div className="d-flex gap-2 mb-4">
        <button type="button" className="btn btn-success" onClick={reintentar}>Volver a realizar el pago</button>
        <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
      </div>
      <ResumenOrden orden={orden} />
    </main>
  );
}
