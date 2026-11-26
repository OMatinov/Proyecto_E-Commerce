// AdminUsuarioNuevo.jsx - Admin: crear un usuario con cualquier tipo (Cliente, Vendedor, Administrador).
// Autor: César
//
// Estado propio: valores del formulario, errores por campo y mensaje general.
// Reutiliza validarRegistro (las mismas reglas que el registro público).
// Si el backend responde 400 (errores por campo) o 409 (RUN/correo duplicado), se muestra en el campo.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioUsuario from "../../components/FormularioUsuario.jsx";
import { aSolicitudUsuario } from "../../services/adaptadoresUsuario.js";
import { normalizarError, repartirError } from "../../services/errores.js";
import usuariosService from "../../services/usuarios.js";
import { validarRegistro } from "../../utils/formularios.js";

const VACIO = {
  run: "", nombre: "", apellidos: "", correo: "", telefono: "", fechaNacimiento: "", direccion: "",
  tipoUsuario: "Cliente", region: "", comuna: "", clave: "", clave2: ""
};

export default function AdminUsuarioNuevo() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "region") setValores({ ...valores, region: value, comuna: "" });
    else setValores({ ...valores, [name]: value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorGeneral("");
    const erroresNuevos = validarRegistro(valores);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    setEnviando(true);
    try {
      await usuariosService.crear(aSolicitudUsuario(valores));
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
      <h1 className="h3 mb-4">Nuevo usuario</h1>
      <form onSubmit={manejarEnvio} noValidate style={{ maxWidth: 900 }}>
        <FormularioUsuario valores={valores} errores={errores} onChange={manejarCambio} />
        {errorGeneral && <div className="alert alert-danger mt-3" role="alert">{errorGeneral}</div>}
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? "Guardando..." : "Guardar"}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/usuarios")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
