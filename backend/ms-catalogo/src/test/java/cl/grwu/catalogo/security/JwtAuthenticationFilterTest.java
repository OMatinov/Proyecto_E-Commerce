package cl.grwu.catalogo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtAuthenticationFilterTest {

    private static final String SECRETO = "secreto-de-prueba-con-mas-de-32-caracteres-para-hs256";
    private static final String ISSUER = "grwu-auth";

    private final JwtAuthenticationFilter filtro =
            new JwtAuthenticationFilter(new JwtService(SECRETO, ISSUER));

    @AfterEach
    void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void tokenValidoAutenticaConRolEnMayusculas() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        request.addHeader("Authorization", "Bearer " + token("Vendedor"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, response, chain);

        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(autenticacion);
        assertEquals("205558993", autenticacion.getName());
        assertTrue(autenticacion.getAuthorities().stream()
                .anyMatch(a -> "ROLE_VENDEDOR".equals(a.getAuthority())));
        assertNotNull(chain.getRequest(), "la cadena de filtros debe continuar");
    }

    @Test
    void sinHeaderNoAutenticaYDejaPasar() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, new MockHttpServletResponse(), chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertNotNull(chain.getRequest());
    }

    @Test
    void tokenInvalidoNoAutenticaYDejaPasar() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        request.addHeader("Authorization", "Bearer esto-no-es-un-jwt");
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, new MockHttpServletResponse(), chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertNotNull(chain.getRequest());
    }

    @Test
    void tokenSinClaimRolNoAutentica() throws Exception {
        String tokenSinRol = Jwts.builder()
                .subject("205558993")
                .issuer(ISSUER)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
                .signWith(Keys.hmacShaKeyFor(SECRETO.getBytes(StandardCharsets.UTF_8)))
                .compact();

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/productos");
        request.addHeader("Authorization", "Bearer " + tokenSinRol);
        MockFilterChain chain = new MockFilterChain();

        filtro.doFilter(request, new MockHttpServletResponse(), chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertNotNull(chain.getRequest());
    }

    private String token(String rol) {
        return Jwts.builder()
                .subject("205558993")
                .issuer(ISSUER)
                .claim("rol", rol)
                .claim("nombre", "Javiera")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
                .signWith(Keys.hmacShaKeyFor(SECRETO.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
