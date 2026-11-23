package cl.grwu.usuarios.dto;

/** Cuerpo de POST /auth/refresh y POST /auth/logout. */
public record RefreshSolicitud(String refreshToken) {
}
