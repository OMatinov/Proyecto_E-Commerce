package cl.grwu.catalogo.support;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Genera JWT de prueba con el mismo formato que emitira ms-usuarios:
 * sub = RUN, claim rol, claim nombre, issuer grwu-auth.
 */
public final class TokensDePrueba {

    public static final String SECRETO = "secreto-de-prueba-con-mas-de-32-caracteres-para-hs256";
    public static final String ISSUER = "grwu-auth";

    private TokensDePrueba() {
    }

    public static String conRol(String rol) {
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
