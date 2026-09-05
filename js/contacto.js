
// Función para mostrar/ocultar error en un campo
function mostrarError(idCampo, mensaje) {
  const input = document.getElementById(idCampo);
  const error = document.getElementById('error-' + idCampo);
  if (!input || !error) return;

  if (mensaje) {
    input.classList.add('input-invalido');
    error.textContent = mensaje;
    error.style.display = 'block';
  } else {
    input.classList.remove('input-invalido');
    error.textContent = '';
    error.style.display = 'none';
  }
}

// Validar nombre
function validarNombreContacto() {
  const valor = document.getElementById('nombreContacto').value.trim();
  let mensaje = '';
  if (!valor) {
    mensaje = 'El nombre es obligatorio.';
  } else if (valor.length > 100) {
    mensaje = 'El nombre no puede superar los 500 caracteres.';
  }
  mostrarError('nombreContacto', mensaje);
  return !mensaje;
}

// Validar correo (solo @duoc.cl, @hotmail.com, @gmail.com)
function validarCorreoContacto() {
  const valor = document.getElementById('correoContacto').value.trim();
  let mensaje = '';
  if (!valor) {
    mensaje = 'El correo es obligatorio.';
  } else if (valor.length > 100) {
    mensaje = 'El correo no puede superar los 500 caracteres.';
  } else {
    const dominiosPermitidos = /@(duoc\.cl|profesor.duoc\.cl|gmail\.com)$/i;
    if (!dominiosPermitidos.test(valor)) {
        mensaje = 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
  }
  mostrarError('correoContacto', mensaje);
  return !mensaje;
}

// Validar comentario
function validarComentarioContacto() {
  const valor = document.getElementById('comentarioContacto').value.trim();
  let mensaje = '';
  if (!valor) {
    mensaje = 'El comentario es obligatorio.';
  } else if (valor.length > 500) {
    mensaje = 'El comentario no puede superar los 500 caracteres.';
  }
  mostrarError('comentarioContacto', mensaje);
  return !mensaje;
}

// Inicializar eventos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  const formContacto = document.getElementById('formContacto');
  if (!formContacto) return;

  // Validar al salir del campo (blur)
  document.getElementById('nombreContacto').addEventListener('blur', validarNombreContacto);
  document.getElementById('correoContacto').addEventListener('blur', validarCorreoContacto);
  document.getElementById('comentarioContacto').addEventListener('blur', validarComentarioContacto);

  // Validar al enviar el formulario
  formContacto.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const esValido = [
      validarNombreContacto(),
      validarCorreoContacto(),
      validarComentarioContacto()
    ].every(Boolean);

    if (!esValido) return;

    // Guardar mensaje en localStorage para que admin/contactos.html lo pueda leer
    const mensajes = JSON.parse(localStorage.getItem('grwu_contactos') || '[]');
    mensajes.push({
      nombre: document.getElementById('nombreContacto').value.trim(),
      correo: document.getElementById('correoContacto').value.trim(),
      comentario: document.getElementById('comentarioContacto').value.trim(),
      fecha: new Date().toISOString(),
      leido: false
    });
    localStorage.setItem('grwu_contactos', JSON.stringify(mensajes));

    // Mostrar mensaje de éxito y limpiar formulario
    const mensajeExito = document.getElementById('mensajeExito');
    if (mensajeExito) {
      mensajeExito.style.display = 'block';
      formContacto.reset();
      
      // Ocultar después de 4 segundos
      setTimeout(function() {
        mensajeExito.style.display = 'none';
      }, 4000);
    }
  });
});