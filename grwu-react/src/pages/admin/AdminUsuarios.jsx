// AdminUsuarios.jsx - Admin: listado de usuarios ("Mostrar usuarios").
// Autor: César
//
// Estado propio: la lista de usuarios (se recarga desde usuariosData tras eliminar).
// No permite que el administrador elimine su propia cuenta.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useSesion } from "../../context/SesionContext.jsx";
import { listarUsuarios, eliminarUsuario } from "../../data/usuariosData.js";

export default function AdminUsuarios() {
  const { usuario: sesion } = useSesion();
  const [usuarios, setUsuarios] = useState(listarUsuarios);

  const borrar = (run, nombre) => {
    if (!window.confirm(`¿Eliminar al usuario "${nombre}"?`)) return;
    eliminarUsuario(run);
    setUsuarios(listarUsuarios());
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th></th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className="badge bg-secondary">{u.tipoUsuario}</span></td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${u.run}/historial`} className="btn btn-sm btn-outline-secondary me-2">Historial</Link>
                  <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button type="button" className="btn btn-sm btn-outline-danger"
                    disabled={u.run === sesion?.run}
                    title={u.run === sesion?.run ? "No puedes eliminar tu propia cuenta" : undefined}
                    onClick={() => borrar(u.run, u.nombre)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
