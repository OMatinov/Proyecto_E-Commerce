package cl.grwu.catalogo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Cuerpo de PATCH /api/v1/productos/{id}/stock, que solo consume ms-boletas.
 * operacion = "descontar" al pagar una boleta y "reponer" al cancelarla.
 */
public record StockRequest(

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser mayor que 0")
        Integer cantidad,

        @NotBlank(message = "La operacion es obligatoria")
        @Pattern(regexp = "descontar|reponer", message = "La operacion debe ser descontar o reponer")
        String operacion
) {
}
