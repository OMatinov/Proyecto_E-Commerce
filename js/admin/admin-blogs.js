
// Abrir modal para crear nuevo blog
function abrirModalBlog() {
  document.getElementById('modalBlog').classList.add('active');
}

// Cerrar modal
function cerrarModalBlog() {
  document.getElementById('modalBlog').classList.remove('active');
}

// Eliminar artículo (simulado)
function eliminarBlog(id) {
  if (confirm('¿Estás seguro de eliminar este artículo?')) {
    // Aquí iría la lógica real de eliminación
    console.log('Eliminando artículo:', id);
    // Por ahora solo recargamos la página
    location.reload();
  }
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
  // Botones de eliminar
  document.querySelectorAll('.btn-small-delete').forEach(function(boton) {
    boton.addEventListener('click', function() {
      const blogCard = this.closest('.blog-card');
      if (blogCard) {
        eliminarBlog(blogCard.dataset.id || 'unknown');
      }
    });
  });
});