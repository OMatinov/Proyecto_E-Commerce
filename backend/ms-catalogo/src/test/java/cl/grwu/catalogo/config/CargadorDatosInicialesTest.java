package cl.grwu.catalogo.config;

import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.entity.Producto;
import cl.grwu.catalogo.repository.CategoriaRepository;
import cl.grwu.catalogo.repository.ProductoRepository;
import cl.grwu.catalogo.support.JsonTestSupport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CargadorDatosInicialesTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    private CargadorDatosIniciales cargador;

    @BeforeEach
    void preparar() {
        cargador = new CargadorDatosIniciales(categoriaRepository, productoRepository,
                JsonTestSupport.objectMapper());
    }

    @Test
    void cargaLas13CategoriasYLos102ProductosCuandoLaBaseEstaVacia() throws Exception {
        List<Categoria> categoriasGuardadas = new ArrayList<>();
        when(categoriaRepository.existsById(anyString())).thenReturn(false);
        when(categoriaRepository.existsBySlug(anyString())).thenReturn(false);
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocacion -> {
            Categoria categoria = invocacion.getArgument(0);
            categoriasGuardadas.add(categoria);
            return categoria;
        });
        when(categoriaRepository.findAll()).thenAnswer(invocacion -> categoriasGuardadas);

        List<Producto> productosGuardados = new ArrayList<>();
        when(productoRepository.existsById(anyString())).thenReturn(false);
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocacion -> {
            Producto producto = invocacion.getArgument(0);
            productosGuardados.add(producto);
            return producto;
        });

        cargador.run(null);

        assertEquals(13, categoriasGuardadas.size());
        assertEquals(102, productosGuardados.size());

        Producto primero = productosGuardados.stream()
                .filter(producto -> "p-001".equals(producto.getId()))
                .findFirst()
                .orElseThrow();

        assertEquals("Abrigo Largo Paño", primero.getNombre(), "el JSON debe leerse como UTF-8");
        assertEquals("c-005", primero.getCategoria().getId());
        assertEquals("abrigos", primero.getCategoria().getSlug());
        assertEquals(50690, primero.getPrecio());
        assertEquals(42, primero.getStock());
        assertTrue(primero.getActivo());
    }

    @Test
    void noDuplicaNadaCuandoTodoYaExiste() throws Exception {
        when(categoriaRepository.existsById(anyString())).thenReturn(true);
        when(categoriaRepository.findAll()).thenReturn(List.of());
        when(productoRepository.existsById(anyString())).thenReturn(true);

        cargador.run(null);

        verify(categoriaRepository, never()).save(any(Categoria.class));
        verify(productoRepository, never()).save(any(Producto.class));
    }
}
