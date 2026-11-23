package cl.grwu.catalogo.repository;

import cl.grwu.catalogo.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, String> {

    Optional<Categoria> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /** Para validar el slug unico al editar, ignorando la propia categoria. */
    boolean existsBySlugAndIdNot(String slug, String id);

    /**
     * Numero mas alto de los IDs c-### (c-001 ... c-011).
     * Los IDs c-g-hombre / c-g-mujer no son numericos y CAST los deja en 0,
     * por eso no interfieren con la secuencia.
     */
    @Query(value = "SELECT COALESCE(MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)), 0) FROM categoria",
            nativeQuery = true)
    Long maxNumero();
}
