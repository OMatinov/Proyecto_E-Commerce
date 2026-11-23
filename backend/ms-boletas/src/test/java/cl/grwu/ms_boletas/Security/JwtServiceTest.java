package cl.grwu.ms_boletas.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Los tokens los emite ms-usuarios; aquí se arman iguales para probar qué acepta ms-boletas. */
class JwtServiceTest {

    private static final String SECRETO = "secreto-de-prueba-con-mas-de-32-caracteres-ok";

    private JwtService jwtService;
    private SecretKey clave;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRETO);
        ReflectionTestUtils.setField(jwtService, "issuer", "grwu-auth");
        clave = Keys.hmacShaKeyFor(SECRETO.getBytes(StandardCharsets.UTF_8));
    }

    private String token(String tipo, String emisor, Duration vigencia, SecretKey firma) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .issuer(emisor)
                .subject("190110222")
                .claim("rol", "Cliente")
                .claim("tipo", tipo)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(vigencia)))
                .signWith(firma, Jwts.SIG.HS256)
                .compact();
    }

    @Test
    void aceptaUnAccessTokenVigente() {
        String jwt = token("access", "grwu-auth", Duration.ofMinutes(15), clave);

        assertTrue(jwtService.isTokenValid(jwt));
        assertEquals("190110222", jwtService.extractUsername(jwt));
        assertEquals("Cliente", jwtService.extractRole(jwt));
    }

    @Test
    void rechazaUnRefreshTokenComoAccess() {
        String jwt = token("refresh", "grwu-auth", Duration.ofDays(7), clave);

        assertFalse(jwtService.isTokenValid(jwt));
    }

    @Test
    void rechazaUnTokenExpirado() {
        String jwt = token("access", "grwu-auth", Duration.ofMinutes(-5), clave);

        assertFalse(jwtService.isTokenValid(jwt));
    }

    @Test
    void rechazaUnTokenDeOtroEmisor() {
        String jwt = token("access", "otro-emisor", Duration.ofMinutes(15), clave);

        assertFalse(jwtService.isTokenValid(jwt));
    }

    @Test
    void rechazaUnTokenFirmadoConOtraClave() {
        SecretKey otra = Keys.hmacShaKeyFor("otra-clave-distinta-de-mas-de-32-caracteres!!".getBytes(StandardCharsets.UTF_8));
        String jwt = token("access", "grwu-auth", Duration.ofMinutes(15), otra);

        assertFalse(jwtService.isTokenValid(jwt));
    }

    @Test
    void rechazaBasura() {
        assertFalse(jwtService.isTokenValid("esto-no-es-un-jwt"));
    }
}
