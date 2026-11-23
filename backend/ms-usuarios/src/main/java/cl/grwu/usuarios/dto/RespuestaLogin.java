package cl.grwu.usuarios.dto;

/** Respuesta de login y de refresh (sección 8.3): tokens, tipo, duración del access en segundos y el usuario. */
public record RespuestaLogin(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiraEn,
        UsuarioRespuesta usuario) {
}
