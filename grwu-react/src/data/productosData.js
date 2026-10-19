// productosData.js - "Base de datos" de productos y categorías con CRUD.
// Autor: Matías (catálogo) — estilo migrado de usuariosData.js / ordenesData.js
//
// Persistencia: localStorage (clave "grwu_productos" y "grwu_categorias").
// Si no existen, se siembran desde PRODUCTOS_SEMILLA / CATEGORIAS_SEMILLA,
// construidas a partir de las imágenes reales de public/img/mujer y public/img/hombre.
//
// Forma de un producto (respeta el formato acordado para el carrito):
//   { id, nombre, precio, imagen, categoriaId, genero, stock, descuento, descripcion }
//   - descuento: porcentaje 0-90 (0 = sin oferta). Un producto está en oferta si descuento > 0.
//   - precioConDescuento(producto) devuelve el precio final usado por Ofertas y Detalle.

import { leer, guardar } from "./storage.js";

export const CLAVE_PRODUCTOS = "grwu_productos";
export const CLAVE_CATEGORIAS = "grwu_categorias";

// ---------- SEMILLA ----------
// Las categorías usan slug porque la ruta pública es /categorias/:slug.
export const CATEGORIAS_SEMILLA = [
  { id: "cat-abrigo", slug: "abrigos", nombre: "Abrigos" },
  { id: "cat-accesorio", slug: "accesorios", nombre: "Accesorios" },
  { id: "cat-calzado", slug: "calzado", nombre: "Calzado" },
  { id: "cat-chaqueta", slug: "chaquetas", nombre: "Chaqueta & Buzos" },
  { id: "cat-conjunto", slug: "conjuntos", nombre: "Conjuntos" },
  { id: "cat-falda", slug: "faldas", nombre: "Faldas" },
  { id: "cat-pantalon", slug: "pantalones", nombre: "Pantalones & Shorts" },
  { id: "cat-polera", slug: "poleras", nombre: "Poleras & Polerones" },
  { id: "cat-vestido", slug: "vestidos", nombre: "Vestidos" },
];

const PRECIO_BASE = {
  abrigo: 18990, chaqueta: 15990, buzo: 13990, poleron: 11990, polera: 7990,
  pantalon: 12990, short: 8990, falda: 9990, vestido: 14990, calzado: 16990,
  zapatilla: 13990, conjunto: 17990, gorro: 4990, lentes: 6990, cadena: 3990,
  collar: 4490, anillo: 2990, cinturon: 5990, accesorio: 2990,
};

const GENERO_FAMILIA = {
  mujer: ["abrigo", "accesorio", "calzado", "chaqueta", "conjunto", "falda", "pantalon", "polera", "poleron", "short", "vestido"],
  hombre: ["anillo", "buzo", "cadena", "chaqueta", "cinturon", "collar", "conjunto", "gorro", "lentes", "pantalon", "polera", "poleron", "short", "zapatilla"],
};

// Familia -> categoría que la agrupa (los accesorios de ambos géneros caen en Accesorios).
const FAMILIA_CATEGORIA = {
  abrigo: "cat-abrigo", chaqueta: "cat-chaqueta", buzo: "cat-chaqueta",
  poleron: "cat-polera", polera: "cat-polera",
  pantalon: "cat-pantalon", short: "cat-pantalon", falda: "cat-falda",
  vestido: "cat-vestido", calzado: "cat-calzado", zapatilla: "cat-calzado",
  conjunto: "cat-conjunto",
  gorro: "cat-accesorio", lentes: "cat-accesorio", cadena: "cat-accesorio",
  collar: "cat-accesorio", anillo: "cat-accesorio", cinturon: "cat-accesorio",
  accesorio: "cat-accesorio",
};

const NOMBRES_FAMILIA = {
  abrigo: "Abrigo", chaqueta: "Chaqueta", buzo: "Buzo", poleron: "Polerón", polera: "Polera",
  pantalon: "Pantalón", short: "Short", falda: "Falda", vestido: "Vestido", calzado: "Calzado",
  zapatilla: "Zapatilla", conjunto: "Conjunto", gorro: "Gorro", lentes: "Lentes",
  cadena: "Cadena", collar: "Collar", anillo: "Anillo", cinturon: "Cinturón", accesorio: "Accesorio",
};

const ADJETIVOS = ["Urbano", "Classic", "Essential", "Street", "Premium", "Relaxed"];

// Genera la lista de semillas a partir de las familias de cada género.
// Se usa un contador determinista (sin Math.random) para que los ids sean estables.
function construirSemillaProductos() {
  const lista = [];
  let n = 0;
  for (const genero of Object.keys(GENERO_FAMILIA)) {
    for (const familia of GENERO_FAMILIA[genero]) {
      const max = familia === "abrigo" && genero === "mujer" ? 3 : 2; // muestra acotada por familia
      for (let i = 1; i <= max; i++) {
        n++;
        const adjetivo = ADJETIVOS[n % ADJETIVOS.length];
        const base = PRECIO_BASE[familia] ?? 9990;
        lista.push({
          id: `${familia}-${genero}-${i}`,
          nombre: `${NOMBRES_FAMILIA[familia]} ${adjetivo} ${i}`,
          precio: base + (n % 4) * 1000,
          imagen: `/img/${genero}/${familia}${i}.${genero === "mujer" ? "png" : "jpeg"}`,
          categoriaId: FAMILIA_CATEGORIA[familia],
          genero,
          stock: 5 + (n % 21), // deja algunos con stock <= 5 para probar "productos críticos"
          descuento: n % 5 === 0 ? 20 : 0, // ~20% del catálogo en oferta
          descripcion: `${NOMBRES_FAMILIA[familia]} ${adjetivo.toLowerCase()} de la colección GRWU, pensado para combinar con tu día a día. Material resistente, corte moderno y la actitud de Get Ready With Us.`,
        });
      }
    }
  }
  return lista;
}

