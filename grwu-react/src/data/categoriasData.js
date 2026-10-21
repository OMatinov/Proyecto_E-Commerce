import { leer, guardar } from './storage.js';

const CLAVE = 'grwu_categorias';

export const CATEGORIAS_SEMILLA = [
  // Categorías de género (agrupan toda la ropa de hombre / mujer)
  { id: 'c-g-hombre', slug: 'hombre', nombre: 'Hombre', descripcion: 'Toda la ropa y accesorios para hombre.', imagen: 'img/hombre/poleron1.jpeg', genero: 'todos' },
  { id: 'c-g-mujer', slug: 'mujer', nombre: 'Mujer', descripcion: 'Toda la ropa y accesorios para mujer.', imagen: 'img/mujer/vestido1.png', genero: 'todos' },
  // Categorías de prenda
  { id: 'c-001', slug: 'polerones',  nombre: 'Polerones',  descripcion: 'Abrigo y comodidad.',        imagen: 'img/mujer/poleron1.png' },
  { id: 'c-002', slug: 'poleras',    nombre: 'Poleras',    descripcion: 'Básicos para todo el año.',   imagen: 'img/mujer/polera1.png' },
  { id: 'c-003', slug: 'pantalones', nombre: 'Pantalones', descripcion: 'Jeans y pantalones de vestir.', imagen: 'img/mujer/pantalon2.png' },
  { id: 'c-004', slug: 'chaquetas',  nombre: 'Chaquetas',  descripcion: 'Outerwear para el frío.',     imagen: 'img/mujer/chaqueta1.png' },
  { id: 'c-005', slug: 'abrigos',    nombre: 'Abrigos',    descripcion: 'Abrigos de paño y invierno.', imagen: 'img/mujer/abrigo1.png' },
  { id: 'c-006', slug: 'vestidos',   nombre: 'Vestidos',   descripcion: 'Para cada ocasión.',          imagen: 'img/mujer/vestido1.png' },
  { id: 'c-007', slug: 'faldas',     nombre: 'Faldas',     descripcion: 'Cortes variados.',            imagen: 'img/mujer/falda1.png' },
  { id: 'c-008', slug: 'shorts',     nombre: 'Shorts',     descripcion: 'Cómodos para el verano.',     imagen: 'img/mujer/short1.png' },
  { id: 'c-009', slug: 'conjuntos',  nombre: 'Conjuntos',  descripcion: 'Looks coordinados.',          imagen: 'img/mujer/conjunto1.png' },
  { id: 'c-010', slug: 'calzados',   nombre: 'Calzados',   descripcion: 'Zapatillas y calzado urbano.', imagen: 'img/mujer/calzado1.png' },
  { id: 'c-011', slug: 'accesorios', nombre: 'Accesorios', descripcion: 'Gorros, lentes, cadenas y más.', imagen: 'img/hombre/gorro1.jpeg' },
];

const asegurarSemilla = () => {
  const actual = leer(CLAVE, null);
  if (!Array.isArray(actual)) {
    guardar(CLAVE, CATEGORIAS_SEMILLA);
    return;
  }
  // Migración: versiones anteriores del seed no incluían las categorías de
  // género 'hombre'/'mujer'. Si faltan en el localStorage del usuario (persiste
  // entre despliegues), se re-inyectan solo esas para que /categorias/hombre y
  // /categorias/mujer dejen de mostrar "Categoría no encontrada".
  const faltantes = CATEGORIAS_SEMILLA.filter(
    (c) => !actual.some((a) => a.slug === c.slug)
  );
  if (faltantes.length > 0) guardar(CLAVE, [...actual, ...faltantes]);
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