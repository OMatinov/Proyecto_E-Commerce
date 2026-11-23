package cl.grwu.catalogo.config;

import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.entity.Producto;
import cl.grwu.catalogo.repository.CategoriaRepository;
import cl.grwu.catalogo.repository.ProductoRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Carga inicial del catalogo (13 categorias y 102 productos) desde los JSON de
 * src/main/resources/seed.
 *
 * Es idempotente y no destructivo:
 * - solo inserta lo que falta (existsById / existsBySlug);
 * - nunca sobrescribe datos editados desde el panel de administracion;
 * - si la categoria de un producto no existe, omite ese producto y lo registra.
 */
@Component
public class CargadorDatosIniciales implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CargadorDatosIniciales.class);

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final ObjectMapper objectMapper;

    public CargadorDatosIniciales(CategoriaRepository categoriaRepository,
                                  ProductoRepository productoRepository,
                                  ObjectMapper objectMapper) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        List<CategoriaSeed> categorias = leer("seed/categorias.json", new TypeReference<>() {
        });
        List<ProductoSeed> productos = leer("seed/productos.json", new TypeReference<>() {
        });

        int categoriasNuevas = insertarCategoriasFaltantes(categorias);

        Map<String, Categoria> porSlug = new HashMap<>();
        for (Categoria categoria : categoriaRepository.findAll()) {
            porSlug.put(categoria.getSlug(), categoria);
        }

        int productosNuevos = insertarProductosFaltantes(productos, porSlug);

        log.info("Seed del catalogo: {} categorias nuevas y {} productos nuevos",
                categoriasNuevas, productosNuevos);
    }

    private int insertarCategoriasFaltantes(List<CategoriaSeed> semillas) {
        int nuevas = 0;
        for (CategoriaSeed semilla : semillas) {
            if (categoriaRepository.existsById(semilla.id())
                    || categoriaRepository.existsBySlug(semilla.slug())) {
                continue;
            }

            Categoria categoria = new Categoria();
            categoria.setId(semilla.id());
            categoria.setSlug(semilla.slug());
            categoria.setNombre(semilla.nombre());
            categoria.setDescripcion(semilla.descripcion());
            categoria.setImagen(semilla.imagen());
            categoria.setGenero(semilla.genero());
            categoriaRepository.save(categoria);
            nuevas++;
        }
        return nuevas;
    }

    private int insertarProductosFaltantes(List<ProductoSeed> semillas, Map<String, Categoria> porSlug) {
        int nuevos = 0;
        for (ProductoSeed semilla : semillas) {
            if (productoRepository.existsById(semilla.id())) {
                continue;
            }

            Categoria categoria = porSlug.get(semilla.categoria());
            if (categoria == null) {
                log.warn("Seed: se omite {} porque la categoria '{}' no existe",
                        semilla.id(), semilla.categoria());
                continue;
            }

            Producto producto = new Producto();
            producto.setId(semilla.id());
            producto.setNombre(semilla.nombre());
            producto.setDescripcion(semilla.descripcion());
            producto.setPrecio(semilla.precio());
            producto.setPrecioOriginal(semilla.precioOriginal() == null ? 0 : semilla.precioOriginal());
            producto.setOferta(semilla.oferta() == null ? 0 : semilla.oferta());
            producto.setCategoria(categoria);
            producto.setGenero(semilla.genero());
            producto.setStock(semilla.stock());
            producto.setImagen(semilla.imagen());
            producto.setImagenes(semilla.imagenes() == null
                    ? new ArrayList<>()
                    : new ArrayList<>(semilla.imagenes()));
            producto.setActivo(true);
            productoRepository.save(producto);
            nuevos++;
        }
        return nuevos;
    }

    private <T> T leer(String ruta, TypeReference<T> tipo) throws Exception {
        ClassPathResource recurso = new ClassPathResource(ruta);
        if (!recurso.exists()) {
            throw new IllegalStateException("No se encontro el archivo de seed: " + ruta);
        }
        try (InputStream entrada = recurso.getInputStream()) {
            return objectMapper.readValue(entrada, tipo);
        }
    }

    public record CategoriaSeed(
            String id,
            String slug,
            String nombre,
            String descripcion,
            String imagen,
            String genero
    ) {
    }

    public record ProductoSeed(
            String id,
            String nombre,
            String descripcion,
            Integer precio,
            Integer precioOriginal,
            Integer oferta,
            String categoria,
            String genero,
            Integer stock,
            String imagen,
            List<String> imagenes
    ) {
    }
}
