package cl.grwu.usuarios.security;

import cl.grwu.usuarios.dto.ErrorRespuesta;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/** 403 Forbidden: el token es válido (sabemos quién es) pero su rol no alcanza para esta acción. */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper mapper;

    public RestAccessDeniedHandler(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException e)
            throws IOException {
        RespuestaJson.escribir(response, mapper, ErrorRespuesta.de(
                HttpStatus.FORBIDDEN,
                "No tienes permisos para realizar esta acción.",
                request.getRequestURI()));
    }
}
