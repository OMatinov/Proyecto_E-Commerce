
// Función para cargar y mostrar mensajes desde localStorage
function cargarMensajes() {
  const listaMensajes = document.getElementById('listaMensajes');
  const totalMensajes = document.getElementById('totalMensajes');
  const noLeidos = document.getElementById('noLeidos');
  const leidos = document.getElementById('leidos');

  // Obtener mensajes guardados
  const mensajes = JSON.parse(localStorage.getItem('grwu_contactos') || '[]');

  // Actualizar estadísticas
  const total = mensajes.length;
  const sinLeer = mensajes.filter(m => !m.leido).length;
  const leidosCount = mensajes.filter(m => m.leido).length;

  if (totalMensajes) totalMensajes.textContent = total;
  if (noLeidos) noLeidos.textContent = sinLeer;
  if (leidos) leidos.textContent = leidosCount;

  // Si no hay mensajes, mostrar estado vacío
  if (mensajes.length === 0) {
    listaMensajes.innerHTML = `
      <div class="empty-state">
        <p>📭 No hay mensajes aún</p>
        <p>Los mensajes aparecerán aquí cuando alguien envíe el formulario de contacto.</p>
      </div>
    `;
    return;
  }

  // Renderizar cada mensaje
  listaMensajes.innerHTML = mensajes.map(function(mensaje, index) {
    const fecha = new Date(mensaje.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const horaFormateada = fecha.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const claseNoLeido = mensaje.leido ? '' : ' contact-card-unread';
    const badgeLeido = mensaje.leido 
      ? '<span class="table-badge badge-gris">Leído</span>' 
      : '<span class="table-badge badge-primario">Nuevo</span>';

    return `
      <div class="contact-card${claseNoLeido}" data-id="${index}">
        <div class="contact-card-header">
          <div>
            ${badgeLeido}
            <strong class="contact-name">${mensaje.nombre}</strong>
          </div>
          <span class="contact-date">📅 ${fechaFormateada}, ${horaFormateada}</span>
        </div>
        <p class="contact-meta">📧 ${mensaje.correo}</p>
        <p class="contact-subject"><strong>Comentario:</strong> ${mensaje.comentario}</p>
        <div class="blog-actions">
          <button class="btn-small btn-marcar-leido" data-id="${index}" ${mensaje.leido ? 'disabled' : ''}>
            ${mensaje.leido ? '✓ Leído' : '✓ Marcar como leído'}
          </button>
          <button class="btn-small btn-small-delete btn-eliminar-mensaje" data-id="${index}">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Agregar eventos a los botones
  document.querySelectorAll('.btn-marcar-leido').forEach(function(boton) {
    boton.addEventListener('click', function() {
      marcarComoLeido(parseInt(this.dataset.id));
    });
  });

  document.querySelectorAll('.btn-eliminar-mensaje').forEach(function(boton) {
    boton.addEventListener('click', function() {
      eliminarMensaje(parseInt(this.dataset.id));
    });
  });
}

// Marcar mensaje como leído
function marcarComoLeido(index) {
  const mensajes = JSON.parse(localStorage.getItem('grwu_contactos') || '[]');
  if (mensajes[index]) {
    mensajes[index].leido = true;
    localStorage.setItem('grwu_contactos', JSON.stringify(mensajes));
    cargarMensajes();
  }
}

// Eliminar mensaje
function eliminarMensaje(index) {
  const mensajes = JSON.parse(localStorage.getItem('grwu_contactos') || '[]');
  if (mensajes[index]) {
    mensajes.splice(index, 1);
    localStorage.setItem('grwu_contactos', JSON.stringify(mensajes));
    cargarMensajes();
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  cargarMensajes();

  // Botón de actualizar
  const btnActualizar = document.querySelector('.btn-actualizar');
  if (btnActualizar) {
    btnActualizar.addEventListener('click', cargarMensajes);
  }
});