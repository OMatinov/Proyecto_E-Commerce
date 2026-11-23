package cl.grwu.usuarios.security;

import cl.grwu.usuarios.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Crea y valida los JWT (sección 9.1 del contexto).
 *
 * - Algoritmo HS256: la misma clave secreta firma y verifica. Por eso la JWT_SECRET debe ser idéntica en los 3 servicios.
 * - Claims: sub = RUN, rol, nombre, tipo ("access" o "refresh"), iss = grwu-auth, iat, exp.
 *   El refresh además lleva "jti" (su identificador único), que se guarda en USUARIO.refresh_jti (opción B).
 * - El claim "tipo" evita que un refresh token se use como access token (y al revés).
 */
@Service
public class JwtService {

    public static final String TIPO_ACCESS = "access";
    public static final String TIPO_REFRESH = "refresh";
    private static final String ALGORITMO = "HS256";

    private final SecretKey clave;
    private final String emisor;
    private final long accessMinutos;
    private final long refreshDias;

    public JwtService(@Value("${jwt.secret}") String secreto,
                      @Value("${jwt.issuer:grwu-auth}") String emisor,
                      @Value("${jwt.access-minutes:15}") long accessMinutos,
                      @Value("${jwt.refresh-days:7}") long refreshDias) {
        if (secreto == null || secreto.getBytes(StandardCharsets.UTF_8).length < 32) {
            // HS256 exige una clave de al menos 256 bits (32 bytes). Mejor fallar al arrancar que firmar con una clave débil.
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 caracteres.");
        }
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.emisor = emisor;
        this.accessMinutos = accessMinutos;
        this.refreshDias = refreshDias;
    }

    /** Token de acceso (15 minutos por defecto): es el que viaja en Authorization: Bearer. */
    public String generarAccessToken(Usuario usuario) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .issuer(emisor)
                .subject(usuario.getRun())
                .claim("rol", usuario.getTipoUsuario().name())
                .claim("nombre", usuario.getNombre())
                .claim("tipo", TIPO_ACCESS)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(Duration.ofMinutes(accessMinutos))))
                .signWith(clave, Jwts.SIG.HS256)
                .compact();
    }

    /** Token de refresco (7 días por defecto). {@code jti} es su identificador único: se guarda en el usuario. */
    public String generarRefreshToken(Usuario usuario, String jti) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .issuer(emisor)
                .subject(usuario.getRun())
                .id(jti)
                .claim("rol", usuario.getTipoUsuario().name())
                .claim("nombre", usuario.getNombre())
                .claim("tipo", TIPO_REFRESH)
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(Duration.ofDays(refreshDias))))
                .signWith(clave, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Valida firma, emisor y expiración, y devuelve los claims.
     * Lanza {@link TokenInvalidoException} si el token no sirve por cualquier motivo.
     */
    public Claims leerClaims(String token) {
        if (token == null || token.isBlank()) {
            throw new TokenInvalidoException("El token está vacío.");
        }
        try {
            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(clave)
                    .requireIssuer(emisor)
                    .build()
                    .parseSignedClaims(token);
            // Defensa extra: aceptar únicamente HS256 (evita ataques de cambio de algoritmo).
            if (!ALGORITMO.equals(jws.getHeader().getAlgorithm())) {
                throw new TokenInvalidoException("Algoritmo de firma no permitido.");
            }
            return jws.getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            throw new TokenInvalidoException("Token inválido o expirado.", e);
        }
    }

    /** Duración del access token en segundos (el login la devuelve como "expiraEn": 900). */
    public long getAccessSegundos() {
        return accessMinutos * 60;
    }
}
