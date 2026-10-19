import React, { useState } from 'react';
import { createContacto } from '../data/Contactos';
import { validarNombre, validarCorreo, validarComentario } from '../utils/ValidacionesContacto';

const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
  const [errores, setErrores] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });

  const VALIDADORES = {
    nombre: validarNombre,
    email: v => (v.trim() === '' ? 'Ingresa tu correo electrónico.' : validarCorreo(v)),
    asunto: v => (v === '' ? 'Selecciona un asunto.' : ''),
    mensaje: validarComentario,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errores[name]) setErrores({ ...errores, [name]: VALIDADORES[name](value) });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (VALIDADORES[name]) setErrores(prev => ({ ...prev, [name]: VALIDADORES[name](value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    Object.keys(VALIDADORES).forEach(c => { nuevosErrores[c] = VALIDADORES[c](formData[c]) });
    setErrores(nuevosErrores);
    
    if (Object.values(nuevosErrores).some(Boolean)) {
      setStatus({ type: 'danger', message: 'Revisa los campos marcados.' });
      return;
    }
    createContacto(formData);
    setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.' });
    setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>¿Tienes alguna duda?</h1>
        <p className="lead text-muted">Estamos aquí para ayudarte.</p>
      </div>
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4">
            <form onSubmit={handleSubmit} noValidate>
              {status.message && <div className={`alert alert-${status.type}`}>{status.message}</div>}
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre completo *</label>
                <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. Juan Pérez" />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo electrónico *</label>
                <input type="email" className={`form-control ${errores.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="tu@correo.com" />
                <div className="invalid-feedback">{errores.email}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Asunto *</label>
                <select className={`form-select ${errores.asunto ? 'is-invalid' : ''}`} name="asunto" value={formData.asunto} onChange={handleChange} onBlur={handleBlur}>
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="pedido">Problema con mi pedido</option>
                </select>
                <div className="invalid-feedback">{errores.asunto}</div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Mensaje *</label>
                <textarea className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`} name="mensaje" rows="4" value={formData.mensaje} onChange={handleChange} onBlur={handleBlur} placeholder="Escribe tu mensaje aquí..."></textarea>
                <div className="invalid-feedback">{errores.mensaje}</div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2" style={{ backgroundColor: 'var(--color-primario)' }}>Enviar mensaje ✉️</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contacto;