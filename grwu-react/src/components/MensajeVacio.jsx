// MensajeVacio.jsx - Aviso con enlace, para pantallas sin contenido
// (carrito vacío, orden no encontrada...).
// Autor: César

import { Link } from "react-router-dom";

export default function MensajeVacio({ titulo, texto, enlace, textoEnlace }) {
  return (
    <div className="text-center py-5">
      <h1 className="h4">{titulo}</h1>
      <p className="text-muted">{texto}</p>
      <Link to={enlace} className="btn btn-primary">{textoEnlace}</Link>
    </div>
  );
}
