import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearUsuario } from '../../data/usuariosData';
import { validarRegistro } from '../../utils/formularios';
import CampoFormulario from '../../components/CampoFormulario';

const VACIO = {
  run: '', nombres: '', apellidos: '', correo: '',
  clave: '', clave2: '', region: '', comuna: '', telefono: '', rol: 'Cliente',
};

export default function AdminUsuarioNuevo() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const cambiar = (campo) => (e) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarRegistro(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    const res = crearUsuario(valores);
    if (!res.ok) { setMensaje(res.mensaje); return; }
    navigate('/admin/usuarios');
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Nuevo usuario</h1>
      {mensaje && <div className="alert alert-danger">{mensaje}</div>}
      <form onSubmit={enviar} noValidate className="row g-3" style={{ maxWidth: 800 }}>
        <div className="col-md-4"><CampoFormulario id="run" label="RUN" value={valores.run} onChange={cambiar('run')} error={errores.run} /></div>
        <div className="col-md-4"><CampoFormulario id="nombres" label="Nombres" value={valores.nombres} onChange={cambiar('nombres')} error={errores.nombres} /></div>
        <div className="col-md-4"><CampoFormulario id="apellidos" label="Apellidos" value={valores.apellidos} onChange={cambiar('apellidos')} error={errores.apellidos} /></div>
        <div className="col-md-6"><CampoFormulario id="correo" label="Correo" type="email" value={valores.correo} onChange={cambiar('correo')} error={errores.correo} /></div>
        <div className="col-md-3"><CampoFormulario id="clave" label="Contraseña" type="password" value={valores.clave} onChange={cambiar('clave')} error={errores.clave} /></div>
        <div className="col-md-3"><CampoFormulario id="clave2" label="Repetir" type="password" value={valores.clave2} onChange={cambiar('clave2')} error={errores.clave2} /></div>
        <div className="col-md-4"><CampoFormulario id="rol" label="Rol" value={valores.rol} onChange={cambiar('rol')}
          opciones={[{ value: 'Cliente', label: 'Cliente' }, { value: 'Vendedor', label: 'Vendedor' }, { value: 'Administrador', label: 'Administrador' }]} /></div>
        <div className="col-md-4"><CampoFormulario id="region" label="Región" value={valores.region} onChange={cambiar('region')} error={errores.region} /></div>
        <div className="col-md-4"><CampoFormulario id="comuna" label="Comuna" value={valores.comuna} onChange={cambiar('comuna')} error={errores.comuna} /></div>
        <div className="col-md-6"><CampoFormulario id="telefono" label="Teléfono (opcional)" value={valores.telefono} onChange={cambiar('telefono')} error={errores.telefono} /></div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">Guardar</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}