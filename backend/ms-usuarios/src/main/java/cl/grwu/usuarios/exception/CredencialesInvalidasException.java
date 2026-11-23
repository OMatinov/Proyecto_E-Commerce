package cl.grwu.usuarios.exception;

/**
 * Login fallido (HTTP 401). El mensaje es SIEMPRE el mismo, sin importar si falló el correo, la clave o el usuario
 * está desactivado: así no se revela qué correos están registrados (sección 8.3 del contrato).
 */
public class CredencialesInvalidasException extends RuntimeException {

    public static final String MENSAJE = "Correo o contraseña incorrectos";

    public CredencialesInvalidasException() {
        super(MENSAJE);
    }
}
