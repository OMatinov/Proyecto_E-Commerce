package cl.grwu.usuarios.exception;

import cl.grwu.usuarios.dto.ErrorRespuesta;
import cl.grwu.usuarios.security.TokenInvalidoException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Convierte TODAS las excepciones en el JSON de error único de la sección 8.2:
 * { timestamp, status, error, message, path, errores }.
 * Extiende ResponseEntityExceptionHandler para que también los errores propios de Spring MVC
 * (ruta inexistente, método no permitido, JSON mal formado...) salgan con ese mismo formato.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ---------- Errores propios de la aplicación ----------

    @ExceptionHandler(ValidacionException.class)
    public ResponseEntity<ErrorRespuesta> validacion(ValidacionException ex, HttpServletRequest request) {
        return responder(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), ex.getErrores());
    }

    @ExceptionHandler(ConflictoException.class)
    public ResponseEntity<ErrorRespuesta> conflicto(ConflictoException ex, HttpServletRequest request) {
        return responder(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI(), ex.getErrores());
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorRespuesta> noEncontrado(RecursoNoEncontradoException ex, HttpServletRequest request) {
        return responder(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ErrorRespuesta> credenciales(CredencialesInvalidasException ex, HttpServletRequest request) {
        return responder(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(TokenInvalidoException.class)
    public ResponseEntity<ErrorRespuesta> tokenInvalido(TokenInvalidoException ex, HttpServletRequest request) {
        return responder(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI(), null);
    }

    /** @PreAuthorize lanza esta excepción dentro de Spring MVC: sin este método caería en el 500 genérico. */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorRespuesta> accesoDenegado(AccessDeniedException ex, HttpServletRequest request) {
        return responder(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción.",
                request.getRequestURI(), null);
    }

    /** Carrera entre dos registros simultáneos: la restricción UNIQUE de la base de datos es la última defensa. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorRespuesta> integridad(DataIntegrityViolationException ex, HttpServletRequest request) {
        LOG.warn("Violación de integridad en {}: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());
        return responder(HttpStatus.CONFLICT, "Ya existe un registro con esos datos.", request.getRequestURI(), null);
    }

    /** Cualquier error no previsto: se registra en el log, pero al cliente NO se le filtran detalles internos. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorRespuesta> inesperado(Exception ex, HttpServletRequest request) {
        LOG.error("Error inesperado en {}", request.getRequestURI(), ex);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor.", request.getRequestURI(), null);
    }

    // ---------- Errores estándar de Spring MVC con el mismo formato ----------

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ErrorRespuesta cuerpo = ErrorRespuesta.de(HttpStatus.BAD_REQUEST,
                "El cuerpo de la solicitud es inválido o está incompleto.", rutaDe(request));
        return ResponseEntity.badRequest().headers(headers).body(cuerpo);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
            HttpStatusCode statusCode, WebRequest request) {
        HttpStatus estado = HttpStatus.resolve(statusCode.value());
        if (estado == null) {
            estado = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        ErrorRespuesta cuerpo = ErrorRespuesta.de(estado, mensajeEstandar(estado), rutaDe(request));
        return ResponseEntity.status(statusCode).headers(headers).body(cuerpo);
    }

    // ---------- Auxiliares ----------

    private ResponseEntity<ErrorRespuesta> responder(HttpStatus estado, String mensaje, String ruta,
                                                     Map<String, String> errores) {
        return ResponseEntity.status(estado).body(ErrorRespuesta.de(estado, mensaje, ruta, errores));
    }

    private String rutaDe(WebRequest request) {
        return request.getDescription(false).replaceFirst("^uri=", "");
    }

    private String mensajeEstandar(HttpStatus estado) {
        return switch (estado) {
            case NOT_FOUND -> "Recurso no encontrado.";
            case METHOD_NOT_ALLOWED -> "Método no permitido para esta ruta.";
            case UNSUPPORTED_MEDIA_TYPE -> "Tipo de contenido no soportado.";
            case NOT_ACCEPTABLE -> "Formato de respuesta no disponible.";
            case INTERNAL_SERVER_ERROR -> "Error interno del servidor.";
            default -> "La solicitud no es válida.";
        };
    }
}
