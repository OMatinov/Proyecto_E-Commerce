// blogs.js - Lógica definitiva corregida
document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('.filter-btn');
    const tarjetas = document.querySelectorAll('.blog-card');

    function aplicarFiltro(categoria) {
        // Normalizamos solo para comparar, pero mantenemos la integridad del texto original
        const catNormalizada = categoria.trim().toLowerCase();

        // 1. Actualizar estado visual de botones
        botones.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.trim().toLowerCase() === catNormalizada) {
                btn.classList.add('active');
            }
        });

        // 2. Filtrar tarjetas
        tarjetas.forEach(card => {
            const catTarjeta = card.getAttribute('data-category').trim().toLowerCase();
            
            if (catNormalizada === 'todos' || catTarjeta === catNormalizada) {
                card.style.display = 'block';
                // Animación suave de entrada
                card.animate([
                    { opacity: 0, transform: 'translateY(15px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 400, easing: 'ease-out', fill: 'forwards' });
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Asignar eventos
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            aplicarFiltro(btn.textContent);
        });
    });

    // Inicializar mostrando todos al cargar
    aplicarFiltro('Todos');
});