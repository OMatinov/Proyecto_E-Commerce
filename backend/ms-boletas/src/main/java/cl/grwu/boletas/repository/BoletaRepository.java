package cl.grwu.boletas.repository;

import cl.grwu.boletas.entity.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BoletaRepository extends JpaRepository<Boleta, String> {
    
    // Buscar boletas de un usuario especÃ­fico (Historial de compras)
    List<Boleta> findByUsuarioRunOrderByFechaDesc(String usuarioRun);
    
    // Obtener el Ãºltimo nÃºmero de boleta para generar el siguiente
    Optional<Boleta> findTopByOrderByNumeroDesc();
}