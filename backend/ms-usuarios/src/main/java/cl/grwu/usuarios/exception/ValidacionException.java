package cl.grwu.usuarios.exception;

import java.util.Map;

/** Datos inválidos (HTTP 400). Lleva el detalle por campo para el JSON de error ("errores"). */
public class ValidacionException extends RuntimeException {

    private final transient Map<String, String> errores;

    public ValidacionException(Map<String, String> errores) {
        super("Hay datos inválidos en la solicitud.");
        this.errores = errores;
    }

    public Map<String, String> getErrores() {
        return errores;
    }
}
