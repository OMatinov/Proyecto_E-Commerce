package cl.grwu.ms_boletas.Security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

/** 403 Forbidden en JSON: hay sesión válida pero el rol no alcanza (misma forma de error que el entry point 401). */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        String ruta = request.getServletPath() == null ? "" : request.getServletPath().replace("\\", "\\\\").replace("\"", "\\\"");
        response.getWriter().write("{\"timestamp\":\"" + Instant.now() + "\",\"status\":403,\"error\":\"Forbidden\","
                + "\"message\":\"No tienes permisos para realizar esta acción.\",\"path\":\"" + ruta + "\"}");
    }
}
