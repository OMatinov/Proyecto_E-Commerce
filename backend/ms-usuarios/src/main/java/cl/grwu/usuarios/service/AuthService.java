package cl.grwu.usuarios.service;

import cl.grwu.usuarios.dto.LoginSolicitud;
import cl.grwu.usuarios.dto.RefreshSolicitud;
import cl.grwu.usuarios.dto.RespuestaLogin;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.exception.CredencialesInvalidasException;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.repository.UsuarioRepository;
import cl.grwu.usuarios.security.JwtService;
import cl.grwu.usuarios.security.TokenInvalidoException;
import io.jsonwebtoken.Claims;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Autenticación: login, registro, refresh con rotación y logout (sección 8.3 y 9.1 del contexto).
 *
 * Refresh token (opción B): el "jti" del ÚLTIMO refresh emitido se guarda en USUARIO.refresh_jti.
 *  - login y refresh generan un jti nuevo (rotación): el refresh anterior deja de servir.
 *  - logout borra el jti: ningún refresh sirve hasta volver a iniciar sesión.
 */
@Service
public class AuthService {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder codificador;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;
    /** Hash de una clave cualquiera: se usa cuando el correo no existe para que el login tarde parecido. */
    private final String hashFalso;

    public AuthService(UsuarioRepository repositorio, PasswordEncoder codificador, JwtService jwtService,
                       UsuarioService usuarioService) {
        this.repositorio = repositorio;
        this.codificador = codificador;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
        this.hashFalso = codificador.encode("clave-que-no-existe");
    }

    @Transactional
    public RespuestaLogin login(LoginSolicitud solicitud) {
        String correo = (solicitud == null || solicitud.correo() == null) ? "" : solicitud.correo().trim();
        String clave = (solicitud == null || solicitud.clave() == null) ? "" : solicitud.clave();

        Optional<Usuario> encontrado = correo.isEmpty() ? Optional.empty() : repositorio.findByCorreoIgnoreCase(correo);
        // Se compara SIEMPRE con un hash (aunque el correo no exista): así no se puede adivinar qué correos están registrados.
        String hash = encontrado.map(Usuario::getClaveHash).orElse(hashFalso);
        boolean claveCorrecta = codificador.matches(clave, hash);

        if (encontrado.isEmpty() || !claveCorrecta || !encontrado.get().isActivo()) {
            throw new CredencialesInvalidasException();
        }
        return emitirTokens(encontrado.get());
    }

    /** El registro es público y siempre crea un Cliente (lo resuelve UsuarioService). */
    @Transactional
    public UsuarioRespuesta registrar(UsuarioSolicitud solicitud) {
        return usuarioService.registrar(solicitud);
    }

    @Transactional
    public RespuestaLogin refrescar(RefreshSolicitud solicitud) {
        if (solicitud == null) {
            throw new TokenInvalidoException("Falta el refresh token.");
        }
        Claims claims = jwtService.leerClaims(solicitud.refreshToken());
        if (!JwtService.TIPO_REFRESH.equals(claims.get("tipo", String.class))) {
            throw new TokenInvalidoException("El token recibido no es un refresh token.");
        }
        Usuario usuario = repositorio.findById(claims.getSubject())
                .filter(Usuario::isActivo)
                .orElseThrow(() -> new TokenInvalidoException("La sesión ya no es válida."));
        // Solo sirve el ÚLTIMO refresh emitido: uno rotado, o uno de antes de un logout, se rechaza.
        if (claims.getId() == null || !claims.getId().equals(usuario.getRefreshJti())) {
            throw new TokenInvalidoException("El refresh token ya no es válido.");
        }
        return emitirTokens(usuario);
    }

    /** Cierra la sesión del usuario autenticado: invalida su refresh token. */
    @Transactional
    public void cerrarSesion(String run) {
        repositorio.findById(run).ifPresent(usuario -> {
            usuario.setRefreshJti(null);
            repositorio.save(usuario);
        });
    }

    private RespuestaLogin emitirTokens(Usuario usuario) {
        String jti = UUID.randomUUID().toString();
        usuario.setRefreshJti(jti);
        repositorio.save(usuario);
        return new RespuestaLogin(
                jwtService.generarAccessToken(usuario),
                jwtService.generarRefreshToken(usuario, jti),
                "Bearer",
                jwtService.getAccessSegundos(),
                UsuarioRespuesta.de(usuario));
    }
}
