package cl.grwu.usuarios.model;

import java.util.Locale;

/**
 * Rol del usuario. Los nombres de las constantes son EXACTAMENTE los valores del contrato
 * ("Administrador", "Vendedor", "Cliente"): así el JSON y la columna tipo_usuario coinciden
 * sin conversiones y el frontend no cambia.
 */
public enum TipoUsuario {
    Administrador,
    Vendedor,
    Cliente;

    /** Nombre que usa Spring Security: ROLE_ADMINISTRADOR, ROLE_VENDEDOR o ROLE_CLIENTE. */
    public String rolSpring() {
        return "ROLE_" + name().toUpperCase(Locale.ROOT);
    }
}
