package cl.grwu.usuarios.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;

/**
 * Formato único de error de toda la API (sección 8.2 del contexto):
 * { timestamp, status, error, message, path, errores }.
 * "errores" es opcional (solo para validación de campos), por eso se omite cuando es null.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorRespuesta(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> errores) {

    public static ErrorRespuesta de(HttpStatus estado, String mensaje, String ruta) {
        return new ErrorRespuesta(Instant.now(), estado.value(), estado.getReasonPhrase(), mensaje, ruta, null);
    }

    public static ErrorRespuesta de(HttpStatus estado, String mensaje, String ruta, Map<String, String> errores) {
        return new ErrorRespuesta(Instant.now(), estado.value(), estado.getReasonPhrase(), mensaje, ruta, errores);
    }
}
