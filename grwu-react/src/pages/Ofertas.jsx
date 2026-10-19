// Ofertas.jsx - Productos con descuento (descuento > 0).
// Autor: Matías

import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import MensajeVacio from "../components/MensajeVacio.jsx";
import { formatearCLP } from "../data/carritoData.js";
import { precioConDescuento, productosEnOferta } from "../data/productosData.js";

export default function Ofertas() {
  const ofertas = productosEnOferta();

  if (ofertas.length === 0) {
    return (
      <MensajeVacio titulo="No hay ofertas activas" texto="Vuelve pronto, estamos preparando algo especial."
        enlace="/productos" textoEnlace="Ver catálogo" />
    );
  }

  const ahorroMaximo = Math.max(...ofertas.map((p) => p.precio - precioConDescuento(p)));

  return (
    <main className="container py-4">
      <div className="p-4 mb-4 rounded text-center text-white" style={{ background: "linear-gradient(90deg, #dc3545, #6f42c1)" }}>
        <h1 className="display-5 fw-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>🔥 Ofertas GRWU</h1>
        <p className="mb-0">Hasta {formatearCLP(ahorroMaximo)} de ahorro en las prendas seleccionadas.</p>
      </div>
      <div className="row g-4">
        {ofertas.map((p) => (
          <div key={p.id} className="col-6 col-md-4 col-lg-3">
            <ProductoCard producto={p} precioFinal={precioConDescuento(p)} />
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <Link to="/productos" className="btn btn-outline-dark rounded-pill px-4">Ver todo el catálogo</Link>
      </div>
    </main>
  );
}
