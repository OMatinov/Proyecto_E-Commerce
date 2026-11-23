package cl.grwu.ms_boletas.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detalle_boleta")
@Data
@NoArgsConstructor
public class DetalleBoleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boleta_id", nullable = false)
    private Boleta boleta;

    @Column(name = "producto_id", nullable = false, length = 10)
    private String productoId;

    @Column(name = "nombre_producto", nullable = false, length = 120)
    private String nombreProducto;

    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;

    @Column(length = 255)
    private String imagen;

    @Column(length = 60)
    private String categoria;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "subtotal_linea", nullable = false)
    private Integer subtotalLinea;
}