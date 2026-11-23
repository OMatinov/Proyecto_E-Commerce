package cl.grwu.ms_boletas.Repository;

import cl.grwu.ms_boletas.Entity.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BoletaRepository extends JpaRepository<Boleta, String> {
    
    // Buscar boletas de un usuario específico (Historial de compras)
    List<Boleta> findByUsuarioRunOrderByFechaDesc(String usuarioRun);
    
    // Obtener el último número de boleta para generar el siguiente
    Optional<Boleta> findTopByOrderByNumeroDesc();
}