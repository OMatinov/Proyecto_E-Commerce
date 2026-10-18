// DemoInicio.jsx - Inicio con productos de ejemplo para poder probar el carrito.
// TEMPORAL: lo reemplazan Home / Productos de Matías.
// Lo importante: así se usa el carrito desde cualquier página -> useCarrito().agregar(producto)

import { useCarrito } from "../context/CarritoContext.jsx";
import { formatearCLP } from "../data/carritoData.js";
import { PRODUCTOS_DEMO } from "./productosDemo.js";

export default function DemoInicio() {
  const { agregar } = useCarrito();

  return (
    <main className="container py-4">
      <h1 className="h3 mb-1">Productos (demo)</h1>
      <p className="text-muted">Catálogo de ejemplo para probar el carrito. El real es el de Matías.</p>
      <div className="row g-3">
        {PRODUCTOS_DEMO.map((p) => (
          <div key={p.id} className="col-6 col-md-4 col-lg-2">
            <div className="card h-100">
              <img src={p.imagen} alt={p.nombre} className="card-img-top" style={{ aspectRatio: "3 / 4", objectFit: "cover" }} />
              <div className="card-body d-flex flex-column">
                <h2 className="h6">{p.nombre}</h2>
                <p className="fw-bold mb-2">{formatearCLP(p.precio)}</p>
                <button type="button" className="btn btn-sm btn-dark mt-auto" onClick={() => agregar(p)}>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
