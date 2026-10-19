import { Link } from 'react-router-dom';
import { formatearFecha } from '../utils/formatos';

export default function BlogCard({ blog }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <img 
        src={blog.imagen} 
        className="card-img-top" 
        alt={blog.titulo}
        style={{ height: '200px', objectFit: 'cover' }} 
        // Si la imagen no carga, mostramos un fondo gris para que no se vea roto
        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=GRWU'; }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge text-uppercase" style={{ backgroundColor: 'var(--color-secundario)' }}>
            {blog.categoria}
          </span>
          <small className="text-muted">{formatearFecha(blog.fecha)}</small>
        </div>
        <h5 className="card-title fw-bold">{blog.titulo}</h5>
        <p className="card-text text-muted small flex-grow-1">{blog.resumen}</p>
        <Link to={`/blogs/${blog.id}`} className="fw-bold text-decoration-none" style={{ color: 'var(--color-primario)' }}>
          Leer más →
        </Link>
      </div>
    </div>
  );
}