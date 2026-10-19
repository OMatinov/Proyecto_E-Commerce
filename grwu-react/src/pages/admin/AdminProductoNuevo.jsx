// AdminProductoNuevo.jsx - Alta de producto en el panel admin.
// Autor: Matías

import FormProducto from "./FormProducto.jsx";
import { crearProducto } from "../../data/productosData.js";

export default function AdminProductoNuevo() {
  return (
    <FormProducto
      titulo="Nuevo producto"
      textoBoton="Guardar producto"
      onGuardar={(datos) => crearProducto(datos)}
    />
  );
}