export const PRODUCTOS_SEMILLA = construirSemillaProductos();

// ---------- CARGA ----------
function cargarLista(clave, semilla) {
  const guardados = leer(clave, null);
  if (guardados) return guardados;
  guardar(clave, semilla);
  return semilla.slice();
}

// ---------- CATEGORÍAS ----------
export function listarCategorias() {
  return cargarLista(CLAVE_CATEGORIAS, CATEGORIAS_SEMILLA);
}

export function obtenerCategoria(id) {
  return listarCategorias().find((c) => c.id === id) || null;
}

export function obtenerCategoriaPorSlug(slug) {
  return listarCategorias().find((c) => c.slug === slug) || null;
}

export function crearCategoria({ nombre, slug }) {
  const todas = listarCategorias();
  const s = slug || generarSlug(nombre);
  if (!nombre?.trim()) throw new Error("El nombre de la categoría es obligatorio.");
  if (todas.some((c) => c.slug === s)) throw new Error("Ya existe una categoría con ese slug.");
  const nueva = { id: "cat-" + Date.now(), slug: s, nombre: nombre.trim() };
  todas.push(nueva);
  guardar(CLAVE_CATEGORIAS, todas);
  return nueva;
}

export function actualizarCategoria(id, cambios) {
  const todas = listarCategorias();
  const i = todas.findIndex((c) => c.id === id);
  if (i === -1) return null;
  const slug = cambios.slug ? generarSlug(cambios.slug) : todas[i].slug;
  if (todas.some((c, j) => j !== i && c.slug === slug)) {
    throw new Error("Ya existe una categoría con ese slug.");
  }
  todas[i] = { ...todas[i], ...cambios, slug };
  guardar(CLAVE_CATEGORIAS, todas);
  return todas[i];
}

export function eliminarCategoria(id) {
  const todas = listarCategorias();
  const resto = todas.filter((c) => c.id !== id);
  if (resto.length === todas.length) return false;
  guardar(CLAVE_CATEGORIAS, resto);
  return true;
}

export function generarSlug(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- PRODUCTOS ----------
export function listarProductos() {
  return cargarLista(CLAVE_PRODUCTOS, PRODUCTOS_SEMILLA);
}

export function obtenerProducto(id) {
  return listarProductos().find((p) => p.id === id) || null;
}

export function productosPorCategoria(categoriaId) {
  return listarProductos().filter((p) => p.categoriaId === categoriaId);
}

export function productosEnOferta() {
  return listarProductos().filter((p) => p.descuento > 0);
}

export function productosCriticos(umbral = 5) {
  return listarProductos().filter((p) => p.stock <= umbral);
}

export function precioConDescuento(producto) {
  if (!producto) return 0;
  const d = Number(producto.descuento) || 0;
  return Math.round(producto.precio * (1 - d / 100));
}

function normalizarProducto(datos) {
  return {
    categoriaId: "",
    genero: "mujer",
    stock: 0,
    descuento: 0,
    descripcion: "",
    imagen: "/img/portada.jpeg",
    ...datos,
    nombre: (datos.nombre || "").trim(),
    precio: Number(datos.precio) || 0,
    stock: Number(datos.stock) || 0,
    descuento: Math.min(90, Math.max(0, Number(datos.descuento) || 0)),
  };
}

export function crearProducto(datos) {
  const todos = listarProductos();
  const nuevo = normalizarProducto(datos);
  if (!nuevo.nombre) throw new Error("El nombre del producto es obligatorio.");
  if (nuevo.precio <= 0) throw new Error("El precio debe ser mayor que cero.");
  nuevo.id = nuevo.id || `prod-${Date.now()}`;
  if (todos.some((p) => p.id === nuevo.id)) throw new Error("Ya existe un producto con ese ID.");
  todos.push(nuevo);
  guardar(CLAVE_PRODUCTOS, todos);
  return nuevo;
}

export function actualizarProducto(id, cambios) {
  const todos = listarProductos();
  const i = todos.findIndex((p) => p.id === id);
  if (i === -1) return null;
  todos[i] = normalizarProducto({ ...todos[i], ...cambios, id });
  guardar(CLAVE_PRODUCTOS, todos);
  return todos[i];
}

export function eliminarProducto(id) {
  const todos = listarProductos();
  const resto = todos.filter((p) => p.id !== id);
  if (resto.length === todos.length) return false;
  guardar(CLAVE_PRODUCTOS, resto);
  return true;
}
