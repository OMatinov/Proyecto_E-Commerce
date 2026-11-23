package cl.grwu.catalogo.service;

import cl.grwu.catalogo.dto.CategoriaRequest;
import cl.grwu.catalogo.dto.CategoriaResponse;
import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.exception.ConflictoException;
import cl.grwu.catalogo.exception.RecursoNoEncontradoException;
import cl.grwu.catalogo.repository.CategoriaRepository;
import cl.grwu.catalogo.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    @Test
    void crearGeneraElSiguienteIdNumerico() {
        when(categoriaRepository.existsBySlug("accesorios")).thenReturn(false);
        when(categoriaRepository.maxNumero()).thenReturn(11L);
        when(categoriaRepository.save(any(Categoria.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        CategoriaResponse respuesta = categoriaService.crear(
                new CategoriaRequest("accesorios", "Accesorios", "Gorros y cinturones", null, null));

        assertEquals("c-012", respuesta.id());
        assertEquals("accesorios", respuesta.slug());
    }

    @Test
    void crearNormalizaElSlugAMinusculas() {
        when(categoriaRepository.existsBySlug("accesorios")).thenReturn(false);
        when(categoriaRepository.maxNumero()).thenReturn(0L);
        when(categoriaRepository.save(any(Categoria.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        CategoriaResponse respuesta = categoriaService.crear(
                new CategoriaRequest("  Accesorios  ", "Accesorios", null, null, null));

        assertEquals("accesorios", respuesta.slug());
        assertEquals("c-001", respuesta.id());
    }

    @Test
    void crearConSlugDuplicadoDevuelve409() {
        when(categoriaRepository.existsBySlug("abrigos")).thenReturn(true);

        assertThrows(ConflictoException.class, () -> categoriaService.crear(
                new CategoriaRequest("abrigos", "Abrigos", null, null, null)));

        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    void eliminarCategoriaConProductosDevuelve409() {
        when(categoriaRepository.findById("c-001"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));
        when(productoRepository.existsByCategoriaId("c-001")).thenReturn(true);

        assertThrows(ConflictoException.class, () -> categoriaService.eliminar("c-001"));

        verify(categoriaRepository, never()).delete(any(Categoria.class));
    }

    @Test
    void eliminarCategoriaSinProductosLaBorra() {
        Categoria categoria = categoria("c-012", "accesorios");
        when(categoriaRepository.findById("c-012")).thenReturn(Optional.of(categoria));
        when(productoRepository.existsByCategoriaId("c-012")).thenReturn(false);

        categoriaService.eliminar("c-012");

        verify(categoriaRepository).delete(categoria);
    }

    @Test
    void obtenerPorSlugInexistenteDevuelve404() {
        when(categoriaRepository.findBySlug("inexistente")).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class,
                () -> categoriaService.obtenerPorSlug("inexistente"));
    }

    @Test
    void actualizarConSlugDeOtraCategoriaDevuelve409() {
        when(categoriaRepository.findById("c-001"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));
        when(categoriaRepository.existsBySlugAndIdNot("abrigos", "c-001")).thenReturn(true);

        assertThrows(ConflictoException.class, () -> categoriaService.actualizar("c-001",
                new CategoriaRequest("abrigos", "Abrigos", null, null, null)));

        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    private Categoria categoria(String id, String slug) {
        Categoria categoria = new Categoria();
        categoria.setId(id);
        categoria.setSlug(slug);
        categoria.setNombre(slug);
        return categoria;
    }
}
