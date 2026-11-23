package cl.grwu.catalogo.repository;

import cl.grwu.catalogo.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    Optional<Producto> findByIdAndActivoTrue(String id);

    /** Una categoria con productos no se puede eliminar (responde 409). */
    boolean existsByCategoriaId(String categoriaId);

    /**
     * Lista productos activos aplicando los filtros opcionales del contrato:
     * categoria (slug), genero, oferta, busqueda por nombre y stock critico.
     * Cada filtro se ignora cuando llega null.
     *
     * La oferta se recibe como rango ya resuelto por el servicio:
     * oferta=true  -> minimo 1, maximo null
     * oferta=false -> minimo 0, maximo 0
     */
    @Query("""
            SELECT p FROM Producto p
            WHERE p.activo = true
              AND (:categoriaSlug IS NULL OR p.categoria.slug = :categoriaSlug)
              AND (:genero IS NULL OR p.genero = :genero)
              AND (:ofertaMinima IS NULL OR p.oferta >= :ofertaMinima)
              AND (:ofertaMaxima IS NULL OR p.oferta <= :ofertaMaxima)
              AND (:texto IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :texto, '%')))
              AND (:umbral IS NULL OR p.stock <= :umbral)
            ORDER BY p.id
            """)
    List<Producto> buscar(@Param("categoriaSlug") String categoriaSlug,
                          @Param("genero") String genero,
                          @Param("ofertaMinima") Integer ofertaMinima,
                          @Param("ofertaMaxima") Integer ofertaMaxima,
                          @Param("texto") String texto,
                          @Param("umbral") Integer umbral);

    /**
     * Descuenta stock solo si alcanza (UPDATE condicional atomico).
     * Devuelve 0 filas si el producto no existe, esta inactivo o no hay stock.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE Producto p
               SET p.stock = p.stock - :cantidad
             WHERE p.id = :id
               AND p.activo = true
               AND p.stock >= :cantidad
            """)
    int descontarStock(@Param("id") String id, @Param("cantidad") Integer cantidad);

    /** Repone stock de un producto activo. Devuelve 0 filas si no existe o esta inactivo. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE Producto p
               SET p.stock = p.stock + :cantidad
             WHERE p.id = :id
               AND p.activo = true
            """)
    int reponerStock(@Param("id") String id, @Param("cantidad") Integer cantidad);

    /** Siguiente numero de la secuencia p-###. */
    @Query(value = "SELECT COALESCE(MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)), 0) FROM producto",
            nativeQuery = true)
    Long maxNumero();
}
