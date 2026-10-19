// AdminProductoEditar.jsx - Edición de producto (ruta /admin/productos/:id/editar).
// Autor: Matías

import { Link, useParams } from "react-router-dom";
import FormProducto from "./FormProducto.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { actualizarProducto, obtenerProducto } from "../../data/productosData.js";

export default function AdminProductoEditar() {
  const { id } = useParams();
  const producto = obtenerProducto(id);

  if (!producto) {
    return (
      <MensajeVacio titulo="Producto no encontrado" texto={`No existe el producto "${id}".`}
        enlace="/admin/productos" textoEnlace="Volver a Productos" />
    );
  }

  return (
    <div>
      <p className="mb-3"><Link to="/admin/productos" className="text-decoration-none">← Volver a Productos</Link></p>
      <FormProducto
        titulo={`Editar: ${producto.nombre}`}
        productoIncial={producto}
        textoBoton="Guardar cambios"
        onGuardar={(datos) => actualizarProducto(producto.id, datos)}
      />
    </div>
  );
}
