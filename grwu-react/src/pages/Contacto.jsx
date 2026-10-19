import React, { useState } from 'react';
import { createContacto } from '../data/Contactos';
import { validarNombre, validarCorreo, validarComentario } from '../utils/ValidacionesContacto';

const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
  const [errores, setErrores] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [charCount, setCharCount] = useState(0);

  const VALIDADORES = {
    nombre: validarNombre,
    email: v => (v.trim() === '' ? 'Ingresa tu correo electrónico.' : validarCorreo(v)),
    asunto: v => (v === '' ? 'Selecciona un asunto.' : ''),
    mensaje: validarComentario,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'mensaje') setCharCount(value.length);
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
    setCharCount(0);
    setErrores({});
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="text-uppercase fw-bold" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>HABLEMOS</span>
        <h1 className="display-4 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Estamos aquí para ayudarte.</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          ¿Tienes una consulta sobre un producto, tu compra o GRWU? Déjanos un mensaje y te responderemos lo antes posible.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h3 className="h4 fw-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Cuéntanos cómo podemos ayudarte.</h3>
            
            {status.message && <div className={`alert alert-${status.type}`}>{status.message}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre completo *</label>
                <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. Juan Pérez" />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Correo electrónico *</label>
                  <input type="email" className={`form-control ${errores.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="tu@correo.com" />
                  <div className="invalid-feedback">{errores.email}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Teléfono (Opcional)</label>
                  <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 1234 5678" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Motivo de contacto *</label>
                <select className={`form-select ${errores.asunto ? 'is-invalid' : ''}`} name="asunto" value={formData.asunto} onChange={handleChange} onBlur={handleBlur}>
                  <option value="">Selecciona una opción</option>
                  <option value="consulta">Consulta por un producto</option>
                  <option value="pedido">Consulta por un pedido</option>
                  <option value="devolucion">Cambios y devoluciones</option>
                  <option value="despacho">Despacho</option>
                </select>
                <div className="invalid-feedback">{errores.asunto}</div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label fw-semibold">Mensaje *</label>
                  <small className="text-muted fw-bold">{charCount} / 500</small>
                </div>
                <textarea className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`} name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} onBlur={handleBlur} placeholder="Escribe aquí tu consulta..."></textarea>
                <div className="invalid-feedback">{errores.mensaje}</div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ backgroundColor: 'var(--color-primario)', border: 'none', borderRadius: '999px' }}>
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>

        {/* Tarjetas de Información con ÍCONOS REALES */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ backgroundColor: '#fff' }}>
            <span className="text-uppercase fw-bold small" style={{ color: 'var(--color-secundario)', letterSpacing: '2px' }}>Información Directa</span>
            <h4 className="h5 fw-bold mt-2 mb-3">También puedes escribirnos.</h4>
            
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-start mb-3">
                <img src="/img/iconos/gmail.png" alt="Correo" style={{ width: '24px', marginRight: '15px' }} />
                <div>
                  <strong>Correo</strong><br/>
                  <a href="mailto:tienda.grwu@gmail.com" className="text-decoration-none text-muted">tienda.grwu@gmail.com</a>
                </div>
              </li>
              <li className="d-flex align-items-start mb-3">
                <img src="/img/iconos/horario.png" alt="Horario" style={{ width: '24px', marginRight: '15px' }} />
                <div>
                  <strong>Horario de atención</strong><br/>
                  <span className="text-muted">Lunes a viernes, 09:00 a 18:00 hrs.</span>
                </div>
              </li>
              <li className="d-flex align-items-start">
                <img src="/img/iconos/telefono.png" alt="Teléfono" style={{ width: '24px', marginRight: '15px' }} />
                <div>
                  <strong>Teléfono</strong><br/>
                  <a href="tel:+56996735648" className="text-decoration-none text-muted">+56 9 9673 5648</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: 'var(--color-texto)', color: '#fff' }}>
            <span className="text-uppercase fw-bold small" style={{ color: 'var(--color-secundario)', letterSpacing: '2px' }}>Síguenos</span>
            <h4 className="h5 fw-bold mt-2 mb-3">Conecta con la comunidad GRWU.</h4>
            <div className="d-flex flex-column gap-2">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-decoration-none p-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <div className="d-flex align-items-center gap-2">
                  <img src="/img/iconos/instagram.png" alt="Instagram" style={{ width: '20px' }} />
                  <span><strong>Instagram</strong> <small className="text-white-50">@grwu.cl</small></span>
                </div>
                <span>↗</span>
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="text-decoration-none p-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <div className="d-flex align-items-center gap-2">
                  <img src="/img/iconos/tik-tok.png" alt="TikTok" style={{ width: '20px' }} />
                  <span><strong>TikTok</strong> <small className="text-white-50">@grwu.cl</small></span>
                </div>
                <span>↗</span>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="text-decoration-none p-2 rounded d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <div className="d-flex align-items-center gap-2">
                  <img src="/img/iconos/facebook.png" alt="Facebook" style={{ width: '20px' }} />
                  <span><strong>Facebook</strong> <small className="text-white-50">GRWU Chile</small></span>
                </div>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;