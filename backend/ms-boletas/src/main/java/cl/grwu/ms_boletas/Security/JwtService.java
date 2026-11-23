package cl.grwu.ms_boletas.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

/**
 * Valida los JWT emitidos por ms-usuarios (HS256, misma JWT_SECRET en los tres servicios).
 * Un token solo sirve si: la firma es válida, el emisor es "grwu-auth", no expiró y su claim
 * "tipo" es "access". Así un refresh token (7 días) no puede usarse para llamar a esta API.
 */
@Service
public class JwtService {

    public static final String TIPO_ACCESS = "access";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.issuer:grwu-auth}")
    private String issuer;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("rol", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /** true solo si el token es un access token vigente y bien firmado. */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            boolean esAccess = TIPO_ACCESS.equals(claims.get("tipo", String.class));
            boolean vigente = claims.getExpiration() != null && claims.getExpiration().after(new Date());
            return esAccess && vigente;
        } catch (Exception e) {
            return false;
        }
    }
}
