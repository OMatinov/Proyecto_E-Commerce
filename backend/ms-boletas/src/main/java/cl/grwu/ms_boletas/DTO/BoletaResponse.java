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
    
    // Datos del cliente
    private ClienteResponse cliente;
    
    // Datos de dirección
    private DireccionResponse direccion;
    
    // Montos
    private Integer subtotal;
    private Integer envio;
    private Integer total;
    
    // Detalles de la compra
    private String despacho;
    private String metodoPago;
    private String estado;
    private String motivoRechazo;
    
    private List<DetalleResponse> items;

    @Data
    public static class ClienteResponse {
        private String nombre;
        private String apellidos;
        private String correo;
    }

    @Data
    public static class DireccionResponse {
        private String calle;
        private String departamento;
        private String indicaciones;
        private String region;
        private String comuna;
    }

    @Data
    public static class DetalleResponse {
        private String productoId;
        private String nombre;
        private String imagen;
        private String categoria;
        private Integer precioUnitario;
        private Integer cantidad;
        private Integer subtotal;
    }
}