
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogs } from '../data/Blogs';

const BlogDetalle = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const blogs = getBlogs();
    // Los IDs generados con Date.now() son números, los iniciales también
    const found = blogs.find(b => b.id.toString() === id);
    setBlog(found);
  }, [id]);

  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link to="/blogs" className="btn btn-primary mt-3">Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blogs" className="text-decoration-none mb-4 d-inline-block fw-bold" style={{ color: 'var(--color-primario)' }}>
            ← Volver a blogs
          </Link>

          <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded-3 mb-4 w-100 shadow-sm" style={{ maxHeight: '400px', objectFit: 'cover' }} />
          
          <div className="d-flex gap-3 text-muted small mb-3 flex-wrap">
            <span>📅 {new Date(blog.fecha).toLocaleDateString('es-CL')}</span>
            <span>✍️ Por {blog.autor}</span>
            <span className="badge" style={{ backgroundColor: 'var(--color-primario)' }}>{blog.categoria}</span>
          </div>

          <h1 className="display-5 fw-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{blog.titulo}</h1>
          
          <div className="fs-5 lh-lg text-secondary" style={{ whiteSpace: 'pre-line' }}>
            {blog.contenido}
          </div>
          
          <hr className="my-5" />
          
          <div className="text-center">
            <h5 className="fw-bold">Comparte este artículo:</h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-outline-dark rounded-circle">📘</button>
              <button className="btn btn-outline-dark rounded-circle">🐦</button>
              <button className="btn btn-outline-dark rounded-circle">📷</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetalle;
