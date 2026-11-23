package cl.grwu.usuarios.dto;

import cl.grwu.usuarios.model.Usuario;
import java.time.LocalDate;

/**
 * Usuario tal como lo ve el cliente. NUNCA incluye clave, hash ni refresh_jti.
 * "activo" es un agregado al contrato (el listado de administración necesita saber quién está desactivado).
 */
public record UsuarioRespuesta(
        String run,
        String nombre,
        String apellidos,
        String correo,
        LocalDate fechaNacimiento,
        String tipoUsuario,
        String region,
        String comuna,
        String direccion,
        String telefono,
        boolean activo) {

    public static UsuarioRespuesta de(Usuario u) {
        return new UsuarioRespuesta(u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getFechaNacimiento(), u.getTipoUsuario().name(), u.getRegion(), u.getComuna(),
                u.getDireccion(), u.getTelefono(), u.isActivo());
    }
}
