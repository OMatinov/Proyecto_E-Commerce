// AdminUsuarios.jsx - Listado de usuarios del sistema con acciones CRUD.
// Autor: César (datos) / completado para la Evaluación 2
//
// Solo administradores y vendedores gestionan usuarios desde el panel.
// La contraseña nunca se muestra: usuariosData la deja fuera al listar.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eliminarUsuario, listarUsuarios } from "../../data/usuariosData.js";
import { formatearFecha } from "../../utils/formatos.js";

const BADGE_TIPO = { Administrador: "bg-primary", Vendedor: "bg-info text-dark", Cliente: "bg-secondary" };

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const usuarios = useMemo(() => listarUsuarios(), [version]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");

  const filtrados = usuarios.filter((u) => {
    if (tipo && u.tipoUsuario !== tipo) return false;
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return `${u.nombre} ${u.apellidos} ${u.correo} ${u.run}`.toLowerCase().includes(q);
  });

  const manejarEliminar = (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos} (${u.run})?`)) return;
    eliminarUsuario(u.run);
    setVersion((v) => v + 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Usuarios</h1>
          <p className="text-muted mb-0">{filtrados.length} de {usuarios.length} usuarios</p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn btn-dark">+ Nuevo usuario</Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input type="search" className="form-control" placeholder="Buscar por nombre, correo o RUN…"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Filtrar por tipo">
            <option value="">Todos los tipos</option>
            <option value="Administrador">Administradores</option>
            <option value="Vendedor">Vendedores</option>
            <option value="Cliente">Clientes</option>
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>RUN</th><th>Nombre completo</th><th>Correo</th><th>Tipo</th>
                <th>Región / Comuna</th><th>Nacimiento</th><th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No hay usuarios que coincidan.</td></tr>
              ) : filtrados.map((u) => (
                <tr key={u.run}>
                  <td className="fw-bold">{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td><span className={`badge ${BADGE_TIPO[u.tipoUsuario] ?? "bg-secondary"}`}>{u.tipoUsuario}</span></td>
                  <td className="small">{u.comuna || "—"}{u.region ? ` · ${u.region}` : ""}</td>
                  <td className="small">{u.fechaNacimiento ? formatearFecha(u.fechaNacimiento) : "—"}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button type="button" className="btn btn-outline-dark" onClick={() => navigate(`/admin/usuarios/${u.run}/editar`)}>Editar ✏️</button>
                      <button type="button" className="btn btn-outline-danger" onClick={() => manejarEliminar(u)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
