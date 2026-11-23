package cl.grwu.usuarios.dto;

/** Cuerpo de PUT /usuarios/me/clave. */
public record CambioClaveSolicitud(String claveActual, String claveNueva) {
}
