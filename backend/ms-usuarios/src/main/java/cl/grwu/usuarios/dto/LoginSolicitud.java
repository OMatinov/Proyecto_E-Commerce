package cl.grwu.usuarios.dto;

/** Cuerpo de POST /auth/login. */
public record LoginSolicitud(String correo, String clave) {
}
