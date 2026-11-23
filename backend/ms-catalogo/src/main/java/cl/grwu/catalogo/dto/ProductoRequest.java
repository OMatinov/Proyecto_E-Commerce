package cl.grwu.catalogo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Cuerpo de POST y PUT /api/v1/productos.
 * La categoria se recibe por slug (polerones, abrigos, ...) porque es lo que
 * ya envia el formulario del panel de administracion.
 * Los montos son CLP enteros: nunca float ni double (AGENTS.md, seccion 2.19).
 */
public record ProductoRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 120, message = "El nombre no puede superar 120 caracteres")
        String nombre,

        @Size(max = 2000, message = "La descripcion no puede superar 2000 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @Min(value = 1, message = "El precio debe ser mayor que 0")
        Integer precio,

        @Min(value = 0, message = "El precio original no puede ser negativo")
        Integer precioOriginal,

        @Min(value = 0, message = "La oferta no puede ser negativa")
        @Max(value = 100, message = "La oferta no puede superar 100")
        Integer oferta,

        @NotBlank(message = "La categoria es obligatoria")
        @Size(max = 40, message = "La categoria no puede superar 40 caracteres")
        String categoria,

        @NotBlank(message = "El genero es obligatorio")
        @Pattern(regexp = "hombre|mujer|unisex", message = "El genero debe ser hombre, mujer o unisex")
        String genero,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        @Size(max = 255, message = "La imagen no puede superar 255 caracteres")
        String imagen,

        List<@Size(max = 255, message = "Cada imagen no puede superar 255 caracteres") String> imagenes
) {
}
