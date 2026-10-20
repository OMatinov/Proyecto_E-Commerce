import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listarUsuarios, eliminarUsuario } from '../../data/usuariosData';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(listarUsuarios());

  const borrar = (run, nombre) => {
    if (!window.confirm(`¿Eliminar usuario "${nombre}"?`)) return;
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
            <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th></th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombres} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className="badge bg-secondary">{u.rol}</span></td>
                <td className="text-end">
                  <Link to={`/admin/usuarios/${u.run}/historial`}
                        className="btn btn-sm btn-outline-secondary me-2">Historial</Link>
                  <Link to={`/admin/usuarios/${u.run}/editar`}
                        className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-outline-danger"
                          onClick={() => borrar(u.run, u.nombres)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}