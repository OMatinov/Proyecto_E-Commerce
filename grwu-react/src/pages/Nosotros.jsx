import React from 'react';
import TeamCard from '../components/TeamCard';

const EQUIPO = [
  { inicial: 'M', nombre: 'Matías', rol: 'Productos & Catálogo', color: 'var(--color-secundario)', aporte: 'Se encarga de organizar los productos y de que cada prenda tenga la información necesaria para elegir con seguridad.' },
  { inicial: 'C', nombre: 'César', rol: 'Usuarios & Checkout', color: 'var(--color-primario)', aporte: 'Trabaja para que registrarse, iniciar sesión y comprar sea un proceso simple, rápido y confiable.' },
  { inicial: 'K', nombre: 'Katerine', rol: 'Contenido & Admin', color: 'var(--color-texto)', aporte: 'Da forma a los contenidos y a la gestión interna para que la información de GRWU sea clara, atractiva y útil.' },
];

const Nosotros = () => {
  return (
    <div className="container py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <span className="text-uppercase fw-bold" style={{ color: 'var(--color-secundario)', letterSpacing: '3px' }}>CONÓCENOS</span>
        <h1 className="display-4 fw-bold mt-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Tu estilo no necesita permiso.</h1>
        <p className="lead text-muted mx-auto mt-3" style={{ maxWidth: '700px' }}>
          En GRWU creemos que vestirse también es una forma de contar quién eres. Somos una tienda de moda urbana creada para personas que buscan prendas cómodas, versátiles y con personalidad.
        </p>
      </div>

      {/* Historia y Video */}
      <div className="row g-4 mb-5 align-items-center">
        <div className="col-lg-6">
          <span className="text-uppercase fw-bold small" style={{ color: 'var(--color-secundario)', letterSpacing: '2px' }}>DESDE EL COMIENZO</span>
          <h2 className="display-6 fw-bold mt-2 mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Nuestra historia</h2>
          <p className="text-muted">GRWU nació con una idea simple: acercar la moda urbana a más personas en Chile. Queremos que encontrar prendas con estilo, cómodas y fáciles de combinar no sea complicado ni inaccesible.</p>
          <p className="text-muted">Para nosotros, cada outfit puede reflejar una historia, una actitud o un momento. Por eso buscamos ofrecer prendas versátiles que se adapten a distintos estilos, cuerpos y formas de vivir la ciudad.</p>
          <div className="p-3 mt-4 rounded" style={{ backgroundColor: 'var(--color-secundario)', color: '#fff' }}>
            <strong>Get Ready With Us</strong> es una invitación a prepararte para ser tú, sin reglas impuestas.
          </div>
        </div>
        <div className="col-lg-6">
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
            {/* Recuerda tener el video en public/img/ */}
            <video controls poster="/img/portada.jpeg">
              <source src="/img/videoGRWU.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          </div>
        </div>
      </div>

      {/* Misión y Visión con ÍCONOS */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4" style={{ borderLeft: '4px solid var(--color-primario)' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <img src="/img/iconos/misión.png" alt="Misión" style={{ width: '40px' }} />
              <h3 className="h4 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Misión</h3>
            </div>
            <p className="text-muted mb-0">Crear una experiencia de compra cercana, accesible y confiable, ofreciendo moda urbana versátil para que cada persona pueda expresarse con libertad y autenticidad.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4" style={{ borderLeft: '4px solid var(--color-texto)' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <img src="/img/iconos/visión.png" alt="Visión" style={{ width: '40px' }} />
              <h3 className="h4 fw-bold mb-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Visión</h3>
            </div>
            <p className="text-muted mb-0">Convertirnos en una marca reconocida en Chile y Latinoamérica por conectar la moda urbana con la diversidad, la inclusión y la identidad de cada persona.</p>
          </div>
        </div>
      </div>

      {/* Valores con ÍCONOS */}
      <div className="text-center mb-4">
        <h2 className="display-6 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Lo que nos representa</h2>
      </div>
      <div className="row g-3 mb-5">
        {[
          { t: 'Autenticidad', d: 'No creemos en una sola forma de vestir. Tu estilo habla por ti y queremos acompañarte a expresarlo.', i: '/img/iconos/autenticidad.png' },
          { t: 'Inclusión', d: 'La moda urbana es para todas las personas, identidades, cuerpos y estilos.', i: '/img/iconos/inclusión.png' },
          { t: 'Conciencia', d: 'Valoramos prendas versátiles que puedas combinar, reutilizar y usar durante más tiempo.', i: '/img/iconos/conciencia.png' },
          { t: 'Actitud', d: 'Queremos que te sientas listo o lista para crear, salir y vivir a tu propio ritmo.', i: '/img/iconos/actitud.png' },
        ].map((v, i) => (
          <div className="col-md-6 col-lg-3" key={i}>
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <img src={v.i} alt={v.t} style={{ width: '45px', margin: '0 auto 15px auto' }} />
              <h5 className="fw-bold">{v.t}</h5>
              <p className="text-muted small mb-0">{v.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Equipo */}
      <div className="text-center mb-4 pt-4 border-top">
        <h2 className="display-6 fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Detrás de GRWU hay personas</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Somos un equipo que combina tecnología, organización y creatividad para construir una experiencia de compra clara, cercana y funcional.</p>
      </div>
      <div className="row g-4 justify-content-center">
        {EQUIPO.map(persona => (
          <div className="col-12 col-md-4" key={persona.nombre}>
            <TeamCard {...persona} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros;