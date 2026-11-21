package cl.grwu.ms_boletas.DTO;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class BoletaResponse {
    private String id;
    private Long numero;
    private Instant fecha;
    private String usuarioRun;
    private Integer subtotal;
    private Integer envio;
    private Integer total;
    private String estado;
    private String motivoRechazo; // Solo si el pago fue rechazado
    private List<DetalleResponse> items;

    @Data
    public static class DetalleResponse {
        private String productoId;
        private String nombre;
        private Integer precioUnitario;
        private Integer cantidad;
        private Integer subtotal;
    }
}
