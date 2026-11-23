package cl.grwu.usuarios.dto;

import java.time.LocalDate;

/**
 * Datos de un usuario enviados por el cliente. Se usa en registro, creación y edición (admin) y edición de perfil.
 * Cada operación usa solo los campos que le corresponden e IGNORA el resto (decisión D9: el backend es la autoridad):
 * el registro fuerza el rol Cliente aunque llegue "tipoUsuario", y el perfil propio nunca cambia rol, RUN ni estado.
 * "tipoUsuario" va como texto para poder responder un 400 claro si no es un rol válido.
 */
public record UsuarioSolicitud(
        String run,
        String nombre,
        String apellidos,
        String correo,
        String clave,
        LocalDate fechaNacimiento,
        String tipoUsuario,
        String region,
        String comuna,
        String direccion,
        String telefono,
        Boolean activo) {
}
