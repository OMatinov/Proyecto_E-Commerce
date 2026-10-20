import { useState } from 'react';
import { useSesion } from '../../context/SesionContext';
import { actualizarUsuario } from '../../data/usuariosData';
import CampoFormulario from '../../components/CampoFormulario';

export default function AdminPerfil() {
  const { usuario } = useSesion();
  const [valores, setValores] = useState(() => ({
    nombres: usuario?.nombres || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
  }));
  const [ok, setOk] = useState('');

  if (!usuario) return <div className="p-4"><h1 className="h3">Sin sesión activa</h1></div>;

  const cambiar = (campo) => (e) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    actualizarUsuario(usuario.run, valores);
    setOk('Datos actualizados correctamente.');
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Mi perfil</h1>
      {ok && <div className="alert alert-success">{ok}</div>}
      <form onSubmit={enviar} className="row g-3" style={{ maxWidth: 700 }}>
        <div className="col-md-6"><CampoFormulario id="nombres" label="Nombres" value={valores.nombres} onChange={cambiar('nombres')} /></div>
        <div className="col-md-6"><CampoFormulario id="apellidos" label="Apellidos" value={valores.apellidos} onChange={cambiar('apellidos')} /></div>
        <div className="col-md-6"><CampoFormulario id="correo" label="Correo" type="email" value={valores.correo} onChange={cambiar('correo')} /></div>
        <div className="col-md-6"><CampoFormulario id="telefono" label="Teléfono" value={valores.telefono} onChange={cambiar('telefono')} /></div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Actualizar</button>
        </div>
      </form>
    </div>
  );
}