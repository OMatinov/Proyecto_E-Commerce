// FormularioUsuario.jsx - Campos de usuario compartidos por "Nuevo usuario" y "Editar usuario" (admin).
// Autor: César
//
// No guarda estado: recibe `valores`, `errores` y `onChange` del padre (props controladas).
// Props:
//   valores, errores, onChange -> estado del formulario (onChange recibe el evento nativo)
//   runEditable                -> false en edición (el RUN es la llave y no se cambia)
//   claveOpcional              -> true en edición (vacía = conservar la contraseña actual)

import CampoFormulario from "./CampoFormulario.jsx";
import { REGIONES, comunasDeRegion } from "../data/regiones.js";

export const TIPOS_USUARIO = ["Cliente", "Vendedor", "Administrador"];

export default function FormularioUsuario({ valores, errores, onChange, runEditable = true, claveOpcional = false }) {
  const opcionesRegion = REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre }));
  const opcionesComuna = comunasDeRegion(valores.region).map((c) => ({ valor: c, texto: c }));
  const opcionesTipo = TIPOS_USUARIO.map((t) => ({ valor: t, texto: t }));
  const sufijoClave = claveOpcional ? " (dejar vacía para conservar)" : "";

  return (
    <div className="row g-3">
      <div className="col-md-4">
        <CampoFormulario id="run" etiqueta="RUN" maxLength={9} value={valores.run} onChange={onChange}
          error={errores.run} disabled={!runEditable} />
      </div>
      <div className="col-md-4">
        <CampoFormulario id="nombre" etiqueta="Nombre" maxLength={50} value={valores.nombre} onChange={onChange} error={errores.nombre} />
      </div>
      <div className="col-md-4">
        <CampoFormulario id="apellidos" etiqueta="Apellidos" maxLength={100} value={valores.apellidos} onChange={onChange} error={errores.apellidos} />
      </div>
      <div className="col-md-6">
        <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" maxLength={100}
          value={valores.correo} onChange={onChange} error={errores.correo} />
      </div>
      <div className="col-md-6">
        <CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" type="tel" value={valores.telefono} onChange={onChange} error={errores.telefono} />
      </div>
      <div className="col-md-4">
        <CampoFormulario id="tipoUsuario" etiqueta="Tipo de usuario" opciones={opcionesTipo} placeholderOpcion={null}
          value={valores.tipoUsuario} onChange={onChange} />
      </div>
      <div className="col-md-4">
        <CampoFormulario id="region" etiqueta="Región" opciones={opcionesRegion} placeholderOpcion="-- Seleccione la región --"
          value={valores.region} onChange={onChange} error={errores.region} />
      </div>
      <div className="col-md-4">
        <CampoFormulario id="comuna" etiqueta="Comuna" opciones={opcionesComuna} placeholderOpcion="-- Seleccione la comuna --"
          value={valores.comuna} onChange={onChange} error={errores.comuna} disabled={!valores.region} />
      </div>
      <div className="col-md-6">
        <CampoFormulario id="clave" etiqueta={`Contraseña${sufijoClave}`} type="password"
          value={valores.clave} onChange={onChange} error={errores.clave} />
      </div>
      <div className="col-md-6">
        <CampoFormulario id="clave2" etiqueta="Confirmar contraseña" type="password"
          value={valores.clave2} onChange={onChange} error={errores.clave2} />
      </div>
    </div>
  );
}
