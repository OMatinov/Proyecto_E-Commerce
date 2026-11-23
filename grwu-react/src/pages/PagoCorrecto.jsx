// PagoCorrecto.jsx - Vista "Se ha realizado la compra".
// Autor: César
// Lee la boleta real desde ms-boletas (GET /boletas/:id) usando el :id de la URL (/pago-correcto/:id).
// Un Cliente solo puede ver sus propias boletas (si no, el backend responde 403).
// Al cargar lanza confeti (utils/confeti.js).

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MensajeVacio from "../components/MensajeVacio.jsx";
import ResumenOrden from "../components/ResumenOrden.jsx";
import { desdeBoleta } from "../services/adapters.js";
import boletasService from "../services/boletas.js";
import { normalizarError } from "../services/errores.js";
import { lanzarConfeti } from "../utils/confeti.js";

export default function PagoCorrecto() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const celebrado = useRef(false);

  useEffect(() => {
    let vigente = true;
    boletasService.obtener(id)
      .then((b) => { if (vigente) setOrden(desdeBoleta(b)); })
      .catch((e) => {
        const n = normalizarError(e);
        if (vigente && n.status !== 404) setError(n.status === 403 ? "No tienes permiso para ver esta compra." : n.mensaje);
      })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [id]);

  // Confeti al llegar a la vista (una sola vez, aunque React ejecute el efecto dos veces en desarrollo).
  useEffect(() => {
    if (orden && !celebrado.current) {
      celebrado.current = true;
      lanzarConfeti();
    }
  }, [orden]);

  if (cargando) return <main className="container py-5 text-center">Cargando tu compra...</main>;

  if (error) {
    return <MensajeVacio titulo="No pudimos mostrar la compra" texto={error} enlace="/" textoEnlace="Volver al inicio" />;
  }

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
