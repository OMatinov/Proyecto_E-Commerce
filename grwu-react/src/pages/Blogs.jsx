import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../data/Blogs';
import BlogCard from '../components/BlogCard'; 
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    // Cargar datos simulando una API
    setBlogs(getBlogs().filter(b => b.estado === 'publicado'));
  }, []);

  const categorias = ['Todos', ...new Set(blogs.map(b => b.categoria))];
  
  const blogsFiltrados = filtro === 'Todos' 
    ? blogs 
    : blogs.filter(b => b.categoria === filtro);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <span className="text-uppercase fw-bold" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>Inspírate</span>
        <h1 className="display-4 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Nuestro Blog</h1>
        <p className="lead text-muted">Tendencias, consejos de estilo y todo lo que necesitas para Get Ready With Us.</p>
      </div>

      {/* Filtros */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        {categorias.map(cat => (
          <button 
            key={cat} 
            className={`btn ${filtro === cat ? 'btn-dark' : 'btn-outline-dark'} rounded-pill px-4`}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Blogs usando el componente BlogCard */}
      <div className="row g-4">
        {blogsFiltrados.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h4>No hay artículos en esta categoría.</h4>
          </div>
        ) : (
          blogsFiltrados.map(blog => (
            <div className="col-md-6 col-lg-4" key={blog.id}>
              <BlogCard blog={blog} /> {/* AQUÍ USAMOS EL COMPONENTE */}
            </div>
          ))
        )}
      </div>

      {/* Llamado a la acción */}
      <div className="text-center mt-5 pt-5 border-top">
        <span className="text-uppercase fw-bold small" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>GET READY WITH US</span>
        <h2 className="display-6 fw-bold mt-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Encuentra prendas para hacerlo tuyo.</h2>
        <p className="text-muted">Explora nuestro catálogo y combina las ideas del blog con tu propio estilo.</p>
        <Link to="/productos" className="btn btn-primary mt-3 rounded-pill px-4" style={{ backgroundColor: 'var(--color-texto)', border: 'none' }}>
          Ver catálogo
        </Link>
      </div>
    </div>
  );
};

export default Blogs;