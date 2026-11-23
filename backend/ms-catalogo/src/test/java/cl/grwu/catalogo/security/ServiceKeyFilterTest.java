package cl.grwu.catalogo.security;

import cl.grwu.catalogo.support.JsonTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ServiceKeyFilterTest {

    private static final String CLAVE = "clave-interna-de-prueba";

    private final ObjectMapper objectMapper = JsonTestSupport.objectMapper();
    private final ServiceKeyFilter filtro = new ServiceKeyFilter(CLAVE,
            new SecurityErrorWriter(objectMapper));

    @AfterEach
    void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void patchConClaveCorrectaAutenticaComoInterno() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("PATCH", "/api/v1/productos/p-001/stock");
        request.addHeader("X-Service-Key", CLAVE);
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, new MockHttpServletResponse(), chain);

        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(autenticacion);
        assertTrue(autenticacion.getAuthorities().stream()
                .anyMatch(a -> "ROLE_INTERNO".equals(a.getAuthority())));
        assertNotNull(chain.getRequest());
    }

    @Test
    void patchConClaveIncorrectaResponde401ConElJsonDeError() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("PATCH", "/api/v1/productos/p-001/stock");
        request.addHeader("X-Service-Key", "clave-equivocada");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, response, chain);

        assertEquals(401, response.getStatus());
        assertTrue(response.getContentType().startsWith("application/json"));

        JsonNode cuerpo = objectMapper.readTree(response.getContentAsString());
        assertEquals(401, cuerpo.get("status").asInt());
        assertEquals("Clave de servicio invalida", cuerpo.get("message").asText());
        assertEquals("/api/v1/productos/p-001/stock", cuerpo.get("path").asText());

        assertNull(chain.getRequest(), "no debe continuar la cadena");
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void patchSinCabeceraResponde401() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("PATCH", "/api/v1/productos/p-001/stock");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filtro.doFilter(request, response, new MockFilterChain());

        assertEquals(401, response.getStatus());
    }

    @Test
    void getDeProductosNoSeVeAfectadoPorElFiltro() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, response, chain);

        assertEquals(200, response.getStatus());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertNotNull(chain.getRequest());
    }
}
