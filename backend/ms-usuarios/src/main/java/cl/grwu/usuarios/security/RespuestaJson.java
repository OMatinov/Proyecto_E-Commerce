package cl.grwu.usuarios.security;

import cl.grwu.usuarios.dto.ErrorRespuesta;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;

/** Escribe un {@link ErrorRespuesta} como JSON en la respuesta (los filtros de seguridad no pasan por los controladores). */
final class RespuestaJson {

    private RespuestaJson() {
    }

    static void escribir(HttpServletResponse respuesta, ObjectMapper mapper, ErrorRespuesta cuerpo) throws IOException {
        respuesta.setStatus(cuerpo.status());
        respuesta.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(respuesta.getOutputStream(), cuerpo);
    }
}
