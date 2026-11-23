package cl.grwu.catalogo.exception;

import cl.grwu.catalogo.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Traduce las excepciones a un unico formato de error (AGENTS.md, seccion 4.5).
 * "errores" solo se llena cuando el problema es de validacion de campos.
 */
@RestControllerAdvice
public class ManejadorGlobalErrores {

    private static final Logger log = LoggerFactory.getLogger(ManejadorGlobalErrores.class);

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> noEncontrado(RecursoNoEncontradoException ex,
                                                      HttpServletRequest request) {
        return construir(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(ConflictoException.class)
    public ResponseEntity<ErrorResponse> conflicto(ConflictoException ex,
                                                   HttpServletRequest request) {
        return construir(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(SolicitudInvalidaException.class)
    public ResponseEntity<ErrorResponse> solicitudInvalida(SolicitudInvalidaException ex,
                                                           HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validacionCampos(MethodArgumentNotValidException ex,
                                                          HttpServletRequest request) {
        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return construir(HttpStatus.BAD_REQUEST,
                "La solicitud tiene campos invalidos", request, errores);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> validacionParametros(ConstraintViolationException ex,
                                                              HttpServletRequest request) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violacion ->
                errores.putIfAbsent(violacion.getPropertyPath().toString(), violacion.getMessage()));
        return construir(HttpStatus.BAD_REQUEST,
                "La solicitud tiene parametros invalidos", request, errores);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> cuerpoIlegible(HttpMessageNotReadableException ex,
                                                        HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST,
                "El cuerpo de la solicitud no es JSON valido o tiene un tipo incorrecto",
                request, null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> parametroInvalido(MethodArgumentTypeMismatchException ex,
                                                           HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST,
                "El parametro '" + ex.getName() + "' tiene un valor invalido", request, null);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> parametroFaltante(MissingServletRequestParameterException ex,
                                                           HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST,
                "Falta el parametro obligatorio '" + ex.getParameterName() + "'", request, null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> metodoNoSoportado(HttpRequestMethodNotSupportedException ex,
                                                           HttpServletRequest request) {
        return construir(HttpStatus.METHOD_NOT_ALLOWED,
                "El metodo HTTP " + ex.getMethod() + " no esta permitido en esta ruta", request, null);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> rutaInexistente(NoResourceFoundException ex,
                                                         HttpServletRequest request) {
        return construir(HttpStatus.NOT_FOUND, "La ruta solicitada no existe", request, null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> integridad(DataIntegrityViolationException ex,
                                                    HttpServletRequest request) {
        log.warn("Violacion de integridad en {}: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());
        return construir(HttpStatus.CONFLICT,
                "La operacion viola una restriccion de la base de datos", request, null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> accesoDenegado(AccessDeniedException ex,
                                                        HttpServletRequest request) {
        return construir(HttpStatus.FORBIDDEN,
                "No tienes permisos para acceder a este recurso", request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> inesperado(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {}", request.getRequestURI(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno del servidor", request, null);
    }

    private ResponseEntity<ErrorResponse> construir(HttpStatus estado,
                                                    String mensaje,
                                                    HttpServletRequest request,
                                                    Map<String, String> errores) {
        ErrorResponse cuerpo = new ErrorResponse(
                Instant.now(),
                estado.value(),
                estado.getReasonPhrase(),
                mensaje,
                request.getRequestURI(),
                errores
        );
        return ResponseEntity.status(estado).body(cuerpo);
    }
}
