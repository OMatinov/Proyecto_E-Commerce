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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Reglas de negocio de los productos del catalogo.
 * El backend es la autoridad: valida precios, coherencia de oferta, stock y
 * existencia de la categoria antes de guardar.
 */
@Service
public class ProductoService {

    private static final int UMBRAL_CRITICO_POR_DEFECTO = 5;
    private static final Set<String> GENEROS_VALIDOS = Set.of("hombre", "mujer", "unisex");

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(String categoria,
                                         String genero,
                                         Boolean oferta,
                                         String texto,
                                         Boolean criticos,
                                         Integer umbral) {

        Integer ofertaMinima = null;
        Integer ofertaMaxima = null;
        if (oferta != null) {
            if (oferta) {
                ofertaMinima = 1;
            } else {
                ofertaMinima = 0;
                ofertaMaxima = 0;
            }
        }

        Integer umbralAplicado = Boolean.TRUE.equals(criticos)
                ? (umbral == null ? UMBRAL_CRITICO_POR_DEFECTO : Math.max(umbral, 0))
                : null;

        String categoriaSlug = recortar(categoria);
        if (categoriaSlug != null) {
            categoriaSlug = categoriaSlug.toLowerCase(Locale.ROOT);
        }

        return productoRepository.buscar(
                        categoriaSlug,
                        normalizarGenero(genero),
                        ofertaMinima,
                        ofertaMaxima,
                        recortar(texto),
                        umbralAplicado)
                .stream()
                .map(ProductoResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(String id) {
        return ProductoResponse.desde(buscarActivo(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = buscarCategoria(request.categoria());
        Precios precios = validarPrecios(request);

        Producto producto = new Producto();
        producto.setId(siguienteId());
        aplicar(producto, request, categoria, precios);
        return ProductoResponse.desde(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(String id, ProductoRequest request) {
        Producto producto = buscarActivo(id);
        Categoria categoria = buscarCategoria(request.categoria());
        Precios precios = validarPrecios(request);

        aplicar(producto, request, categoria, precios);
        return ProductoResponse.desde(productoRepository.save(producto));
    }

    /** Borrado logico: el producto sigue en la base con activo = false. */
    @Transactional
    public void eliminar(String id) {
        Producto producto = buscarActivo(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    /**
     * Ajuste interno de stock para ms-boletas.
     * "descontar" usa un UPDATE condicional atomico: si no alcanza el stock
     * responde 409, y si el producto no existe o esta inactivo responde 404.
     */
    @Transactional
    public ProductoResponse ajustarStock(String id, StockRequest request) {
        if ("descontar".equals(request.operacion())) {
            int filas = productoRepository.descontarStock(id, request.cantidad());
            if (filas == 0) {
                if (productoRepository.findByIdAndActivoTrue(id).isEmpty()) {
                    throw new RecursoNoEncontradoException("Producto no encontrado: " + id);
                }
                throw new ConflictoException("Stock insuficiente para " + id);
            }
        } else {
            int filas = productoRepository.reponerStock(id, request.cantidad());
            if (filas == 0) {
                throw new RecursoNoEncontradoException("Producto no encontrado: " + id);
            }
        }

        return ProductoResponse.desde(buscarActivo(id));
    }

    private Producto buscarActivo(String id) {
        return productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + id));
    }

    private Categoria buscarCategoria(String slug) {
        String normalizado = normalizarSlug(slug);
        return categoriaRepository.findBySlug(normalizado)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada: " + slug));
    }

    private void aplicar(Producto producto,
                         ProductoRequest request,
                         Categoria categoria,
                         Precios precios) {
        producto.setNombre(request.nombre().trim());
        producto.setDescripcion(recortar(request.descripcion()));
        producto.setPrecio(request.precio());
        producto.setPrecioOriginal(precios.original());
        producto.setOferta(precios.oferta());
        producto.setCategoria(categoria);
        producto.setGenero(normalizarGeneroObligatorio(request.genero()));
        producto.setStock(request.stock());
        producto.setImagen(recortar(request.imagen()));
        producto.setImagenes(request.imagenes() == null
                ? new ArrayList<>()
                : new ArrayList<>(request.imagenes()));
        producto.setActivo(true);
    }

    /**
     * Si hay oferta, el precio original debe ser mayor que el final.
     * Si no hay oferta, el precio original se normaliza a 0 (contrato 7.4).
     */
    private Precios validarPrecios(ProductoRequest request) {
        int oferta = request.oferta() == null ? 0 : request.oferta();
        int original = request.precioOriginal() == null ? 0 : request.precioOriginal();

        if (oferta == 0) {
            return new Precios(0, 0);
        }

        if (original <= request.precio()) {
            throw new SolicitudInvalidaException(
                    "Si hay oferta, el precio original debe ser mayor que el precio final");
        }

        return new Precios(original, oferta);
    }

    private String normalizarGenero(String genero) {
        if (genero == null || genero.isBlank()) {
            return null;
        }
        String normalizado = genero.trim().toLowerCase(Locale.ROOT);
        if (!GENEROS_VALIDOS.contains(normalizado)) {
            throw new SolicitudInvalidaException("El genero debe ser hombre, mujer o unisex");
        }
        return normalizado;
    }

    private String normalizarGeneroObligatorio(String genero) {
        String normalizado = genero == null ? "" : genero.trim().toLowerCase(Locale.ROOT);
        if (!GENEROS_VALIDOS.contains(normalizado)) {
            throw new SolicitudInvalidaException("El genero debe ser hombre, mujer o unisex");
        }
        return normalizado;
    }

    private String normalizarSlug(String slug) {
        return slug == null ? "" : slug.trim().toLowerCase(Locale.ROOT);
    }

    private String recortar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private String siguienteId() {
        Long maximo = productoRepository.maxNumero();
        return String.format("p-%03d", (maximo == null ? 0L : maximo) + 1);
    }

    private record Precios(int original, int oferta) {
    }
}
