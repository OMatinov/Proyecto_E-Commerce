package cl.grwu.catalogo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    private static final String SECRETO = "secreto-de-prueba-con-mas-de-32-caracteres-para-hs256";
    private static final String OTRO_SECRETO = "otro-secreto-de-prueba-con-mas-de-32-caracteres";
    private static final String ISSUER = "grwu-auth";

    private final JwtService jwtService = new JwtService(SECRETO, ISSUER);

    @Test
    void tokenValidoDevuelveRunRolYNombre() {
        String token = token("205558993", "Vendedor", ISSUER, SECRETO,
                Instant.now().plus(15, ChronoUnit.MINUTES));

        Claims claims = jwtService.validarYExtraerClaims(token);

        assertEquals("205558993", claims.getSubject());
        assertEquals("Vendedor", claims.get("rol", String.class));
        assertEquals("Javiera", claims.get("nombre", String.class));
    }

    @Test
    void tokenExpiradoSeRechaza() {
        String token = token("205558993", "Cliente", ISSUER, SECRETO,
                Instant.now().minus(1, ChronoUnit.MINUTES));

        assertThrows(ExpiredJwtException.class, () -> jwtService.validarYExtraerClaims(token));
    }

    @Test
    void tokenFirmadoConOtroSecretoSeRechaza() {
        String token = token("205558993", "Administrador", ISSUER, OTRO_SECRETO,
                Instant.now().plus(15, ChronoUnit.MINUTES));

        assertThrows(JwtException.class, () -> jwtService.validarYExtraerClaims(token));
    }

    @Test
    void tokenDeOtroEmisorSeRechaza() {
        String token = token("205558993", "Administrador", "otro-emisor", SECRETO,
                Instant.now().plus(15, ChronoUnit.MINUTES));

        assertThrows(JwtException.class, () -> jwtService.validarYExtraerClaims(token));
    }

    @Test
    void secretoCortoNoPermiteConstruirElServicio() {
        assertThrows(IllegalStateException.class, () -> new JwtService("corto", ISSUER));
    }

    private String token(String run, String rol, String issuer, String secreto, Instant expiracion) {
        return Jwts.builder()
                .subject(run)
                .issuer(issuer)
                .claim("rol", rol)
                .claim("nombre", "Javiera")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expiracion))
                .signWith(Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
