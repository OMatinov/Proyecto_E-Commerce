import { useState } from 'react';

export default function TeamCard({ inicial, nombre, rol, aporte, color }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="card border-0 shadow-sm text-center h-100">
      <div className="card-body">
        <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
             style={{ width: 80, height: 80, backgroundColor: color, color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
          {inicial}
        </div>
        <h5 className="fw-bold">{nombre}</h5>
        <p className="text-muted small mb-2">{rol}</p>
        {abierto && <p className="small mb-2 text-muted">{aporte}</p>}
        <button className="btn btn-sm btn-outline-dark rounded-pill" onClick={() => setAbierto(!abierto)}>
          {abierto ? 'Ocultar aporte' : 'Conocer su aporte'}
        </button>
      </div>
    </div>
  );
}