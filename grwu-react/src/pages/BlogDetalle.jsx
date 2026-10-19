import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogs } from '../data/Blogs';
import { formatearFecha } from '../utils/formatos';

const BlogDetalle = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const blogs = getBlogs();
    const found = blogs.find(b => b.id.toString() === id && b.estado === 'publicado');
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

  // Función para compartir
  const compartir = (tipo) => {
    const url = window.location.href;
    const texto = `${blog.titulo} | GRWU`;
    if (tipo === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`, '_blank');
    } else if (tipo === 'copiar') {
      navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blogs" className="text-decoration-none mb-4 d-inline-block fw-bold" style={{ color: 'var(--color-primario)' }}>
            ← Volver a los artículos
          </Link>

          <div className="mb-3">
            <span className="badge text-uppercase" style={{ backgroundColor: 'var(--color-secundario)' }}>{blog.categoria}</span>
          </div>

          <h1 className="display-5 fw-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{blog.titulo}</h1>
          
          <div className="d-flex gap-3 text-muted small mb-4 flex-wrap">
            <span>📅 {formatearFecha(blog.fecha)}</span>
            <span>✍️ Por {blog.autor}</span>
          </div>

          <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded-3 mb-4 w-100 shadow-sm" style={{ maxHeight: '400px', objectFit: 'cover' }} />
          
          {/* Aquí inyectamos el HTML del contenido */}
          <div 
            className="fs-5 lh-lg text-secondary blog-content-html" 
            dangerouslySetInnerHTML={{ __html: blog.contenido }} 
          />
          
          <hr className="my-5" />
          
          {/* Botones de compartir */}
          <div className="text-center">
            <h5 className="fw-bold mb-3">Comparte este artículo</h5>
            <div className="d-flex justify-content-center gap-3">
              <button onClick={() => compartir('copiar')} className="btn btn-outline-dark rounded-pill px-4">
                🔗 Copiar enlace
              </button>
              <button onClick={() => compartir('whatsapp')} className="btn btn-outline-success rounded-pill px-4">
                💬 WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetalle;