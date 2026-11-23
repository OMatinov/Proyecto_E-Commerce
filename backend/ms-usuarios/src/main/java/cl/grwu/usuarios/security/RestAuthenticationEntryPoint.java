package cl.grwu.usuarios.security;

import cl.grwu.usuarios.dto.ErrorRespuesta;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/** 401 Unauthorized: no hay token, es inválido o expiró. Responde JSON, no una página HTML. */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    public RestAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e)
            throws IOException {
        RespuestaJson.escribir(response, mapper, ErrorRespuesta.de(
                HttpStatus.UNAUTHORIZED,
                "No autenticado: falta el token, es inválido o expiró.",
                request.getRequestURI()));
    }
}
