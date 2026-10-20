export const slugify = (texto = '') =>
  texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const validarProducto = (v = {}) => {
  const errores = {};
  if (!v.nombre || String(v.nombre).trim().length < 3)
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  if (v.precio === '' || Number.isNaN(Number(v.precio)) || Number(v.precio) <= 0)
    errores.precio = 'El precio debe ser un número mayor a 0.';
  if (v.stock === '' || Number.isNaN(Number(v.stock)) || Number(v.stock) < 0)
    errores.stock = 'El stock debe ser un número mayor o igual a 0.';
  if (!v.categoria) errores.categoria = 'Selecciona una categoría.';
  if (!v.imagen) errores.imagen = 'La ruta de la imagen es obligatoria.';
  if (v.oferta !== '' && v.oferta != null) {
    const o = Number(v.oferta);
    if (Number.isNaN(o) || o < 0 || o > 100)
      errores.oferta = 'La oferta debe estar entre 0 y 100.';
  }
  return errores;
};

export const validarCategoria = (v = {}) => {
  const errores = {};
  if (!v.nombre || String(v.nombre).trim().length < 3)
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  if (!v.slug) errores.slug = 'El slug es obligatorio.';
  else if (!/^[a-z0-9-]+$/.test(v.slug))
    errores.slug = 'Solo minúsculas, números y guiones.';
  return errores;
};