package cl.grwu.boletas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CrearBoletaRequest {

    @NotEmpty(message = "La boleta debe tener al menos un producto")
    @Valid
    private List<ItemRequest> items;

    @NotBlank(message = "El tipo de despacho es obligatorio")
    private String despacho; // "estandar" o "premium"

    @NotBlank(message = "El mÃ©todo de pago es obligatorio")
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

        @NotNull(message = "La cantidad es obligatoria")
        private Integer cantidad;
    }

    @Data
    public static class ClienteRequest {
        @NotBlank
        private String nombre;
        @NotBlank
        private String apellidos;
        @NotBlank
        private String correo;
    }

    @Data
    public static class DireccionRequest {
        @NotBlank
        private String calle;
        private String departamento; // Opcional
        private String indicaciones; // Opcional
        @NotBlank
        private String region;
        @NotBlank
        private String comuna;
    }
}