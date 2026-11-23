package cl.grwu.ms_boletas.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boleta")
@Data
@NoArgsConstructor
public class Boleta {

    @Id
    @Column(length = 15)
    private String id; // Ej: ORD-20260001

    @Column(nullable = false, unique = true)
    private Long numero; // Ej: 20260001

    @Column(nullable = false)
    private Instant fecha;

    @Column(name = "usuario_run", nullable = false, length = 9)
    private String usuarioRun;

    @Column(name = "cliente_nombre", nullable = false, length = 60)
    private String clienteNombre;

    @Column(name = "cliente_apellidos", nullable = false, length = 80)
    private String clienteApellidos;

    @Column(name = "cliente_correo", nullable = false, length = 100)
    private String clienteCorreo;

    @Column(name = "direccion_calle", nullable = false, length = 150)
    private String direccionCalle;

    @Column(name = "direccion_departamento", length = 30)
    private String direccionDepartamento;

    @Column(name = "direccion_indicaciones", length = 200)
    private String direccionIndicaciones;

    @Column(name = "direccion_region", nullable = false, length = 80)
    private String direccionRegion;

    @Column(name = "direccion_comuna", nullable = false, length = 80)
    private String direccionComuna;

    @Column(nullable = false)
    private Integer subtotal;

    @Column(nullable = false)
    private Integer envio;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false, length = 20)
    private String despacho; // estandar, premium

    @Column(name = "metodo_pago", nullable = false, length = 20)
    private String metodoPago; // credito, debito, transferencia

    @Column(nullable = false, length = 20)
    private String estado; // pagada, rechazada, enviada, entregada, cancelada

    @Column(name = "motivo_rechazo", length = 255)
    private String motivoRechazo;

    // Relación con los detalles (Cascade ALL para que se guarden juntos)
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoleta> items = new ArrayList<>();

    // Método auxiliar para agregar detalles y mantener la relación
    public void agregarItem(DetalleBoleta item) {
        items.add(item);
        item.setBoleta(this);
    }
}
