// RecuperarClave.jsx - Vista "Recuperar contraseña" (tienda).
// Autor: César
//
// Como no hay backend ni envío de correos, el flujo se simula en 2 pasos:
//   1. El usuario escribe su correo -> se valida el formato y que exista una cuenta.
//   2. Escribe la nueva contraseña y su confirmación -> se guarda con restablecerClave().
// Al terminar muestra un aviso de éxito con enlace al login.
// Estado propio: paso actual, valores, errores y mensaje de éxito.

import { useState } from "react";
import { Link } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { obtenerUsuarioPorCorreo, restablecerClave } from "../data/usuariosData.js";
import { validarCorreo } from "../utils/validaciones.js";
import { validarNuevaClave } from "../utils/formularios.js";

export default function RecuperarClave() {
  const [paso, setPaso] = useState(1);
  const [valores, setValores] = useState({ correo: "", clave: "", clave2: "" });
  const [errores, setErrores] = useState({});
  const [listo, setListo] = useState(false);

  const manejarCambio = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  const enviarCorreo = (e) => {
    e.preventDefault();
    const c = validarCorreo(valores.correo);
    if (!c.valido) { setErrores({ correo: c.mensaje }); return; }
    if (!obtenerUsuarioPorCorreo(valores.correo)) {
      setErrores({ correo: "No existe una cuenta con ese correo." });
      return;
    }
    setErrores({});
    setPaso(2);
  };

  const guardarClave = (e) => {
    e.preventDefault();
    const erroresNuevos = validarNuevaClave(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;
    restablecerClave(valores.correo, valores.clave);
    setListo(true);
  };

  if (listo) {
    return (
      <main className="container py-5" style={{ maxWidth: 440 }}>
        <div className="alert alert-success" role="status">Tu contraseña fue actualizada correctamente.</div>
        <Link to="/login" className="btn btn-primary w-100">Ir a iniciar sesión</Link>
      </main>
    );
  }

  return (
    <main className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h3 mb-2">Recuperar contraseña</h1>
      {paso === 1 ? (
        <form onSubmit={enviarCorreo} noValidate>
          <p className="text-muted">Escribe el correo de tu cuenta para crear una nueva contraseña.</p>
          <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" placeholder="tu@correo.com"
            value={valores.correo} onChange={manejarCambio} error={errores.correo} />
          <button type="submit" className="btn btn-primary w-100">Continuar</button>
        </form>
      ) : (
        <form onSubmit={guardarClave} noValidate>
          <p className="text-muted">Cuenta: <strong>{valores.correo}</strong></p>
          <CampoFormulario id="clave" etiqueta="Nueva contraseña" type="password"
            value={valores.clave} onChange={manejarCambio} error={errores.clave} />
          <CampoFormulario id="clave2" etiqueta="Confirmar nueva contraseña" type="password"
            value={valores.clave2} onChange={manejarCambio} error={errores.clave2} />
          <button type="submit" className="btn btn-primary w-100">Guardar contraseña</button>
        </form>
      )}
      <p className="mt-3"><Link to="/login">Volver a iniciar sesión</Link></p>
    </main>
  );
}
