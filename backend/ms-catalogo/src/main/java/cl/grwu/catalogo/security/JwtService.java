package cl.grwu.catalogo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Verifica los JWT que emite ms-usuarios.
 * ms-catalogo NO emite tokens: solo valida firma, expiracion e issuer con el
 * mismo JWT_SECRET que comparten los tres servicios (AGENTS.md, seccion 4.8).
 */
@Service
public class JwtService {

    private static final int LARGO_MINIMO_SECRETO = 32;

    private final SecretKey clave;
    private final String issuer;

    public JwtService(@Value("${jwt.secret}") String secreto,
                      @Value("${jwt.issuer:grwu-auth}") String issuer) {
        byte[] bytes = secreto == null ? new byte[0] : secreto.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < LARGO_MINIMO_SECRETO) {
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 caracteres para HS256");
        }
        this.clave = Keys.hmacShaKeyFor(bytes);
        this.issuer = issuer;
    }

    /**
     * Valida firma, expiracion y emisor, y devuelve los claims.
     *
     * @throws io.jsonwebtoken.JwtException si el token es invalido, expiro o no lo emitio grwu-auth
     */
    public Claims validarYExtraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
