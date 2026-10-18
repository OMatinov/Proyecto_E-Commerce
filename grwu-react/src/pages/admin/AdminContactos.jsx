
import React, { useState, useEffect } from 'react';
import { getContactos, marcarLeido, deleteContacto } from '../../data/Contactos';

const AdminContactos = () => {
  const [contactos, setContactos] = useState([]);

  const cargarContactos = () => setContactos(getContactos());

  useEffect(() => {
    cargarContactos();
  }, []);

  const handleMarcarLeido = (id) => {
    marcarLeido(id);
    cargarContactos();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este mensaje?')) {
      deleteContacto(id);
      cargarContactos();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Bandeja de Entrada</h1>
          <p className="text-muted mb-0">Mensajes recibidos desde el formulario de contacto</p>
        </div>
        <button className="btn btn-outline-dark px-4 rounded-pill" onClick={cargarContactos}>
          🔄 Actualizar
        </button>
      </div>

      <div className="row g-3">
        {contactos.length === 0 ? (
          <div className="col-12 text-center text-muted py-5 bg-white rounded shadow-sm">
            <h4>📭 No hay mensajes aún</h4>
          </div>
        ) : (
          contactos.map(msg => (
            <div className="col-12" key={msg.id}>
              <div className={`card border-0 shadow-sm ${!msg.leido ? 'border-start border-4 border-danger' : ''}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                    <div>
                      {!msg.leido && <span className="badge bg-danger me-2">Nuevo</span>}
                      <strong className="fs-5">{msg.nombre}</strong>
                    </div>
                    <small className="text-muted">📅 {new Date(msg.fecha).toLocaleString('es-CL')}</small>
                  </div>
                  <p className="mb-1 text-muted small">📧 {msg.email} | 📱 {msg.telefono || 'No especificado'}</p>
                  <p className="fw-bold mb-2">Asunto: {msg.asunto}</p>
                  <div className="bg-light p-3 rounded mb-3">
                    "{msg.mensaje}"
                  </div>
                  
                  <div className="d-flex gap-2">
                    {!msg.leido && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleMarcarLeido(msg.id)}>
                        ✓ Marcar como leído
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(msg.id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminContactos;