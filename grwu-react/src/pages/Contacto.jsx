
import React, { useState } from 'react';
import { createContacto } from '../data/Contactos';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      setStatus({ type: 'danger', message: 'Por favor, completa todos los campos obligatorios (*).' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: 'danger', message: 'El correo electrónico no es válido.' });
      return;
    }

    // Guardar usando la capa de datos
    createContacto(formData);
    
    setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.' });
    setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' }); // Limpiar
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="text-uppercase fw-bold" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>Contáctanos</span>
        <h1 className="display-4 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>¿Tienes alguna duda?</h1>
        <p className="lead text-muted">Estamos aquí para ayudarte. Cuéntanos tu consulta y te responderemos lo antes posible.</p>
      </div>

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h3 className="h4 fw-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Envíanos un mensaje</h3>
            
            {status.message && (
              <div className={`alert alert-${status.type}`} role="alert">
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre completo *</label>
                <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Correo electrónico *</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 1234 5678" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Asunto *</label>
                <select className="form-select" name="asunto" value={formData.asunto} onChange={handleChange}>
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="pedido">Problema con mi pedido</option>
                  <option value="devolucion">Devolución o cambio</option>
                  <option value="sugerencia">Sugerencia o reclamo</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Mensaje *</label>
                <textarea className="form-control" name="mensaje" rows="4" value={formData.mensaje} onChange={handleChange} placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ backgroundColor: 'var(--color-primario)', borderColor: 'var(--color-primario)' }}>
                Enviar mensaje ✉️
              </button>
            </form>
          </div>
        </div>

        {/* Info de Contacto */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h4 className="h5 fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Información de contacto</h4>
            <ul className="list-unstyled mb-0">
              <li className="d-flex mb-3">
                <span className="fs-4 me-3">📍</span>
                <div><strong>Dirección</strong><br/><span className="text-muted">Av. Chile 1110, Valdivia de Paine, Buin</span></div>
              </li>
              <li className="d-flex mb-3">
                <span className="fs-4 me-3">📧</span>
                <div><strong>Correo</strong><br/><span className="text-muted">hola@grwu.cl</span></div>
              </li>
              <li className="d-flex mb-3">
                <span className="fs-4 me-3">📱</span>
                <div><strong>Teléfono</strong><br/><span className="text-muted">+56 9 1234 5678</span></div>
              </li>
              <li className="d-flex">
                <span className="fs-4 me-3">🕐</span>
                <div><strong>Horario</strong><br/><span className="text-muted">Lun a Vie: 9:00 - 19:00<br/>Sáb: 10:00 - 14:00</span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
