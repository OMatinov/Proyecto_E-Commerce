// AdminUsuarioNuevo.jsx - Admin: crear un usuario con cualquier tipo (Cliente, Vendedor, Administrador).
// Autor: César
//
// Estado propio: valores del formulario, errores por campo y mensaje general.
// Reutiliza validarRegistro (las mismas reglas que el registro público).
// crearUsuario lanza Error si el RUN o el correo ya existen; aquí se captura y se muestra en el campo.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioUsuario from "../../components/FormularioUsuario.jsx";
import { crearUsuario } from "../../data/usuariosData.js";
import { validarRegistro } from "../../utils/formularios.js";
import { limpiarRun } from "../../utils/validaciones.js";

const VACIO = {
  run: "", nombre: "", apellidos: "", correo: "", telefono: "",
  tipoUsuario: "Cliente", region: "", comuna: "", clave: "", clave2: ""
};

export default function AdminUsuarioNuevo() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(VACIO);
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
    try {
      crearUsuario({ ...datos, run: limpiarRun(datos.run) });
      navigate("/admin/usuarios");
    } catch (err) {
      const campo = err.message.includes("RUN") ? "run" : "correo";
      setErrores({ [campo]: err.message });
    }
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Nuevo usuario</h1>
      <form onSubmit={manejarEnvio} noValidate style={{ maxWidth: 900 }}>
        <FormularioUsuario valores={valores} errores={errores} onChange={manejarCambio} />
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/usuarios")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
