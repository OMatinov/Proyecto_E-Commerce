// src/data/blogs.js

const initialBlogs = [
  {
    id: 1,
    titulo: "5 Tendencias que Dominarán el Otoño 2026",
    autor: "Katerine",
    fecha: "2026-08-15",
    categoria: "Tendencias",
    resumen: "Descubre los colores, texturas y siluetas que marcarán la temporada...",
    contenido: "El otoño 2026 trae consigo una revolución de estilo. Desde colores tierra hasta siluetas oversize, te contamos todo lo que necesitas saber para renovar tu armario esta temporada.\n\n1. Tonos Tierra y Terracota: Los colores que dominarán son el marrón chocolate, terracota, mostaza y verde oliva...\n\n2. Siluetas Oversize: Las prendas amplias y holgadas siguen siendo tendencia...",
    imagen: "https://via.placeholder.com/800x400/531C22/E7D8CA?text=Tendencias+Otono",
    estado: "publicado"
  },
  {
    id: 2,
    titulo: "Cómo Armar un Look Unisex en 5 Pasos",
    autor: "Matías",
    fecha: "2026-08-10",
    categoria: "Estilo",
    resumen: "Prendas clave que funcionan para cualquier género y silueta...",
    contenido: "La moda unisex es más que una tendencia, es una forma de expresión. Aquí te dejamos 5 pasos para lograrlo...\n\nPaso 1: Elige una paleta de colores neutra.\nPaso 2: Juega con las proporciones (oversize)...",
    imagen: "https://via.placeholder.com/800x400/AC9185/E7D8CA?text=Look+Unisex",
    estado: "publicado"
  }
];

// Obtener blogs (desde localStorage o el inicial)
export const getBlogs = () => {
  const stored = localStorage.getItem('grwu_blogs');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('grwu_blogs', JSON.stringify(initialBlogs));
  return initialBlogs;
};

// Guardar en localStorage (función auxiliar)
const saveBlogs = (blogs) => {
  localStorage.setItem('grwu_blogs', JSON.stringify(blogs));
};

// Crear blog
export const createBlog = (blog) => {
  const blogs = getBlogs();
  const newBlog = { ...blog, id: Date.now() }; // ID único
  const updated = [...blogs, newBlog];
  saveBlogs(updated);
  return newBlog;
};

// Actualizar blog
export const updateBlog = (id, updatedData) => {
  const blogs = getBlogs();
  const updated = blogs.map(b => b.id === id ? { ...b, ...updatedData } : b);
  saveBlogs(updated);
  return updated.find(b => b.id === id);
};

// Eliminar blog
export const deleteBlog = (id) => {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  saveBlogs(filtered);
  return true;
};