// AdminPerfil.jsx - Admin: perfil del usuario con sesión iniciada.
// Autor: César
//
// Estado propio: valores del formulario, errores y mensaje de éxito.
// Guarda con actualizarPerfil() del SesionContext, así el nombre del panel se actualiza al instante.

import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { validarPerfil } from "../../utils/formularios.js";

export default function AdminPerfil() {
  const { usuario, actualizarPerfil } = useSesion();
  const [valores, setValores] = useState(() => ({
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    correo: usuario?.correo ?? "",
    telefono: usuario?.telefono ?? ""
  }));
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState("");

  if (!usuario) return <div className="p-4"><h1 className="h3">Sin sesión activa</h1></div>;

  const manejarCambio = (e) => {
    setOk("");
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setOk("");
    const erroresNuevos = validarPerfil(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const res = actualizarPerfil({
      nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(), telefono: valores.telefono.trim()
    });
    if (!res.ok) { setErrores({ correo: res.mensaje }); return; }
    setOk("Datos actualizados correctamente.");
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-1">Mi perfil</h1>
      <p className="text-muted mb-4">{usuario.tipoUsuario} · RUN {usuario.run}</p>
      {ok && <div className="alert alert-success" role="status">{ok}</div>}
      <form onSubmit={manejarEnvio} noValidate className="row g-3" style={{ maxWidth: 700 }}>
        <div className="col-md-6">
          <CampoFormulario id="nombre" etiqueta="Nombre" value={valores.nombre} onChange={manejarCambio} error={errores.nombre} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="apellidos" etiqueta="Apellidos" value={valores.apellidos} onChange={manejarCambio} error={errores.apellidos} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" value={valores.correo} onChange={manejarCambio} error={errores.correo} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" type="tel" value={valores.telefono} onChange={manejarCambio} error={errores.telefono} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Actualizar</button>
        </div>
      </form>
    </div>
  );
}
