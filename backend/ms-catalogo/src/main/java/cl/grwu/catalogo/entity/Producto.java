package cl.grwu.catalogo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Producto del catalogo (tabla PRODUCTO del modelo del docente).
 * La categoria es una relacion real dentro del esquema grwu_catalogo.
 * El borrado es logico: activo = false.
 */
@Entity
@Table(name = "producto")
@Data
@NoArgsConstructor
public class Producto {

    @Id
    @Column(length = 10)
    private String id; // p-001 ...

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Integer precio; // precio final en CLP

    @Column(name = "precio_original", nullable = false)
    private Integer precioOriginal = 0; // 0 si no hay oferta

    @Column(nullable = false)
    private Integer oferta = 0; // porcentaje 0-100

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, length = 20)
    private String genero; // hombre, mujer, unisex

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 255)
    private String imagen;

    @Convert(converter = ListaImagenesConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> imagenes = new ArrayList<>();

    @Column(nullable = false)
    private Boolean activo = true;
}
