import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crearCategoria } from '../../services/categorias';
import { validarCategoria, slugify } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

const VACIO = { nombre: '', slug: '', descripcion: '', imagen: '', genero: '' };

export default function AdminCategoriaNueva() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [slugBloqueado, setSlugBloqueado] = useState(false);
  const navigate = useNavigate();

  const cambiar = (campo) => (e) => {
    const v = e.target.value;
    setValores((prev) => ({
      ...prev,
      [campo]: v,
      // Mientras el slug no se edite a mano, se genera desde el nombre.
      ...(campo === 'nombre' && !slugBloqueado ? { slug: slugify(v) } : {}),
    }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');

    const errs = validarCategoria(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setGuardando(true);
    try {
      await crearCategoria(valores);
      navigate('/admin/categorias');
    } catch (fallo) {
      // 409: slug duplicado; 400: campos invalidos.
      setErrores(fallo.errores ?? {});
      setErrorGeneral(fallo.mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Nueva categoría</h1>
        <Link to="/admin/categorias" className="btn btn-outline-secondary">? Volver</Link>
      </div>

      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 700 }}>
        <div className="col-12">
          <CampoFormulario id="nombre" etiqueta="Nombre" value={valores.nombre}
            onChange={cambiar('nombre')} error={errores.nombre} />
        </div>

        <div className="col-12">
          <CampoFormulario id="slug" etiqueta="Slug (URL)" value={valores.slug}
            onChange={(e) => {
              setSlugBloqueado(true);
              setValores((prev) => ({ ...prev, slug: slugify(e.target.value) }));
            }}
            error={errores.slug} />
          <div className="form-text">
            URL pública: <code>/categorias/{valores.slug || '...'}</code>
          </div>
        </div>

        <div className="col-12">
          <CampoFormulario id="descripcion" etiqueta="Descripción" value={valores.descripcion}
            onChange={cambiar('descripcion')} />
        </div>

        <div className="col-12">
          <CampoFormulario id="imagen" etiqueta="Ruta de imagen" value={valores.imagen}
            onChange={cambiar('imagen')} error={errores.imagen} />
        </div>

        <div className="col-12">
          <CampoFormulario id="genero" etiqueta="Género" value={valores.genero}
            onChange={cambiar('genero')}
            opciones={[{ valor: '', texto: 'Sin género (categoría de prenda)' },
                       { valor: 'hombre', texto: 'Hombre' },
                       { valor: 'mujer', texto: 'Mujer' },
                       { valor: 'todos', texto: 'Todos' }]} />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button className="btn btn-outline-secondary" type="button"
                  onClick={() => navigate('/admin/categorias')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
