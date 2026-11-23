package cl.grwu.catalogo.security;

import cl.grwu.catalogo.support.JsonTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.InsufficientAuthenticationException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RestAuthenticationEntryPointTest {

    private final ObjectMapper objectMapper = JsonTestSupport.objectMapper();
    private final RestAuthenticationEntryPoint entryPoint =
            new RestAuthenticationEntryPoint(new SecurityErrorWriter(objectMapper));

    @Test
    void responde401ConElFormatoDeErrorDeLaApi() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(request, response, new InsufficientAuthenticationException("sin token"));

        assertEquals(401, response.getStatus());
        assertTrue(response.getContentType().startsWith("application/json"));

        JsonNode cuerpo = objectMapper.readTree(response.getContentAsString());
        assertEquals(401, cuerpo.get("status").asInt());
        assertEquals("Unauthorized", cuerpo.get("error").asText());
        assertEquals("/api/v1/productos", cuerpo.get("path").asText());
        assertTrue(cuerpo.get("message").asText().contains("No autenticado"));
        assertTrue(cuerpo.hasNonNull("timestamp"));
        assertFalse(cuerpo.has("errores"), "los errores de seguridad no llevan el detalle por campo");
    }
}
