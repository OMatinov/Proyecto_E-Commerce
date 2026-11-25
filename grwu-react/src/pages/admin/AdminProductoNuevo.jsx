import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearProducto } from '../../services/productos';
import { listarCategorias } from '../../services/categorias';
import { validarProducto } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

const VACIO = {
  nombre: '', descripcion: '', precio: '', precioOriginal: '',
  oferta: '', categoria: '', genero: 'unisex', stock: '', imagen: '',
};

export default function AdminProductoNuevo() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let vigente = true;

    listarCategorias()
      .then((lista) => {
        if (vigente) setCategorias(lista);
      })
      .catch((fallo) => {
        if (vigente) setErrorGeneral(fallo.mensaje);
      });

    return () => {
      vigente = false;
    };
  }, []);

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
      await crearProducto({
        ...valores,
        imagenes: [valores.imagen],
      });
      navigate('/admin/productos');
    } catch (fallo) {
      // El backend devuelve los errores de campo en "errores" (400).
      setErrores(fallo.errores ?? {});
      setErrorGeneral(fallo.mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Nuevo producto</h1>

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
          <CampoFormulario id="precio" etiqueta="Precio" type="number"
            value={valores.precio} onChange={cambiar('precio')} error={errores.precio} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precioOriginal" etiqueta="Precio original (opcional)" type="number"
            value={valores.precioOriginal} onChange={cambiar('precioOriginal')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="oferta" etiqueta="% Oferta (0-100)" type="number"
            value={valores.oferta} onChange={cambiar('oferta')} error={errores.oferta} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="stock" etiqueta="Stock" type="number"
            value={valores.stock} onChange={cambiar('stock')} error={errores.stock} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="genero" etiqueta="Género" value={valores.genero}
            onChange={cambiar('genero')}
            opciones={[{ valor: 'unisex', texto: 'Unisex' },
                       { valor: 'mujer', texto: 'Mujer' },
                       { valor: 'hombre', texto: 'Hombre' }]} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="imagen" etiqueta="Ruta de imagen"
            value={valores.imagen} onChange={cambiar('imagen')} error={errores.imagen} />
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin/productos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
