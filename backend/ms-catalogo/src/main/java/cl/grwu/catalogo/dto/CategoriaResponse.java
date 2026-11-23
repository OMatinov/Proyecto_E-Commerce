package cl.grwu.catalogo.dto;

import cl.grwu.catalogo.entity.Categoria;

/**
 * Respuesta de categoria (contrato 7.3).
 */
public record CategoriaResponse(
        String id,
        String slug,
        String nombre,
        String descripcion,
        String imagen,
        String genero
) {

    public static CategoriaResponse desde(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getSlug(),
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.getImagen(),
                categoria.getGenero()
        );
    }
}
