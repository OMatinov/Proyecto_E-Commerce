package cl.grwu.catalogo.security;

import cl.grwu.catalogo.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Escribe los errores de seguridad (401 y 403) con el mismo JSON que usa el
 * resto de la API. Spring Security, por defecto, responde con una pagina HTML
 * o con el cuerpo vacio; el frontend necesita siempre el mismo formato.
 */
@Component
public class SecurityErrorWriter {

    private final ObjectMapper objectMapper;

    public SecurityErrorWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void escribir(HttpServletRequest request,
                         HttpServletResponse response,
                         HttpStatus estado,
                         String mensaje) throws IOException {
        if (response.isCommitted()) {
            return;
        }
        response.setStatus(estado.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        ErrorResponse cuerpo = new ErrorResponse(
                Instant.now(),
                estado.value(),
                estado.getReasonPhrase(),
                mensaje,
                request.getRequestURI()
        );
        objectMapper.writeValue(response.getOutputStream(), cuerpo);
    }
}
