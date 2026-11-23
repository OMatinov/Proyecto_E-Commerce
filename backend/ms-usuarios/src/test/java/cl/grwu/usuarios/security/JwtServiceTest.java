package cl.grwu.usuarios.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import io.jsonwebtoken.Claims;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** Pruebas unitarias de JwtService (sin Spring): creación, lectura y rechazo de tokens. */
class JwtServiceTest {

    private static final String SECRETO = "secreto-de-pruebas-0123456789-abcdef";
    private static final String OTRO_SECRETO = "otro-secreto-distinto-0123456789-xyz";

    private JwtService servicio;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        servicio = new JwtService(SECRETO, "grwu-auth", 15, 7);
        usuario = new Usuario();
        usuario.setRun("205558993");
        usuario.setNombre("Javiera");
        usuario.setTipoUsuario(TipoUsuario.Cliente);
    }

    @Test
    @DisplayName("el access token lleva sub (RUN), rol, nombre y tipo access")
    void accessTokenLlevaLosClaims() {
        Claims claims = servicio.leerClaims(servicio.generarAccessToken(usuario));

        assertEquals("205558993", claims.getSubject());
        assertEquals("Cliente", claims.get("rol", String.class));
        assertEquals("Javiera", claims.get("nombre", String.class));
        assertEquals(JwtService.TIPO_ACCESS, claims.get("tipo", String.class));
        assertEquals("grwu-auth", claims.getIssuer());
        assertNotNull(claims.getExpiration());
    }

    @Test
    @DisplayName("el refresh token lleva su jti y tipo refresh, y dura más que el access")
    void refreshTokenLlevaJti() {
        Claims refresh = servicio.leerClaims(servicio.generarRefreshToken(usuario, "jti-123"));
        Claims access = servicio.leerClaims(servicio.generarAccessToken(usuario));

        assertEquals("jti-123", refresh.getId());
        assertEquals(JwtService.TIPO_REFRESH, refresh.get("tipo", String.class));
        assertTrue(refresh.getExpiration().after(access.getExpiration()));
    }

    @Test
    @DisplayName("expiraEn se informa en segundos (15 minutos = 900)")
    void expiraEnSegundos() {
        assertEquals(900, servicio.getAccessSegundos());
    }

    @Test
    @DisplayName("rechaza un token expirado")
    void rechazaTokenExpirado() {
        JwtService conExpiracionPasada = new JwtService(SECRETO, "grwu-auth", -1, 7);
        String vencido = conExpiracionPasada.generarAccessToken(usuario);

        assertThrows(TokenInvalidoException.class, () -> servicio.leerClaims(vencido));
    }

    @Test
    @DisplayName("rechaza un token firmado con otra clave")
    void rechazaFirmaDeOtraClave() {
        String ajeno = new JwtService(OTRO_SECRETO, "grwu-auth", 15, 7).generarAccessToken(usuario);

        assertThrows(TokenInvalidoException.class, () -> servicio.leerClaims(ajeno));
    }

    @Test
    @DisplayName("rechaza un token alterado (por ejemplo, cambiar el rol dentro del payload)")
    void rechazaTokenAlterado() {
        String[] partes = servicio.generarAccessToken(usuario).split("\\.");
        String payloadFalso = Base64.getUrlEncoder().withoutPadding().encodeToString(
                "{\"sub\":\"205558993\",\"rol\":\"Administrador\",\"tipo\":\"access\",\"iss\":\"grwu-auth\"}"
                        .getBytes(StandardCharsets.UTF_8));
        String alterado = partes[0] + "." + payloadFalso + "." + partes[2];

        assertThrows(TokenInvalidoException.class, () -> servicio.leerClaims(alterado));
    }

    @Test
    @DisplayName("rechaza un token de otro emisor")
    void rechazaOtroEmisor() {
        String deOtroEmisor = new JwtService(SECRETO, "otro-emisor", 15, 7).generarAccessToken(usuario);

        assertThrows(TokenInvalidoException.class, () -> servicio.leerClaims(deOtroEmisor));
    }

    @ParameterizedTest(name = "rechaza \"{0}\"")
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "abc", "a.b.c", "no-es-un-jwt"})
    @DisplayName("rechaza textos que no son un JWT")
    void rechazaBasura(String texto) {
        assertThrows(TokenInvalidoException.class, () -> servicio.leerClaims(texto));
    }

    @Test
    @DisplayName("exige un secreto de al menos 32 caracteres")
    void exigeSecretoLargo() {
        assertThrows(IllegalStateException.class, () -> new JwtService("corto", "grwu-auth", 15, 7));
        assertThrows(IllegalStateException.class, () -> new JwtService(null, "grwu-auth", 15, 7));
    }
}
