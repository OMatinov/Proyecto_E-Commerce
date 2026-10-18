// Login.jsx - Vista "Iniciar sesión" (tienda).
// Autor: César
//
// Estado propio: valores del formulario, errores por campo y error general de credenciales.
// Al entrar bien: administradores van al panel (rutaAdmin), el resto a la tienda (rutaInicio).

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { validarLogin } from "../utils/formularios.js";

export default function Login({ rutaInicio = "/", rutaAdmin = "/admin" }) {
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState({ correo: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const manejarCambio = (e) => {
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setErrorGeneral("");
    const erroresNuevos = validarLogin(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const resultado = iniciarSesion(valores.correo, valores.clave);
    if (!resultado.ok) {
      setErrorGeneral(resultado.mensaje);
      return;
    }
    navigate(resultado.usuario.tipoUsuario === "Administrador" ? rutaAdmin : rutaInicio);
  };

  return (
    <main className="container py-5" style={{ maxWidth: 440 }}>
      <h1 className="h3 mb-4">Inicia sesión en tu cuenta</h1>
      <form onSubmit={manejarEnvio} noValidate>
        <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" placeholder="tu@correo.com"
          value={valores.correo} onChange={manejarCambio} error={errores.correo} />
        <CampoFormulario id="clave" etiqueta="Contraseña" type="password"
          value={valores.clave} onChange={manejarCambio} error={errores.clave} />

        {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

        <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
      </form>
      <p className="mt-3 mb-1">¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>.</p>
      <p><Link to="/recuperar-clave">¿Olvidaste tu contraseña?</Link></p>
    </main>
  );
}
