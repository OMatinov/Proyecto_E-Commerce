// AdminCategoriaEditar.jsx - Edición de categoría (ruta /admin/categorias/:id/editar).
// Autor: Matías

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { actualizarCategoria, generarSlug, obtenerCategoria } from "../../data/productosData.js";

export default function AdminCategoriaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = obtenerCategoria(id);
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [errores, setErrores] = useState({});

  if (!categoria) {
    return (
      <MensajeVacio titulo="Categoría no encontrada" texto={`No existe la categoría "${id}".`}
        enlace="/admin/categorias" textoEnlace="Volver a Categorías" />
    );
  }

  const manejarEnvio = (e) => {
    e.preventDefault();
    const err = {};
    if (!nombre.trim()) err.nombre = "El nombre es obligatorio.";
    else if (nombre.length > 50) err.nombre = "Máximo 50 caracteres.";
    setErrores(err);
    if (Object.keys(err).length > 0) return;
    try {
      actualizarCategoria(categoria.id, { nombre: nombre.trim(), slug: generarSlug(nombre) });
      navigate("/admin/categorias");
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <p className="mb-3"><Link to="/admin/categorias" className="text-decoration-none">← Volver a Categorías</Link></p>
      <h1 className="h2 fw-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Editar categoría</h1>
      <form onSubmit={manejarEnvio} noValidate>
        {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}
        <CampoFormulario id="nombre" etiqueta="Nombre *" value={nombre}
          onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />
        <p className="small text-muted">Vista previa URL: <code>/categorias/{generarSlug(nombre)}</code></p>
        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-dark px-4">Guardar cambios</button>
          <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
