import { leer, guardar } from './storage.js';

const CLAVE = 'grwu_categorias';

export const CATEGORIAS_SEMILLA = [
  { id: 'c-001', slug: 'polerones',  nombre: 'Polerones',  descripcion: 'Abrigo y comodidad.',        imagen: 'img/mujer/poleron-negra.png' },
  { id: 'c-002', slug: 'poleras',    nombre: 'Poleras',    descripcion: 'Básicos para todo el año.',   imagen: 'img/hombre/polera-blanca.png' },
  { id: 'c-003', slug: 'pantalones', nombre: 'Pantalones', descripcion: 'Jeans y pantalones de vestir.', imagen: 'img/mujer/jeans-mom.png' },
  { id: 'c-004', slug: 'chaquetas',  nombre: 'Chaquetas',  descripcion: 'Outerwear para el frío.',     imagen: 'img/hombre/bomber.png' },
  { id: 'c-005', slug: 'accesorios', nombre: 'Accesorios', descripcion: 'Gorros, cinturones y más.',   imagen: 'img/mujer/beanie.png' },
];

const asegurarSemilla = () => {
  const actual = leer(CLAVE, null);
  if (!Array.isArray(actual)) guardar(CLAVE, CATEGORIAS_SEMILLA);
};

export const listarCategorias = () => {
  asegurarSemilla();
  return leer(CLAVE, []);
};

export const obtenerCategoria = (id) =>
  listarCategorias().find((c) => String(c.id) === String(id)) || null;

export const obtenerCategoriaPorSlug = (slug) =>
  listarCategorias().find((c) => c.slug === slug) || null;

export const crearCategoria = (datos) => {
  const categorias = listarCategorias();
  const nuevo = { ...datos, id: `c-${Date.now()}` };
  guardar(CLAVE, [...categorias, nuevo]);
  return nuevo;
};

export const actualizarCategoria = (id, cambios) => {
  const categorias = listarCategorias().map((c) =>
    String(c.id) === String(id) ? { ...c, ...cambios, id: c.id } : c
  );
  guardar(CLAVE, categorias);
  return categorias.find((c) => String(c.id) === String(id)) || null;
};

export const eliminarCategoria = (id) => {
  const categorias = listarCategorias().filter((c) => String(c.id) !== String(id));
  guardar(CLAVE, categorias);
  return categorias;
};