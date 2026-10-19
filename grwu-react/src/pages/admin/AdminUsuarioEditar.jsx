// AdminUsuarioEditar.jsx - Edición de usuario (ruta /admin/usuarios/:run/editar).
// Autor: completado para la Evaluación 2
//
// El RUN no se cambia (es la llave); la contraseña solo se actualiza si se escribe
// una nueva en el formulario.

import { Link, useParams } from "react-router-dom";
import FormUsuario from "./FormUsuario.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { actualizarUsuario, obtenerUsuario } from "../../data/usuariosData.js";

export default function AdminUsuarioEditar() {
  const { run } = useParams();
  const usuario = obtenerUsuario(decodeURIComponent(run));

  if (!usuario) {
    return (
      <MensajeVacio titulo="Usuario no encontrado" texto={`No existe un usuario con RUN ${run}.`}
        enlace="/admin/usuarios" textoEnlace="Volver a Usuarios" />
    );
  }

  return (
    <div>
      <p className="mb-3"><Link to="/admin/usuarios" className="text-decoration-none">← Volver a Usuarios</Link></p>
      <FormUsuario
        titulo={`Editar: ${usuario.nombre} ${usuario.apellidos}`}
        usuarioIncial={usuario}
        textoBoton="Guardar cambios"
        onGuardar={(cambios) => actualizarUsuario(usuario.run, cambios)}
      />
    </div>
  );
}
