package cl.grwu.catalogo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * Formato unico de error de la API (AGENTS.md, seccion 4.5).
 * "errores" es opcional: solo se llena en errores de validacion de campos.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> errores
) {

    public ErrorResponse(Instant timestamp, int status, String error, String message, String path) {
        this(timestamp, status, error, message, path, null);
    }
}
