// AdminUsuarioEditar.jsx - Admin: editar un usuario existente (/admin/usuarios/:id/editar).
// Autor: César
//
// El :id de la URL es el RUN. El RUN no se puede cambiar (es la llave del usuario).
// La contraseña es opcional: si se deja vacía se conserva la actual.
// Si el administrador se edita a sí mismo se usa actualizarPerfil() del contexto
// para que la sesión también quede al día.

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormularioUsuario from "../../components/FormularioUsuario.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { actualizarUsuario, obtenerUsuario } from "../../data/usuariosData.js";
import { validarEdicionUsuario } from "../../utils/formularios.js";

function valoresDesde(u) {
  return {
    run: u.run, nombre: u.nombre ?? "", apellidos: u.apellidos ?? "", correo: u.correo ?? "",
    telefono: u.telefono ?? "", tipoUsuario: u.tipoUsuario ?? "Cliente",
    region: u.region ?? "", comuna: u.comuna ?? "", clave: "", clave2: ""
  };
}

export default function AdminUsuarioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion, actualizarPerfil } = useSesion();
  const existente = obtenerUsuario(id);
  const [valores, setValores] = useState(() => (existente ? valoresDesde(existente) : null));
  const [errores, setErrores] = useState({});

  if (!existente || !valores) {
    return (
      <div className="p-4">
        <MensajeVacio titulo="Usuario no encontrado" texto="No existe un usuario con ese RUN."
          enlace="/admin/usuarios" textoEnlace="Volver a usuarios" />
      </div>
    );
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "region") setValores({ ...valores, region: value, comuna: "" });
    else setValores({ ...valores, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const erroresNuevos = validarEdicionUsuario(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const { run: _run, clave2: _clave2, clave, ...cambios } = valores;
    if (clave) cambios.clave = clave;

    if (sesion?.run === existente.run) {
      const res = actualizarPerfil(cambios);
      if (!res.ok) { setErrores({ correo: res.mensaje }); return; }
    } else {
      try {
        actualizarUsuario(existente.run, cambios);
      } catch (err) {
        setErrores({ correo: err.message });
        return;
      }
    }
    navigate("/admin/usuarios");
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-1">Editar usuario</h1>
      <p className="text-muted mb-4">RUN {existente.run}</p>
      <form onSubmit={manejarEnvio} noValidate style={{ maxWidth: 900 }}>
        <FormularioUsuario valores={valores} errores={errores} onChange={manejarCambio}
          runEditable={false} claveOpcional />
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
