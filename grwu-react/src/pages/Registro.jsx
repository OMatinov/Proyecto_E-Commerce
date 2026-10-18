// Registro.jsx - Vista "Crea tu cuenta" (tienda).
// Autor: César
//
// Estado propio: valores del formulario y errores por campo.
// Al cambiar la región se vacía la comuna y se recalculan las comunas disponibles.
// Si el RUN o el correo ya existen, el mensaje viene desde usuariosData (vía el contexto).

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { REGIONES, comunasDeRegion } from "../data/regiones.js";
import { validarRegistro } from "../utils/formularios.js";
import { limpiarRun } from "../utils/validaciones.js";

const VALORES_INICIALES = {
  run: "", nombre: "", apellidos: "", correo: "", telefono: "",
  region: "", comuna: "", clave: "", clave2: ""
};

export default function Registro({ rutaInicio = "/" }) {
  const { registrar } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "region") setValores({ ...valores, region: value, comuna: "" });
    else setValores({ ...valores, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const erroresNuevos = validarRegistro(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    const { clave2: _clave2, ...datos } = valores;
    const resultado = registrar({ ...datos, run: limpiarRun(datos.run) });
    if (!resultado.ok) {
      // Los únicos fallos posibles son RUN o correo duplicados.
      const campo = resultado.mensaje.includes("RUN") ? "run" : "correo";
      setErrores({ [campo]: resultado.mensaje });
      return;
    }
    navigate(rutaInicio);
  };

  const opcionesRegion = REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre }));
  const opcionesComuna = comunasDeRegion(valores.region).map((c) => ({ valor: c, texto: c }));

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-4">Crea tu cuenta</h1>
      <form onSubmit={manejarEnvio} noValidate>
        <CampoFormulario id="run" etiqueta="RUN" placeholder="190110222" maxLength={9}
          value={valores.run} onChange={manejarCambio} error={errores.run} />
        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="nombre" etiqueta="Nombre" maxLength={50}
              value={valores.nombre} onChange={manejarCambio} error={errores.nombre} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="apellidos" etiqueta="Apellidos" maxLength={100}
              value={valores.apellidos} onChange={manejarCambio} error={errores.apellidos} />
          </div>
        </div>
        <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" placeholder="tu@correo.com" maxLength={100}
          value={valores.correo} onChange={manejarCambio} error={errores.correo} />
        <CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" type="tel" placeholder="+56 9 1234 5678"
          value={valores.telefono} onChange={manejarCambio} error={errores.telefono} />
        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="region" etiqueta="Región" opciones={opcionesRegion} placeholderOpcion="-- Seleccione la región --"
              value={valores.region} onChange={manejarCambio} error={errores.region} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="comuna" etiqueta="Comuna" opciones={opcionesComuna} placeholderOpcion="-- Seleccione la comuna --"
              value={valores.comuna} onChange={manejarCambio} error={errores.comuna} disabled={!valores.region} />
          </div>
        </div>
        <CampoFormulario id="clave" etiqueta="Contraseña" type="password"
          value={valores.clave} onChange={manejarCambio} error={errores.clave} />
        <CampoFormulario id="clave2" etiqueta="Confirmar contraseña" type="password"
          value={valores.clave2} onChange={manejarCambio} error={errores.clave2} />

        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
      </form>
      <p className="mt-3">¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.</p>
    </main>
  );
}
