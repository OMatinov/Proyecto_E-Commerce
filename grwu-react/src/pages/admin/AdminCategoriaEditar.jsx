import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  actualizarCategoria,
  obtenerCategoria,
} from '../../data/categoriasData';
import { listarPorCategoria } from '../../data/productosData';
import { validarCategoria, slugify } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

export default function AdminCategoriaEditar() {
  const { id } = useParams();
  const original = obtenerCategoria(id);
  const navigate = useNavigate();

  // Precarga inicial a partir de la categoría existente
  const [valores, setValores] = useState(() =>
    original
      ? {
          nombre: original.nombre || '',
          slug: original.slug || '',
          descripcion: original.descripcion || '',
          imagen: original.imagen || '',
        }
      : null
  );
  const [errores, setErrores] = useState({});
  const [slugBloqueado, setSlugBloqueado] = useState(true);

  // Renderizado condicional si el ID no existe (cubre el test de error)
  if (!original || !valores) {
    return (
      <div className="p-4">
        <h1 className="h3">Categoría no encontrada</h1>
        <p className="text-muted">El identificador {id} no coincide con ninguna categoría.</p>
        <Link to="/admin/categorias" className="btn btn-primary mt-3">
          Volver a categorías
        </Link>
      </div>
    );
  }

  const productosAsociados = listarPorCategoria(original.slug);

  const cambiar = (campo) => (e) => {
    const v = e.target.value;
    setValores((prev) => ({
      ...prev,
      [campo]: v,
      // Si el slug está desbloqueado, se regenera desde el nombre
      ...(campo === 'nombre' && !slugBloqueado ? { slug: slugify(v) } : {}),
    }));
  };

  const alternarSlug = () => {
    setSlugBloqueado((b) => {
      const nuevo = !b;
      // Al desbloquear, regeneramos el slug desde el nombre actual
      if (!nuevo) {
        setValores((prev) => ({ ...prev, slug: slugify(prev.nombre) }));
      }
      return nuevo;
    });
  };

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarCategoria(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    actualizarCategoria(id, valores);
    navigate('/admin/categorias');
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Editar categoría</h1>
        <Link to="/admin/categorias" className="btn btn-outline-secondary">
          ← Volver
        </Link>
      </div>

      {productosAsociados.length > 0 && (
        <div className="alert alert-warning">
          Esta categoría tiene <strong>{productosAsociados.length}</strong>{' '}
          producto(s) asociado(s). Cambiar el <code>slug</code> no actualiza
          automáticamente la categoría de esos productos.
        </div>
      )}

      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 700 }}>
        <div className="col-12">
          <CampoFormulario
            id="nombre"
            label="Nombre"
            value={valores.nombre}
            onChange={cambiar('nombre')}
            error={errores.nombre}
          />
        </div>

        <div className="col-12">
          <CampoFormulario
            id="slug"
            label="Slug (URL)"
            value={valores.slug}
            onChange={cambiar('slug')}
            error={errores.slug}
            disabled={slugBloqueado}
          />
          <div className="form-text d-flex justify-content-between align-items-center">
            <span>
              URL pública: <code>/categorias/{valores.slug || '...'}</code>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-link p-0"
              onClick={alternarSlug}
            >
              {slugBloqueado ? 'Desbloquear edición' : 'Autogenerar desde el nombre'}
            </button>
          </div>
        </div>

        <div className="col-12">
          <CampoFormulario
            id="descripcion"
            label="Descripción"
            value={valores.descripcion}
            onChange={cambiar('descripcion')}
          />
        </div>

        <div className="col-12">
          <CampoFormulario
            id="imagen"
            label="Ruta de imagen"
            value={valores.imagen}
            onChange={cambiar('imagen')}
            error={errores.imagen}
          />
        </div>

        {valores.imagen && (
          <div className="col-12">
            <p className="mb-1 small text-muted">Vista previa:</p>
            <img
              src={valores.imagen}
              alt="Vista previa"
              style={{ height: 120, objectFit: 'cover' }}
              className="rounded border"
              onError={(e) => { e.currentTarget.src = 'img/logoGRWU.png'; }}
            />
          </div>
        )}

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            Actualizar
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => navigate('/admin/categorias')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}