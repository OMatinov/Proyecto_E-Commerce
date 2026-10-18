// src/pages/Blogs.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../data/Blogs';

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

      {/* Grid de Blogs */}
      <div className="row g-4">
        {blogsFiltrados.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h4>No hay artículos en esta categoría.</h4>
          </div>
        ) : (
          blogsFiltrados.map(blog => (
            <div className="col-md-6 col-lg-4" key={blog.id}>
              <div className="card h-100 border-0 shadow-sm">
                <img src={blog.imagen} className="card-img-top" alt={blog.titulo} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge" style={{ backgroundColor: 'var(--color-secundario)' }}>{blog.categoria}</span>
                    <small className="text-muted">{new Date(blog.fecha).toLocaleDateString('es-CL')}</small>
                  </div>
                  <h5 className="card-title fw-bold">{blog.titulo}</h5>
                  <p className="card-text text-muted small flex-grow-1">{blog.resumen}</p>
                  <Link to={`/blog/${blog.id}`} className="fw-bold text-decoration-none" style={{ color: 'var(--color-primario)' }}>
                    Leer más →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;