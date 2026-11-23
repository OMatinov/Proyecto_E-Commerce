package cl.grwu.boletas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class CrearBoletaRequest {

    @NotEmpty(message = "La boleta debe tener al menos un producto")
    @Valid
    private List<ItemRequest> items;

    @Pattern(regexp = "estandar|premium", message = "Despacho no válido")
    @NotBlank(message = "El tipo de despacho es obligatorio")
    private String despacho; // "estandar" o "premium"

    @Pattern(regexp = "credito|debito|transferencia", message = "Método de pago no válido")
    @NotBlank(message = "El método de pago es obligatorio")
    private String metodoPago; // "credito", "debito", "transferencia"

    @NotNull(message = "Los datos del cliente son obligatorios")
    @Valid
    private ClienteRequest cliente;

    @NotNull(message = "La direcciÃ³n es obligatoria")
    @Valid
    private DireccionRequest direccion;

    @Data
    public static class ItemRequest {
        @NotBlank(message = "El ID del producto es obligatorio")
        private String productoId;

        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        @NotNull(message = "La cantidad es obligatoria")
        private Integer cantidad;
    }

    @Data
    public static class ClienteRequest {
        @NotBlank
        private String nombre;
        @NotBlank
        private String apellidos;
        @Email(message = "Correo no válido")
        @Pattern(regexp = "(?i).*@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$", message = "Dominio de correo no permitido")
        @NotBlank
        private String correo;
    }

    @Data
    public static class DireccionRequest {
        @NotBlank
        private String calle;
        private String departamento; // Opcional
        @Size(max = 200, message = "Indicaciones máximo 200 caracteres")
        private String indicaciones; // Opcional
        @NotBlank
        private String region;
        @NotBlank
        private String comuna;
    }
}