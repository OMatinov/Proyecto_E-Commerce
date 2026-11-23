package cl.grwu.catalogo.service;

import cl.grwu.catalogo.dto.ProductoRequest;
import cl.grwu.catalogo.dto.ProductoResponse;
import cl.grwu.catalogo.dto.StockRequest;
import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.entity.Producto;
import cl.grwu.catalogo.exception.ConflictoException;
import cl.grwu.catalogo.exception.RecursoNoEncontradoException;
import cl.grwu.catalogo.exception.SolicitudInvalidaException;
import cl.grwu.catalogo.repository.CategoriaRepository;
import cl.grwu.catalogo.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void crearAsignaSiguienteIdYNormalizaPrecioOriginalSinOferta() {
        when(categoriaRepository.findBySlug("polerones"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));
        when(productoRepository.maxNumero()).thenReturn(101L);
        when(productoRepository.save(any(Producto.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        ProductoResponse respuesta = productoService.crear(
                request(19990, 25990, 0, "polerones", "mujer"));

        assertEquals("p-102", respuesta.id());
        assertEquals(0, respuesta.precioOriginal(), "sin oferta el precio original debe quedar en 0");
        assertEquals(0, respuesta.oferta());
        assertEquals("c-001", respuesta.categoriaId());
        assertEquals("polerones", respuesta.categoriaSlug());
        assertTrue(respuesta.imagenes().isEmpty());
    }

    @Test
    void crearConOfertaConservaPrecioOriginal() {
        when(categoriaRepository.findBySlug("polerones"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));
        when(productoRepository.maxNumero()).thenReturn(0L);
        when(productoRepository.save(any(Producto.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        ProductoResponse respuesta = productoService.crear(
                request(19990, 25990, 20, "polerones", "unisex"));

        assertEquals("p-001", respuesta.id());
        assertEquals(25990, respuesta.precioOriginal());
        assertEquals(20, respuesta.oferta());
    }

    @Test
    void crearConOfertaExigePrecioOriginalMayorQueElFinal() {
        when(categoriaRepository.findBySlug("polerones"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));

        assertThrows(SolicitudInvalidaException.class,
                () -> productoService.crear(request(19990, 19990, 20, "polerones", "mujer")));

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void crearConCategoriaInexistenteDevuelve404() {
        when(categoriaRepository.findBySlug("inexistente")).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class,
                () -> productoService.crear(request(19990, 0, 0, "inexistente", "mujer")));

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void crearConGeneroInvalidoDevuelve400() {
        when(categoriaRepository.findBySlug("polerones"))
                .thenReturn(Optional.of(categoria("c-001", "polerones")));
        when(productoRepository.maxNumero()).thenReturn(0L);

        assertThrows(SolicitudInvalidaException.class,
                () -> productoService.crear(request(19990, 0, 0, "polerones", "otro")));

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void obtenerProductoInactivoDevuelve404() {
        when(productoRepository.findByIdAndActivoTrue("p-001")).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> productoService.obtener("p-001"));
    }

    @Test
    void eliminarHaceBorradoLogico() {
        Producto producto = producto("p-001", true);
        when(productoRepository.findByIdAndActivoTrue("p-001")).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class)))
                .thenAnswer(invocacion -> invocacion.getArgument(0));

        productoService.eliminar("p-001");

        assertFalse(producto.getActivo(), "el borrado debe ser logico, no fisico");
        verify(productoRepository).save(producto);
        verify(productoRepository, never()).delete(any(Producto.class));
    }

    @Test
    void descontarSinStockSuficienteDevuelve409() {
        when(productoRepository.descontarStock("p-001", 5)).thenReturn(0);
        when(productoRepository.findByIdAndActivoTrue("p-001"))
                .thenReturn(Optional.of(producto("p-001", true)));

        assertThrows(ConflictoException.class,
                () -> productoService.ajustarStock("p-001", new StockRequest(5, "descontar")));
    }

    @Test
    void descontarProductoInexistenteDevuelve404() {
        when(productoRepository.descontarStock("p-999", 1)).thenReturn(0);
        when(productoRepository.findByIdAndActivoTrue("p-999")).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class,
                () -> productoService.ajustarStock("p-999", new StockRequest(1, "descontar")));
    }

    @Test
    void reponerStockDevuelveElProductoActualizado() {
        Producto producto = producto("p-001", true);
        producto.setStock(12);
        when(productoRepository.reponerStock("p-001", 2)).thenReturn(1);
        when(productoRepository.findByIdAndActivoTrue("p-001")).thenReturn(Optional.of(producto));

        ProductoResponse respuesta = productoService.ajustarStock(
                "p-001", new StockRequest(2, "reponer"));

        assertEquals(12, respuesta.stock());
    }

    @Test
    void listarTraduceOfertaYCriticosAlRangoDelRepositorio() {
        when(productoRepository.buscar(eq("polerones"), isNull(), eq(1), isNull(), isNull(), eq(5)))
                .thenReturn(List.of());

        productoService.listar(" Polerones ", null, true, "   ", true, null);

        verify(productoRepository).buscar("polerones", null, 1, null, null, 5);
    }

    @Test
    void listarSinOfertaPideRangoCeroCero() {
        when(productoRepository.buscar(isNull(), isNull(), eq(0), eq(0), isNull(), isNull()))
                .thenReturn(List.of());

        productoService.listar(null, null, false, null, null, null);

        verify(productoRepository).buscar(null, null, 0, 0, null, null);
    }

    @Test
    void listarConGeneroInvalidoDevuelve400() {
        assertThrows(SolicitudInvalidaException.class,
                () -> productoService.listar(null, "otro", null, null, null, null));

        verify(productoRepository, never()).buscar(any(), any(), any(), any(), any(), any());
    }

    private ProductoRequest request(Integer precio,
                                    Integer precioOriginal,
                                    Integer oferta,
                                    String categoria,
                                    String genero) {
        return new ProductoRequest("Poleron GRWU", "Descripcion", precio, precioOriginal,
                oferta, categoria, genero, 10, "img/poleron.png", null);
    }

    private Categoria categoria(String id, String slug) {
        Categoria categoria = new Categoria();
        categoria.setId(id);
        categoria.setSlug(slug);
        categoria.setNombre(slug);
        return categoria;
    }

    private Producto producto(String id, boolean activo) {
        Producto producto = new Producto();
        producto.setId(id);
        producto.setNombre("Poleron GRWU");
        producto.setPrecio(19990);
        producto.setPrecioOriginal(0);
        producto.setOferta(0);
        producto.setCategoria(categoria("c-001", "polerones"));
        producto.setGenero("unisex");
        producto.setStock(10);
        producto.setImagen("img/poleron.png");
        producto.setImagenes(new ArrayList<>());
        producto.setActivo(activo);
        return producto;
    }
}
