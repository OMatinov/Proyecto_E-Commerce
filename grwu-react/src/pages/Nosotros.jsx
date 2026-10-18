
import React from 'react';

const Nosotros = () => {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <span className="text-uppercase fw-bold" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>Conócenos</span>
        <h1 className="display-4 fw-bold" style={{ color: 'var(--color-texto)', fontFamily: "'Bebas Neue', sans-serif" }}>¿Quiénes somos?</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          GRWU nace con la misión de democratizar la moda unisex en Chile. Creamos prendas versátiles, 
          de calidad y con estilo, para que puedas expresarte sin límites. <strong>Get Ready With Us</strong> 
          es más que una marca, es una comunidad.
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid var(--color-primario)' }}>
            <div className="card-body p-4">
              <div className="fs-1 mb-2">🎯</div>
              <h3 className="h4 fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Misión</h3>
              <p className="text-muted mb-0">
                Ofrecer moda unisex accesible y sostenible, conectando a las personas a través del estilo 
                y la autenticidad, con un servicio rápido y confiable.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid var(--color-primario)' }}>
            <div className="card-body p-4">
              <div className="fs-1 mb-2">👁️</div>
              <h3 className="h4 fw-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Visión</h3>
              <p className="text-muted mb-0">
                Ser la marca referente de moda unisex en Latinoamérica, impulsando la diversidad y 
                la inclusión a través de prendas que rompen estereotipos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipo */}
      <div className="text-center mb-4">
        <h3 className="fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Nuestro Equipo</h3>
      </div>
      <div className="row g-4 justify-content-center">
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-secundario)', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>M</div>
              <h5 className="fw-bold">Matías</h5>
              <p className="text-muted small mb-0">Productos & Catálogo</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primario)', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>C</div>
              <h5 className="fw-bold">César</h5>
              <p className="text-muted small mb-0">Usuarios & Checkout</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-texto)', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>K</div>
              <h5 className="fw-bold">Katerine</h5>
              <p className="text-muted small mb-0">Contenido & Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;