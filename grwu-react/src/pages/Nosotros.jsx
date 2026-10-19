import React from 'react';
import TeamCard from '../components/TeamCard'; // <-- IMPORTANTE

const EQUIPO = [
  { inicial: 'M', nombre: 'Matías', rol: 'Productos & Catálogo', color: 'var(--color-secundario)', aporte: 'Organiza los productos para que cada prenda tenga la información necesaria.' },
  { inicial: 'C', nombre: 'César', rol: 'Usuarios & Checkout', color: 'var(--color-primario)', aporte: 'Trabaja para que registrarse, iniciar sesión y comprar sea simple y confiable.' },
  { inicial: 'K', nombre: 'Katerine', rol: 'Contenido & Admin', color: 'var(--color-texto)', aporte: 'Da forma a los contenidos y a la gestión interna para que la información sea clara.' },
];

const Nosotros = () => {
  return (
    <div className="container py-5">
      {/* ... (Tu sección de Hero y Misión/Visión se mantienen igual) ... */}
      
      {/* Sección Equipo */}
      <div className="text-center mb-4 mt-5">
        <h3 className="fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Nuestro Equipo</h3>
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