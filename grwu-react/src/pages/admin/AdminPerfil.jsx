// AdminPerfil.jsx - Admin: perfil del usuario con sesión iniciada.
// Autor: César
//
// Dos formularios: datos de contacto (PUT /usuarios/me) y cambio de contraseña (PUT /usuarios/me/clave,
// que exige la contraseña actual). Guarda con actualizarPerfil() del SesionContext,
// así el nombre del panel se actualiza al instante.

import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { validarPerfil, validarNuevaClave } from "../../utils/formularios.js";

export default function AdminPerfil() {
  const { usuario, actualizarPerfil, cambiarClave } = useSesion();
  const [valores, setValores] = useState(() => ({
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    correo: usuario?.correo ?? "",
    telefono: usuario?.telefono ?? ""
  }));
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [claves, setClaves] = useState({ claveActual: "", clave: "", clave2: "" });
  const [erroresClave, setErroresClave] = useState({});
  const [okClave, setOkClave] = useState("");
  const [errorClave, setErrorClave] = useState("");

  if (!usuario) return <div className="p-4"><h1 className="h3">Sin sesión activa</h1></div>;

  const manejarCambio = (e) => {
    setOk("");
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setOk("");
    setErrorGeneral("");
    const erroresNuevos = validarPerfil(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    setEnviando(true);
    const res = await actualizarPerfil({
      nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(), telefono: valores.telefono.trim()
    });
    setEnviando(false);
    if (!res.ok) {
      if (res.errores) setErrores(res.errores);
      else if (res.status === 409) setErrores({ correo: res.mensaje });
      else setErrorGeneral(res.mensaje);
      return;
    }
    setErrores({});
    setOk("Datos actualizados correctamente.");
  };

  const manejarCambioClave = (e) => {
    setOkClave("");
    setClaves({ ...claves, [e.target.name]: e.target.value });
  };

  const manejarEnvioClave = async (e) => {
    e.preventDefault();
    setOkClave("");
    setErrorClave("");
    const erroresNuevos = validarNuevaClave(claves);
    if (!claves.claveActual) erroresNuevos.claveActual = "Ingresa tu contraseña actual.";
    setErroresClave(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const res = await cambiarClave(claves.claveActual, claves.clave);
    if (!res.ok) {
      if (res.errores) setErroresClave(res.errores);
      else setErrorClave(res.mensaje);
      return;
    }
    setClaves({ claveActual: "", clave: "", clave2: "" });
    setErroresClave({});
    setOkClave("Contraseña actualizada correctamente.");
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-1">Mi perfil</h1>
      <p className="text-muted mb-4">{usuario.tipoUsuario} · RUN {usuario.run}</p>
      {ok && <div className="alert alert-success" role="status">{ok}</div>}
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
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
          <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? "Guardando..." : "Actualizar"}</button>
        </div>
      </form>

      <hr className="my-4" style={{ maxWidth: 700 }} />

      <h2 className="h5 mb-3">Cambiar contraseña</h2>
      {okClave && <div className="alert alert-success" role="status">{okClave}</div>}
      {errorClave && <div className="alert alert-danger" role="alert">{errorClave}</div>}
      <form onSubmit={manejarEnvioClave} noValidate className="row g-3" style={{ maxWidth: 700 }}>
        <div className="col-12">
          <CampoFormulario id="claveActual" etiqueta="Contraseña actual" type="password"
            value={claves.claveActual} onChange={manejarCambioClave} error={erroresClave.claveActual} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="clave" etiqueta="Contraseña nueva" type="password"
            value={claves.clave} onChange={manejarCambioClave} error={erroresClave.clave || erroresClave.claveNueva} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="clave2" etiqueta="Confirmar contraseña nueva" type="password"
            value={claves.clave2} onChange={manejarCambioClave} error={erroresClave.clave2} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-outline-primary">Cambiar contraseña</button>
        </div>
      </form>
    </div>
  );
}
