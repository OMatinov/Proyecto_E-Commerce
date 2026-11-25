import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { actualizarProducto, obtenerProducto } from '../../services/productos';
import { listarCategorias } from '../../services/categorias';
import { validarProducto } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

export default function AdminProductoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null);
  const [valores, setValores] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let vigente = true;

    setCargando(true);
    setErrorGeneral('');

    Promise.all([obtenerProducto(id), listarCategorias()])
      .then(([producto, listaCategorias]) => {
        if (!vigente) return;
        setCategorias(listaCategorias);
        setOriginal(producto);
        if (producto) {
          setValores({
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: String(producto.precio ?? ''),
            precioOriginal: String(producto.precioOriginal ?? ''),
            oferta: String(producto.oferta ?? ''),
            categoria: producto.categoria || '',
            genero: producto.genero || 'unisex',
            stock: String(producto.stock ?? ''),
            imagen: producto.imagen || '',
          });
        }
      })
      .catch((fallo) => {
        if (vigente) setErrorGeneral(fallo.mensaje);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [id]);

  if (cargando) {
    return <p className="p-4 text-muted">Cargando producto...</p>;
  }

  if (errorGeneral && !original) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">{errorGeneral}</div>
        <Link to="/admin/productos" className="btn btn-primary">Volver</Link>
      </div>
    );
  }

  if (!original || !valores) {
    return (
      <div className="p-4">
        <h1 className="h3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-primary mt-3">Volver</Link>
      </div>
    );
  }

  const cambiar = (campo) => (e) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');

    const errs = validarProducto(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setGuardando(true);
    try {
      await actualizarProducto(id, valores);
      navigate('/admin/productos');
    } catch (fallo) {
      setErrores(fallo.errores ?? {});
      setErrorGeneral(fallo.mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Editar producto</h1>

      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 900 }}>
        <div className="col-md-8">
          <CampoFormulario id="nombre" etiqueta="Nombre" value={valores.nombre}
            onChange={cambiar('nombre')} error={errores.nombre} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="categoria" etiqueta="Categoría" value={valores.categoria}
            onChange={cambiar('categoria')} error={errores.categoria}
            opciones={[{ valor: '', texto: 'Selecciona...' },
                       ...categorias.map((c) => ({ valor: c.slug, texto: c.nombre }))]} />
        </div>
        <div className="col-12">
          <CampoFormulario id="descripcion" etiqueta="Descripción" value={valores.descripcion}
            onChange={cambiar('descripcion')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precio" etiqueta="Precio" type="number" value={valores.precio}
            onChange={cambiar('precio')} error={errores.precio} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precioOriginal" etiqueta="Precio original" type="number"
            value={valores.precioOriginal} onChange={cambiar('precioOriginal')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="oferta" etiqueta="% Oferta" type="number" value={valores.oferta}
            onChange={cambiar('oferta')} error={errores.oferta} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="stock" etiqueta="Stock" type="number" value={valores.stock}
            onChange={cambiar('stock')} error={errores.stock} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="genero" etiqueta="Género" value={valores.genero}
            onChange={cambiar('genero')}
            opciones={[{ valor: 'unisex', texto: 'Unisex' },
                       { valor: 'mujer', texto: 'Mujer' },
                       { valor: 'hombre', texto: 'Hombre' }]} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="imagen" etiqueta="Ruta de imagen" value={valores.imagen}
            onChange={cambiar('imagen')} error={errores.imagen} />
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button type="button" className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin/productos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
