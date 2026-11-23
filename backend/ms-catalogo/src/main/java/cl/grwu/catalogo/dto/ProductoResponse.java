package cl.grwu.catalogo.dto;

import cl.grwu.catalogo.entity.Categoria;
import cl.grwu.catalogo.entity.Producto;

import java.util.List;

/**
 * Respuesta de producto, con la forma exacta del contrato 8.5:
 * incluye categoriaId y categoriaSlug, pero no la entidad ni sus relaciones.
 */
public record ProductoResponse(
        String id,
        String nombre,
        String descripcion,
        Integer precio,
        Integer precioOriginal,
        Integer oferta,
        String categoriaId,
        String categoriaSlug,
        String genero,
        Integer stock,
        String imagen,
        List<String> imagenes
) {

    public static ProductoResponse desde(Producto producto) {
        Categoria categoria = producto.getCategoria();
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getPrecioOriginal() == null ? 0 : producto.getPrecioOriginal(),
                producto.getOferta() == null ? 0 : producto.getOferta(),
                categoria == null ? null : categoria.getId(),
                categoria == null ? null : categoria.getSlug(),
                producto.getGenero(),
                producto.getStock(),
                producto.getImagen(),
                producto.getImagenes() == null ? List.of() : List.copyOf(producto.getImagenes())
        );
    }
}
