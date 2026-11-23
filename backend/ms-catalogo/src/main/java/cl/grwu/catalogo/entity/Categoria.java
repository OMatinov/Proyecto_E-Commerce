package cl.grwu.catalogo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Categoria de producto (tabla CATEGORIA del modelo del docente).
 * Hay dos tipos: categorias de genero (c-g-hombre, c-g-mujer) y categorias
 * de prenda (c-001 ... c-011).
 */
@Entity
@Table(name = "categoria")
@Data
@NoArgsConstructor
public class Categoria {

    @Id
    @Column(length = 12)
    private String id; // c-001, c-g-hombre, c-g-mujer

    @Column(nullable = false, unique = true, length = 40)
    private String slug; // polerones, hombre, ...

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(length = 255)
    private String imagen; // ruta relativa a public/, ej. img/mujer/abrigo1.png

    @Column(length = 20)
    private String genero; // hombre, mujer, todos o null
}
