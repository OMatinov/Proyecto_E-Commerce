import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearProducto } from '../../data/productosData';
import { listarCategorias } from '../../data/categoriasData';
import { validarProducto } from '../../utils/validacionesAdmin';
import CampoFormulario from '../../components/CampoFormulario';

const VACIO = {
  nombre: '', descripcion: '', precio: '', precioOriginal: '',
  oferta: '', categoria: '', genero: 'unisex', stock: '', imagen: '',
};

export default function AdminProductoNuevo() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const categorias = listarCategorias();

  const cambiar = (campo) => (e) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarProducto(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    crearProducto({
      ...valores,
      precio: Number(valores.precio),
      precioOriginal: Number(valores.precioOriginal) || 0,
      oferta: Number(valores.oferta) || 0,
      stock: Number(valores.stock),
      imagenes: [valores.imagen],
    });
    navigate('/admin/productos');
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Nuevo producto</h1>
      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 900 }}>
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
          <CampoFormulario id="precio" label="Precio" type="number"
            value={valores.precio} onChange={cambiar('precio')} error={errores.precio} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="precioOriginal" label="Precio original (opcional)" type="number"
            value={valores.precioOriginal} onChange={cambiar('precioOriginal')} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="oferta" label="% Oferta (0-100)" type="number"
            value={valores.oferta} onChange={cambiar('oferta')} error={errores.oferta} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="stock" label="Stock" type="number"
            value={valores.stock} onChange={cambiar('stock')} error={errores.stock} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="genero" label="Género" value={valores.genero}
            onChange={cambiar('genero')}
            opciones={[{ value: 'unisex', label: 'Unisex' },
                       { value: 'mujer', label: 'Mujer' },
                       { value: 'hombre', label: 'Hombre' }]} />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="imagen" label="Ruta de imagen"
            value={valores.imagen} onChange={cambiar('imagen')} error={errores.imagen} />
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin/productos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}