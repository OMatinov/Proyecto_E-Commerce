import { leer, guardar } from './storage';

const CLAVE = 'grwu_productos';

export const PRODUCTOS_SEMILLA = [
  {
    id: 'p-001',
    nombre: 'Polerón Oversize Negra',
    descripcion: 'Polerón de algodón peruano, corte oversize, unisex.',
    precio: 24990,
    precioOriginal: 34990,
    oferta: 28,                 // % descuento (0 = sin oferta)
    categoria: 'polerones',
    genero: 'unisex',
    stock: 18,
    imagen: 'img/mujer/poleron-negra.png',
    imagenes: ['img/mujer/poleron-negra.png'],
  },
  {
    id: 'p-002',
    nombre: 'Polera Básica Blanca',
    descripcion: 'Polera de algodón peinado, cuello redondo.',
    precio: 12990,
    precioOriginal: 0,
    oferta: 0,
    categoria: 'poleras',
    genero: 'unisex',
    stock: 45,
    imagen: 'img/hombre/polera-blanca.png',
    imagenes: ['img/hombre/polera-blanca.png'],
  },
  {
    id: 'p-003',
    nombre: 'Jeans Mom Fit',
    descripcion: 'Jeans tiro alto, denim rígido, corte mom.',
    precio: 29990,
    precioOriginal: 39990,
    oferta: 25,
    categoria: 'pantalones',
    genero: 'mujer',
    stock: 3,                    // ← crítico
    imagen: 'img/mujer/jeans-mom.png',
    imagenes: ['img/mujer/jeans-mom.png'],
  },
  {
    id: 'p-004',
    nombre: 'Chaqueta Bomber',
    descripcion: 'Chaqueta bomber acolchada, cierre frontal.',
    precio: 44990,
    precioOriginal: 0,
    oferta: 0,
    categoria: 'chaquetas',
    genero: 'hombre',
    stock: 2,                    // ← crítico
    imagen: 'img/hombre/bomber.png',
    imagenes: ['img/hombre/bomber.png'],
  },
  {
    id: 'p-005',
    nombre: 'Gorro Beanie',
    descripcion: 'Gorro de lana con etiqueta tejida.',
    precio: 8990,
    precioOriginal: 0,
    oferta: 0,
    categoria: 'accesorios',
    genero: 'unisex',
    stock: 30,
    imagen: 'img/mujer/beanie.png',
    imagenes: ['img/mujer/beanie.png'],
  },
  {
    id: 'p-006',
    nombre: 'Polerón Hoodie Gris',
    descripcion: 'Hoodie con capucha y bolsillo canguro.',
    precio: 27990,
    precioOriginal: 34990,
    oferta: 20,
    categoria: 'polerones',
    genero: 'hombre',
    stock: 14,
    imagen: 'img/hombre/hoodie-gris.png',
    imagenes: ['img/hombre/hoodie-gris.png'],
  },
];

const asegurarSemilla = () => {
  const actual = leer(CLAVE, null);
  if (!Array.isArray(actual)) guardar(CLAVE, PRODUCTOS_SEMILLA);
};

export const listarProductos = () => {
  asegurarSemilla();
  return leer(CLAVE, []);
};

export const obtenerProducto = (id) =>
  listarProductos().find((p) => String(p.id) === String(id)) || null;

export const listarPorCategoria = (categoria) =>
  listarProductos().filter((p) => p.categoria === categoria);

export const listarOfertas = () =>
  listarProductos().filter((p) => Number(p.oferta) > 0);

export const listarProductosCriticos = (umbral = 5) =>
  listarProductos().filter((p) => Number(p.stock) <= umbral);

export const crearProducto = (datos) => {
  const productos = listarProductos();
  const nuevo = { ...datos, id: `p-${Date.now()}` };
  guardar(CLAVE, [...productos, nuevo]);
  return nuevo;
};

export const actualizarProducto = (id, cambios) => {
  const productos = listarProductos().map((p) =>
    String(p.id) === String(id) ? { ...p, ...cambios, id: p.id } : p
  );
  guardar(CLAVE, productos);
  return productos.find((p) => String(p.id) === String(id)) || null;
};

export const eliminarProducto = (id) => {
  const productos = listarProductos().filter((p) => String(p.id) !== String(id));
  guardar(CLAVE, productos);
  return productos;
};