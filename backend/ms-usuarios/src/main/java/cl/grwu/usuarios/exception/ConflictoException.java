package cl.grwu.usuarios.exception;

import java.util.Map;

/** Conflicto con el estado actual (HTTP 409): RUN o correo repetidos, desactivarse a sí mismo, etc. */
public class ConflictoException extends RuntimeException {

    private final transient Map<String, String> errores;

    public ConflictoException(String mensaje) {
        this(mensaje, null);
    }

    public ConflictoException(String mensaje, Map<String, String> errores) {
        super(mensaje);
        this.errores = errores;
    }

    public Map<String, String> getErrores() {
        return errores;
    }
}
