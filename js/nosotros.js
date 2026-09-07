document.addEventListener('DOMContentLoaded', function() {
  const botonesAporte = document.querySelectorAll('.btn-team-aporte');

  botonesAporte.forEach(function(boton) {
    boton.addEventListener('click', function() {
      // Obtiene el ID del contenedor objetivo desde el atributo data-target
      const targetId = this.getAttribute('data-target');
      const contenedorAporte = document.getElementById(targetId);

      if (contenedorAporte) {
        // Alterna la clase 'hidden' para mostrar/ocultar
        const estaOculto = contenedorAporte.classList.contains('hidden');
        
        if (estaOculto) {
          contenedorAporte.classList.remove('hidden');
          this.classList.add('active'); // Cambia el estilo del botón
          this.textContent = 'Ocultar aporte'; // Cambia el texto del botón
        } else {
          contenedorAporte.classList.add('hidden');
          this.classList.remove('active');
          this.textContent = 'Conocer su aporte'; // Vuelve al texto original
        }
      }
    });
  });
});