// PagoError.jsx - Vista "No se pudo realizar el pago".
// Autor: César
//
// La boleta ya existe en ms-boletas con estado "rechazada". "Volver a realizar el pago" llama a
// POST /boletas/:id/reintentar-pago (solo el Cliente dueño y solo si está rechazada):
//   aprobado  -> la boleta pasa a "pagada", se vacía el carrito y va a /pago-correcto/:id
//   rechazado -> se muestra el nuevo motivo y se queda en esta vista
//   409/403   -> se muestra el mensaje del backend (p. ej. stock agotado)

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MensajeVacio from "../components/MensajeVacio.jsx";
import ResumenOrden from "../components/ResumenOrden.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { desdeBoleta } from "../services/adapters.js";
import boletasService from "../services/boletas.js";
import { normalizarError } from "../services/errores.js";

export default function PagoError() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { vaciar } = useCarrito();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [motivo, setMotivo] = useState(state?.motivo ?? "");
  const [reintentando, setReintentando] = useState(false);

  useEffect(() => {
    let vigente = true;
    boletasService.obtener(id)
      .then((b) => {
        if (!vigente) return;
        setOrden(desdeBoleta(b));
        setMotivo((actual) => actual || b.motivoRechazo || "No se pudo completar la transacción.");
      })
      .catch((e) => {
        const n = normalizarError(e);
        if (vigente && n.status !== 404) setError(n.status === 403 ? "No tienes permiso para ver esta compra." : n.mensaje);
      })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [id]);

  if (cargando) return <main className="container py-5 text-center">Cargando tu compra...</main>;

  if (!orden && error) {
    return <MensajeVacio titulo="No pudimos mostrar la compra" texto={error} enlace="/" textoEnlace="Volver al inicio" />;
  }

  if (!orden) {
    return <MensajeVacio titulo="Orden no encontrada" texto="No existe una compra con ese número." enlace="/" textoEnlace="Volver al inicio" />;
  }

  const reintentar = async () => {
    setError("");
    setReintentando(true);
    try {
      const boleta = await boletasService.reintentarPago(orden.id);
      if (boleta.estado === "pagada") {
        vaciar();
        navigate(`/pago-correcto/${orden.id}`, { replace: true });
        return;
      }
      setMotivo(boleta.motivoRechazo || "El pago fue rechazado nuevamente.");
    } catch (e) {
      setError(normalizarError(e).mensaje);
    } finally {
      setReintentando(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: 820 }}>
      <div className="alert alert-danger" role="alert">
        <h1 className="h4">✖ No se pudo realizar el pago. nro #{orden.numero}</h1>
        <p className="mb-0">{motivo}</p>
      </div>
      {error && <div className="alert alert-warning" role="alert">{error}</div>}
      <div className="d-flex gap-2 mb-4">
        <button type="button" className="btn btn-success" onClick={reintentar} disabled={reintentando}>
          {reintentando ? "Procesando..." : "Volver a realizar el pago"}
        </button>
        <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
      </div>
      <ResumenOrden orden={orden} />
    </main>
  );
}
