// AdminUsuarioNuevo.jsx - Alta de usuario desde el panel admin.
// Autor: completado para la Evaluación 2

import FormUsuario from "./FormUsuario.jsx";
import { crearUsuario } from "../../data/usuariosData.js";

export default function AdminUsuarioNuevo() {
  return (
    <FormUsuario
      titulo="Nuevo usuario"
      textoBoton="Guardar usuario"
      onGuardar={(datos) => crearUsuario(datos)}
    />
  );
}
