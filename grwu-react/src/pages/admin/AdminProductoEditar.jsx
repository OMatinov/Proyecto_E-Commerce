import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { actualizarProducto, obtenerProducto } from '../../data/productosData';
import { listarCategorias } from '../../data/categoriasData';
import { validarProducto } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

export default function AdminProductoEditar() {
  const { id } = useParams();
  const original = obtenerProducto(id);
  const navigate = useNavigate();
  const categorias = listarCategorias();

  const [valores, setValores] = useState(() => original ? {
    nombre: original.nombre || '',
    descripcion: original.descripcion || '',
    precio: String(original.precio ?? ''),
    precioOriginal: String(original.precioOriginal ?? ''),
    oferta: String(original.oferta ?? ''),
    categoria: original.categoria || '',
    genero: original.genero || 'unisex',
    stock: String(original.stock ?? ''),
    imagen: original.imagen || '',
  } : null);

  const [errores, setErrores] = useState({});

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

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarProducto(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    actualizarProducto(id, {
      ...valores,
      precio: Number(valores.precio),
      precioOriginal: Number(valores.precioOriginal) || 0,
      oferta: Number(valores.oferta) || 0,
      stock: Number(valores.stock),
    });
    navigate('/admin/productos');
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Editar producto</h1>
      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 900 }}>
        {/* mismos campos que AdminProductoNuevo */}
        <div className="col-md-8">
          <CampoFormulario id="nombre" label="Nombre" value={valores.nombre}
            onChange={cambiar('nombre')} error={errores.nombre} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="categoria" label="Categoría" value={valores.categoria}
            onChange={cambiar('categoria')} error={errores.categoria}
            opciones={[{ value: '', label: 'Selecciona...' },
                       ...categorias.map((c) => ({ value: c.slug, label: c.nombre }))]} />
        </div>
        <div className="col-12">
          <CampoFormulario id="descripcion" label="Descripción" value={valores.descripcion}
            onChange={cambiar('descripcion')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precio" label="Precio" type="number" value={valores.precio}
            onChange={cambiar('precio')} error={errores.precio} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precioOriginal" label="Precio original" type="number"
            value={valores.precioOriginal} onChange={cambiar('precioOriginal')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="oferta" label="% Oferta" type="number" value={valores.oferta}
            onChange={cambiar('oferta')} error={errores.oferta} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="stock" label="Stock" type="number" value={valores.stock}
            onChange={cambiar('stock')} error={errores.stock} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="genero" label="Género" value={valores.genero}
            onChange={cambiar('genero')}
            opciones={[{ value: 'unisex', label: 'Unisex' },
                       { value: 'mujer', label: 'Mujer' },
                       { value: 'hombre', label: 'Hombre' }]} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="imagen" label="Ruta de imagen" value={valores.imagen}
            onChange={cambiar('imagen')} error={errores.imagen} />
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin/productos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}