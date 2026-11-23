// AdminUsuarioEditar.jsx - Admin: editar un usuario existente (/admin/usuarios/:id/editar).
// Autor: César
//
// El :id de la URL es el RUN. El RUN no se puede cambiar (es la llave del usuario).
// La contraseña es opcional: si se deja vacía se conserva la actual.
// Si el administrador se edita a sí mismo se vuelve a leer su perfil (recargarUsuario) para que la sesión quede al día.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormularioUsuario from "../../components/FormularioUsuario.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { aSolicitudUsuario } from "../../services/adapters.js";
import { normalizarError, repartirError } from "../../services/errores.js";
import usuariosService from "../../services/usuarios.js";
import { validarEdicionUsuario } from "../../utils/formularios.js";

function valoresDesde(u) {
  return {
    run: u.run, nombre: u.nombre ?? "", apellidos: u.apellidos ?? "", correo: u.correo ?? "",
    telefono: u.telefono ?? "", tipoUsuario: u.tipoUsuario ?? "Cliente",
    fechaNacimiento: u.fechaNacimiento ?? "", direccion: u.direccion ?? "",
    region: u.region ?? "", comuna: u.comuna ?? "", clave: "", clave2: ""
  };
}

export default function AdminUsuarioEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion, recargarUsuario } = useSesion();
  const [valores, setValores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let vigente = true;
    usuariosService.obtener(id)
      .then((u) => { if (vigente) setValores(valoresDesde(u)); })
      .catch((e) => {
        const n = normalizarError(e);
        if (vigente && n.status !== 404) setErrorCarga(n.mensaje);
      })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [id]);

  if (cargando) return <div className="p-4">Cargando usuario...</div>;

  if (errorCarga) return <div className="p-4"><div className="alert alert-danger" role="alert">{errorCarga}</div></div>;

  if (!valores) {
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

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorGeneral("");
    const erroresNuevos = validarEdicionUsuario(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    setEnviando(true);
    try {
      await usuariosService.actualizar(valores.run, aSolicitudUsuario({ ...valores, run: undefined }));
      if (sesion?.run === valores.run) await recargarUsuario();
      navigate("/admin/usuarios");
    } catch (err) {
      const { campos, general } = repartirError(normalizarError(err));
      setErrores(campos);
      setErrorGeneral(general);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-1">Editar usuario</h1>
      <p className="text-muted mb-4">RUN {valores.run}</p>
      <form onSubmit={manejarEnvio} noValidate style={{ maxWidth: 900 }}>
        <FormularioUsuario valores={valores} errores={errores} onChange={manejarCambio}
          runEditable={false} claveOpcional />
        {errorGeneral && <div className="alert alert-danger mt-3" role="alert">{errorGeneral}</div>}
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? "Guardando..." : "Guardar cambios"}</button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
