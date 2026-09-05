
// Función para filtrar los blogs según la categoría seleccionada
function filtrarBlogs(categoria) {
  // Obtener todos los botones y tarjetas
  const botones = document.querySelectorAll('.filter-btn');
  const tarjetas = document.querySelectorAll('.blog-card');

  // 1. Quitar la clase 'active' de todos los botones y ponerla en el correcto
  botones.forEach(function(boton) {
    boton.classList.remove('filter-btn-active');
    if (boton.textContent.trim().toLowerCase() === categoria.toLowerCase()) {
      boton.classList.add('filter-btn-active');
    }
  });

  // 2. Mostrar u ocultar las tarjetas según la categoría
  tarjetas.forEach(function(tarjeta) {
    const categoriaTarjeta = tarjeta.querySelector('.blog-category').textContent.toLowerCase();
    
    if (categoria.toLowerCase() === 'todos' || categoriaTarjeta.includes(categoria.toLowerCase())) {
      tarjeta.style.display = 'block';
    } else {
      tarjeta.style.display = 'none';
    }
  });
}

// Inicializar eventos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  const botones = document.querySelectorAll('.filter-btn');

  // Agregar el evento click a cada botón
  botones.forEach(function(boton) {
    boton.addEventListener('click', function() {
      // Obtener el texto del botón clickeado y llamar a la función
      const categoria = this.textContent.trim();
      filtrarBlogs(categoria);
    });
  });
});