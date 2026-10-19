// FormUsuario.jsx - Formulario compartido para crear/editar usuarios (admin).
// Autor: completado para la Evaluación 2
//
// Reutiliza las validaciones de formularios.js (mismas reglas que el registro
// público) y delega el guardado a AdminUsuarioNuevo / AdminUsuarioEditar.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { REGIONES, comunasDeRegion } from "../../data/regiones.js";
import { limpiarRun } from "../../utils/validaciones.js";

const OPCIONES_TIPO = [
  { valor: "Cliente", texto: "Cliente" },
  { valor: "Vendedor", texto: "Vendedor" },
  { valor: "Administrador", texto: "Administrador" },
];

export default function FormUsuario({ titulo, usuarioIncial, textoBoton, onGuardar }) {
  const navigate = useNavigate();
  const [valores, setValores] = useState({
    run: usuarioIncial?.run ?? "",
    nombre: usuarioIncial?.nombre ?? "",
    apellidos: usuarioIncial?.apellidos ?? "",
    correo: usuarioIncial?.correo ?? "",
    telefono: usuarioIncial?.telefono ?? "",
    fechaNacimiento: usuarioIncial?.fechaNacimiento ?? "",
    region: usuarioIncial?.region ?? "",
    comuna: usuarioIncial?.comuna ?? "",
    direccion: usuarioIncial?.direccion ?? "",
    tipoUsuario: usuarioIncial?.tipoUsuario ?? "Cliente",
    clave: "",
  });
  const [errores, setErrores] = useState({});

  const opcionesRegion = useMemo(() => REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre })), []);
  const opcionesComuna = useMemo(
    () => comunasDeRegion(valores.region).map((c) => ({ valor: c, texto: c })),
    [valores.region],
  );

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "region") setValores({ ...valores, region: value, comuna: "" });
    else setValores({ ...valores, [name]: value });
  };

  const validar = () => {
    const err = {};
    if (!limpiarRun(valores.run)) err.run = "El RUN es obligatorio.";
    else if (!usuarioIncial && !/^(\d{7,8}|[Kk]$)/.test(limpiarRun(valores.run))) err.run = "RUN con formato inválido.";
    if (!valores.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    if (!valores.apellidos.trim()) err.apellidos = "Los apellidos son obligatorios.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.correo.trim())) err.correo = "Correo con formato inválido.";
    if (valores.telefono && !/^\d{8,9}$/.test(valores.telefono.replace(/[\s.-]/g, ""))) err.telefono = "Teléfono de 8 a 9 dígitos.";
    if (!valores.fechaNacimiento) err.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!valores.region) err.region = "Selecciona una región.";
    if (!valores.comuna) err.comuna = "Selecciona una comuna.";
    if (!usuarioIncial && (valores.clave || "").length < 6) err.clave = "La contraseña debe tener al menos 6 caracteres.";
    return err;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    const datos = {
      run: limpiarRun(valores.run),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(),
      telefono: valores.telefono.trim(),
      fechaNacimiento: valores.fechaNacimiento,
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim(),
      tipoUsuario: valores.tipoUsuario,
    };
    if (valores.clave) datos.clave = valores.clave; // en edición solo se cambia si se escribió
    try {
      onGuardar(datos);
      navigate("/admin/usuarios");
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="h2 fw-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{titulo}</h1>
      <p className="text-muted">Las contraseñas se guardan cifradas; nunca se muestran en el panel.</p>

      <form onSubmit={manejarEnvio} noValidate>
        {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}

        <div className="row">
          <div className="col-md-4">
            <CampoFormulario id="run" etiqueta="RUN *" placeholder="190110222" maxLength={10}
              value={valores.run} onChange={manejarCambio} error={errores.run}
              disabled={Boolean(usuarioIncial)} />
          </div>
          <div className="col-md-8">
            <CampoFormulario id="tipoUsuario" etiqueta="Tipo de usuario" placeholderOpcion={null}
              opciones={OPCIONES_TIPO} value={valores.tipoUsuario} onChange={manejarCambio} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="nombre" etiqueta="Nombre *" value={valores.nombre}
              onChange={manejarCambio} error={errores.nombre} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="apellidos" etiqueta="Apellidos *" value={valores.apellidos}
              onChange={manejarCambio} error={errores.apellidos} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-7">
            <CampoFormulario id="correo" etiqueta="Correo electrónico *" type="email"
              value={valores.correo} onChange={manejarCambio} error={errores.correo} />
          </div>
          <div className="col-md-5">
            <CampoFormulario id="telefono" etiqueta="Teléfono" placeholder="912345678"
              value={valores.telefono} onChange={manejarCambio} error={errores.telefono} />
          </div>
        </div>

        <CampoFormulario id="fechaNacimiento" etiqueta="Fecha de nacimiento *" type="date"
          value={valores.fechaNacimiento} onChange={manejarCambio} error={errores.fechaNacimiento} />

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="region" etiqueta="Región" opciones={opcionesRegion}
              placeholderOpcion="-- Seleccione la región --" value={valores.region}
              onChange={manejarCambio} error={errores.region} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="comuna" etiqueta="Comuna" opciones={opcionesComuna}
              placeholderOpcion="-- Seleccione la comuna --" value={valores.comuna}
              onChange={manejarCambio} error={errores.comuna} disabled={!valores.region} />
          </div>
        </div>

        <CampoFormulario id="direccion" etiqueta="Dirección (calle y número)" placeholder="Av. Siempre Viva 742"
          value={valores.direccion} onChange={manejarCambio} />

        <CampoFormulario id="clave" etiqueta={usuarioIncial ? "Nueva contraseña (dejar vacío para mantener la actual)" : "Contraseña *"}
          type="password" value={valores.clave} onChange={manejarCambio} error={errores.clave} />

        <div className="d-flex gap-2 mt-2">
          <button type="submit" className="btn btn-dark px-4">{textoBoton}</button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
