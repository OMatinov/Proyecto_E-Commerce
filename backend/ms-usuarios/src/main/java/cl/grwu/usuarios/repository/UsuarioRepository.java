package cl.grwu.usuarios.repository;

import cl.grwu.usuarios.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a la tabla USUARIO. Spring Data genera las consultas a partir del nombre de cada método
 * (por ejemplo findByCorreoIgnoreCase -> SELECT ... WHERE LOWER(correo) = LOWER(?)).
 * La clave primaria es el RUN (String).
 */
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    /** Login y búsqueda por correo, sin distinguir mayúsculas. */
    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    /** ¿Ya existe ese correo? (registro y creación). */
    boolean existsByCorreoIgnoreCase(String correo);

    /** ¿Ese correo lo usa OTRO usuario? (edición: el propio usuario puede conservar su correo). */
    boolean existsByCorreoIgnoreCaseAndRunNot(String correo, String run);
}
