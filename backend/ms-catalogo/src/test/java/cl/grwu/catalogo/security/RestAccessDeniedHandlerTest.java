package cl.grwu.catalogo.security;

import cl.grwu.catalogo.support.JsonTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RestAccessDeniedHandlerTest {

    private final ObjectMapper objectMapper = JsonTestSupport.objectMapper();
    private final RestAccessDeniedHandler accessDeniedHandler =
            new RestAccessDeniedHandler(new SecurityErrorWriter(objectMapper));

    @Test
    void responde403ConElFormatoDeErrorDeLaApi() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/productos");
        MockHttpServletResponse response = new MockHttpServletResponse();

        accessDeniedHandler.handle(request, response, new AccessDeniedException("rol insuficiente"));

        assertEquals(403, response.getStatus());
        assertTrue(response.getContentType().startsWith("application/json"));

        JsonNode cuerpo = objectMapper.readTree(response.getContentAsString());
        assertEquals(403, cuerpo.get("status").asInt());
        assertEquals("Forbidden", cuerpo.get("error").asText());
        assertEquals("/api/v1/productos", cuerpo.get("path").asText());
        assertEquals("No tienes permisos para acceder a este recurso", cuerpo.get("message").asText());
    }
}
