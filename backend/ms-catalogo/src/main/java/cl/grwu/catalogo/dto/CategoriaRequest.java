package cl.grwu.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Cuerpo de POST y PUT /api/v1/categorias.
 * El slug es la clave publica de la categoria (se usa en las URLs del frontend).
 */
public record CategoriaRequest(

        @NotBlank(message = "El slug es obligatorio")
        @Size(max = 40, message = "El slug no puede superar 40 caracteres")
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "El slug solo admite minusculas, numeros y guiones")
        String slug,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 60, message = "El nombre no puede superar 60 caracteres")
        String nombre,

        @Size(max = 255, message = "La descripcion no puede superar 255 caracteres")
        String descripcion,

        @Size(max = 255, message = "La imagen no puede superar 255 caracteres")
        String imagen,

        @Pattern(regexp = "hombre|mujer|todos", message = "El genero debe ser hombre, mujer o todos")
        String genero
) {
}
