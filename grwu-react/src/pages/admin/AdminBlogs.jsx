
import React, { useState, useEffect } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../data/Blogs';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '', categoria: 'Tendencias', resumen: '', contenido: '', imagen: '', estado: 'publicado', autor: 'Katerine'
  });

  // Cargar blogs al iniciar
  const cargarBlogs = () => setBlogs(getBlogs());

  useEffect(() => {
    cargarBlogs();
  }, []);

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData(blog);
    } else {
      setCurrentBlog(null);
      setFormData({ titulo: '', categoria: 'Tendencias', resumen: '', contenido: '', imagen: '', estado: 'publicado', autor: 'Katerine' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentBlog(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentBlog) {
      updateBlog(currentBlog.id, formData);
    } else {
      createBlog(formData);
    }
    cargarBlogs();
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás segura de eliminar este artículo?')) {
      deleteBlog(id);
      cargarBlogs();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Gestión de Blogs</h1>
          <p className="text-muted mb-0">Administra los artículos del blog</p>
        </div>
        <button className="btn btn-primary px-4 rounded-pill" onClick={() => handleOpenModal()} style={{ backgroundColor: 'var(--color-primario)', borderColor: 'var(--color-primario)' }}>
          + Nuevo Artículo
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark" style={{ backgroundColor: 'var(--color-texto)' }}>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="fw-semibold">{blog.titulo}</td>
                  <td><span className="badge" style={{ backgroundColor: 'var(--color-secundario)' }}>{blog.categoria}</span></td>
                  <td>{blog.autor}</td>
                  <td>
                    <span className={`badge ${blog.estado === 'publicado' ? 'bg-success' : 'bg-secondary'}`}>
                      {blog.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleOpenModal(blog)}>✏️ Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(blog.id)}>🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No hay artículos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header" style={{ backgroundColor: 'var(--color-secundario)', color: '#fff' }}>
                <h5 className="modal-title fw-bold">{currentBlog ? 'Editar Artículo' : 'Nuevo Artículo'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Título *</label>
                      <input type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Categoría</label>
                      <select className="form-select" name="categoria" value={formData.categoria} onChange={handleChange}>
                        <option value="Tendencias">Tendencias</option>
                        <option value="Estilo">Estilo</option>
                        <option value="Moda Unisex">Moda Unisex</option>
                        <option value="Sostenibilidad">Sostenibilidad</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Estado</label>
                      <select className="form-select" name="estado" value={formData.estado} onChange={handleChange}>
                        <option value="publicado">Publicado</option>
                        <option value="borrador">Borrador</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">URL de Imagen (Opcional)</label>
                      <input type="url" className="form-control" name="imagen" value={formData.imagen} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Resumen Corto *</label>
                      <input type="text" className="form-control" name="resumen" value={formData.resumen} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Contenido Completo *</label>
                      <textarea className="form-control" name="contenido" rows="5" value={formData.contenido} onChange={handleChange} required></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-primario)', borderColor: 'var(--color-primario)' }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;