// FormProducto.jsx - Formulario compartido para crear/editar productos (admin).
// Autor: Matías
//
// AdminProductoNuevo y AdminProductoEditar solo cambian el título, el botón y qué
// función de productosData llaman al enviar; todo lo demás vive aquí.

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import MensajeVacio from "../../components/MensajeVacio.jsx";
import { listarCategorias } from "../../data/productosData.js";

export default function FormProducto({ titulo, productoIncial, textoBoton, onGuardar }) {
  const navigate = useNavigate();
  const categorias = useMemo(() => listarCategorias(), []);
  const [valores, setValores] = useState({
    nombre: productoIncial?.nombre ?? "",
    precio: productoIncial?.precio ?? "",
    categoriaId: productoIncial?.categoriaId ?? "",
    genero: productoIncial?.genero ?? "mujer",
    stock: productoIncial?.stock ?? 0,
    descuento: productoIncial?.descuento ?? 0,
    imagen: productoIncial?.imagen ?? "/img/mujer/abrigo1.png",
    descripcion: productoIncial?.descripcion ?? "",
  });
  const [errores, setErrores] = useState({});

  const manejarCambio = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  const validar = () => {
    const err = {};
    if (!valores.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    else if (valores.nombre.length > 100) err.nombre = "Máximo 100 caracteres.";
    const precio = Number(valores.precio);
    if (!precio || precio <= 0) err.precio = "El precio debe ser mayor que cero.";
    if (!valores.categoriaId) err.categoriaId = "Selecciona una categoría.";
    const stock = Number(valores.stock);
    if (Number.isNaN(stock) || stock < 0) err.stock = "El stock no puede ser negativo.";
    const desc = Number(valores.descuento);
    if (Number.isNaN(desc) || desc < 0 || desc > 90) err.descuento = "El descuento debe estar entre 0 y 90%.";
    if (!valores.imagen.trim()) err.imagen = "Indica la ruta de la imagen.";
    return err;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    try {
      onGuardar({
        ...valores,
        nombre: valores.nombre.trim(),
        precio: Number(valores.precio),
        stock: Number(valores.stock),
        descuento: Number(valores.descuento),
      });
      navigate("/admin/productos");
    } catch (error) {
      setErrores({ general: error.message });
    }
  };

  const opcionesCategoria = categorias.map((c) => ({ valor: c.id, texto: c.nombre }));

  // Si la categoría inicial fue eliminada, evitamos un select inconsistente.
  if (productoIncial && !categorias.some((c) => c.id === productoIncial.categoriaId)) {
    return (
      <MensajeVacio titulo="Categoría no encontrada"
        texto="Primero asigna una categoría válida al producto desde el listado."
        enlace="/admin/categorias" textoEnlace="Ir a Categorías" />
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="h2 fw-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{titulo}</h1>
      <p className="text-muted">Los campos marcados son obligatorios según las reglas del catálogo.</p>

      <form onSubmit={manejarEnvio} noValidate>
        {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}

        <CampoFormulario id="nombre" etiqueta="Nombre *" placeholder="Ej: Abrigo Classic Camel"
          value={valores.nombre} onChange={manejarCambio} error={errores.nombre} />

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="precio" etiqueta="Precio (CLP) *" type="number" min="0" step="100"
              value={valores.precio} onChange={manejarCambio} error={errores.precio} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="descuento" etiqueta="Descuento (% oferta)" type="number" min="0" max="90"
              value={valores.descuento} onChange={manejarCambio} error={errores.descuento} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="categoriaId" etiqueta="Categoría *" opciones={opcionesCategoria}
              placeholderOpcion="-- Seleccione la categoría --"
              value={valores.categoriaId} onChange={manejarCambio} error={errores.categoriaId} />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="genero" etiqueta="Género" placeholderOpcion={null}
              opciones={[{ valor: "mujer", texto: "Mujer" }, { valor: "hombre", texto: "Hombre" }]}
              value={valores.genero} onChange={manejarCambio} />
          </div>
        </div>

        <CampoFormulario id="stock" etiqueta="Stock (unidades)" type="number" min="0"
          value={valores.stock} onChange={manejarCambio} error={errores.stock} />

        <CampoFormulario id="imagen" etiqueta="Imagen (ruta)" placeholder="/img/mujer/abrigo1.png"
          value={valores.imagen} onChange={manejarCambio} error={errores.imagen} />
        {valores.imagen && (
          <img src={valores.imagen} alt="Vista previa" className="rounded shadow-sm mb-3"
            style={{ width: 120, aspectRatio: "3 / 4", objectFit: "cover" }} />
        )}

        {/* CampoFormulario solo soporta input/select; la descripción usa textarea aparte. */}
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea id="descripcion" name="descripcion" className="form-control" rows={4}
            value={valores.descripcion} onChange={manejarCambio} />
        </div>

        <div className="d-flex gap-2 mt-2">
          <button type="submit" className="btn btn-dark px-4">{textoBoton}</button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
