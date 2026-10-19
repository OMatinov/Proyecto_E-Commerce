// AdminCategoriaNueva.jsx - Alta de categoría en el panel admin.
// Autor: Matías

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { crearCategoria, generarSlug } from "../../data/productosData.js";

export default function AdminCategoriaNueva() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [errores, setErrores] = useState({});

  const manejarEnvio = (e) => {
    e.preventDefault();
    const err = {};
    if (!nombre.trim()) err.nombre = "El nombre es obligatorio.";
    else if (nombre.length > 50) err.nombre = "Máximo 50 caracteres.";
    setErrores(err);
    if (Object.keys(err).length > 0) return;
    try {
      crearCategoria({ nombre, slug: generarSlug(nombre) });
      navigate("/admin/categorias");
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 className="h2 fw-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Nueva categoría</h1>
      <p className="text-muted">El slug se genera automáticamente desde el nombre.</p>
      <form onSubmit={manejarEnvio} noValidate>
        {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}
        <CampoFormulario id="nombre" etiqueta="Nombre *" placeholder="Ej: Vestidos de noche"
          value={nombre} onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />
        {nombre && <p className="small text-muted">Vista previa URL: <code>/categorias/{generarSlug(nombre)}</code></p>}
        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-dark px-4">Guardar categoría</button>
          <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
