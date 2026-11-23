package cl.grwu.usuarios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import cl.grwu.usuarios.dto.LoginSolicitud;
import cl.grwu.usuarios.dto.RefreshSolicitud;
import cl.grwu.usuarios.dto.RespuestaLogin;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.exception.CredencialesInvalidasException;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.repository.UsuarioRepository;
import cl.grwu.usuarios.security.JwtService;
import cl.grwu.usuarios.security.TokenInvalidoException;
import io.jsonwebtoken.Claims;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Pruebas de AuthService con el repositorio simulado (Mockito) y JWT y BCrypt reales. */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String SECRETO = "secreto-de-pruebas-0123456789-abcdef";
    private static final String CORREO = "javiera.contreras@gmail.com";

    @Mock
    private UsuarioRepository repositorio;

    @Mock
    private UsuarioService usuarioService;

    private final PasswordEncoder codificador = new BCryptPasswordEncoder();
    private JwtService jwt;
    private AuthService servicio;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        jwt = new JwtService(SECRETO, "grwu-auth", 15, 7);
        servicio = new AuthService(repositorio, codificador, jwt, usuarioService);

        usuario = new Usuario();
        usuario.setRun("205558993");
        usuario.setNombre("Javiera");
        usuario.setApellidos("Contreras Lara");
        usuario.setCorreo(CORREO);
        usuario.setClaveHash(codificador.encode("1234"));
        usuario.setFechaNacimiento(LocalDate.of(2000, 6, 25));
        usuario.setTipoUsuario(TipoUsuario.Cliente);
        usuario.setActivo(true);
    }

    private void guardarDevuelveElMismo() {
        when(repositorio.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    // ---------------------------------------------------------------- login

    @Test
    @DisplayName("login correcto: emite access y refresh, y guarda el jti del refresh en el usuario")
    void loginCorrecto() {
        when(repositorio.findByCorreoIgnoreCase(CORREO)).thenReturn(Optional.of(usuario));
        guardarDevuelveElMismo();

        RespuestaLogin r = servicio.login(new LoginSolicitud(CORREO, "1234"));

        assertEquals("Bearer", r.tokenType());
        assertEquals(900, r.expiraEn());
        assertEquals("205558993", r.usuario().run());
        assertEquals("access", jwt.leerClaims(r.accessToken()).get("tipo", String.class));
        Claims refresh = jwt.leerClaims(r.refreshToken());
        assertEquals("refresh", refresh.get("tipo", String.class));
        assertNotNull(usuario.getRefreshJti());
        assertEquals(usuario.getRefreshJti(), refresh.getId());
    }

    @Test
    @DisplayName("login busca el correo sin espacios alrededor")
    void loginRecortaElCorreo() {
        when(repositorio.findByCorreoIgnoreCase(CORREO)).thenReturn(Optional.of(usuario));
        guardarDevuelveElMismo();

        assertNotNull(servicio.login(new LoginSolicitud("  " + CORREO + " ", "1234")));
    }

    @Test
    @DisplayName("login con clave incorrecta falla con el mensaje genérico y no emite nada")
    void loginClaveIncorrecta() {
        when(repositorio.findByCorreoIgnoreCase(CORREO)).thenReturn(Optional.of(usuario));

        CredencialesInvalidasException e = assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginSolicitud(CORREO, "9999")));

        assertEquals("Correo o contraseña incorrectos", e.getMessage());
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("login con un correo que no existe falla con EL MISMO mensaje (no revela qué correos hay)")
    void loginCorreoInexistente() {
        when(repositorio.findByCorreoIgnoreCase("nadie@gmail.com")).thenReturn(Optional.empty());

        CredencialesInvalidasException e = assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginSolicitud("nadie@gmail.com", "1234")));

        assertEquals("Correo o contraseña incorrectos", e.getMessage());
    }

    @Test
    @DisplayName("un usuario desactivado no puede iniciar sesión aunque la clave sea correcta")
    void loginUsuarioInactivo() {
        usuario.setActivo(false);
        when(repositorio.findByCorreoIgnoreCase(CORREO)).thenReturn(Optional.of(usuario));

        assertThrows(CredencialesInvalidasException.class, () -> servicio.login(new LoginSolicitud(CORREO, "1234")));
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("login con datos vacíos o sin cuerpo falla sin consultar la base")
    void loginVacio() {
        assertThrows(CredencialesInvalidasException.class, () -> servicio.login(new LoginSolicitud("", "")));
        assertThrows(CredencialesInvalidasException.class, () -> servicio.login(new LoginSolicitud(null, null)));
        assertThrows(CredencialesInvalidasException.class, () -> servicio.login(null));
        verifyNoInteractions(repositorio);
    }

    // ---------------------------------------------------------------- registro

    @Test
    @DisplayName("el registro delega en UsuarioService (que fuerza el rol Cliente)")
    void registroDelega() {
        UsuarioSolicitud solicitud = new UsuarioSolicitud("205558993", "Javiera", "Contreras Lara", CORREO, "1234",
                LocalDate.of(2000, 6, 25), "Administrador", "R", "C", null, null, null);
        UsuarioRespuesta esperada = UsuarioRespuesta.de(usuario);
        when(usuarioService.registrar(solicitud)).thenReturn(esperada);

        assertSame(esperada, servicio.registrar(solicitud));
    }

    // ---------------------------------------------------------------- refresh

    @Test
    @DisplayName("refresh correcto: rota el jti (el refresh anterior deja de servir) y emite tokens nuevos")
    void refreshRotaElJti() {
        usuario.setRefreshJti("jti-viejo");
        String refreshViejo = jwt.generarRefreshToken(usuario, "jti-viejo");
        when(repositorio.findById("205558993")).thenReturn(Optional.of(usuario));
        guardarDevuelveElMismo();

        RespuestaLogin r = servicio.refrescar(new RefreshSolicitud(refreshViejo));

        assertNotEquals("jti-viejo", usuario.getRefreshJti());
        assertEquals(usuario.getRefreshJti(), jwt.leerClaims(r.refreshToken()).getId());
        assertEquals("access", jwt.leerClaims(r.accessToken()).get("tipo", String.class));
    }

    @Test
    @DisplayName("un refresh token ya rotado (jti viejo) se rechaza")
    void refreshViejoRechazado() {
        usuario.setRefreshJti("jti-nuevo");
        String refreshViejo = jwt.generarRefreshToken(usuario, "jti-viejo");
        when(repositorio.findById("205558993")).thenReturn(Optional.of(usuario));

        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud(refreshViejo)));
    }

    @Test
    @DisplayName("un access token no sirve como refresh token")
    void accessNoSirveComoRefresh() {
        String access = jwt.generarAccessToken(usuario);

        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud(access)));
        verifyNoInteractions(repositorio);
    }

    @Test
    @DisplayName("refresh con texto basura, vacío o sin cuerpo se rechaza")
    void refreshBasura() {
        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud("no-es-un-jwt")));
        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud(null)));
        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(null));
    }

    @Test
    @DisplayName("un usuario desactivado no puede refrescar su sesión")
    void refreshUsuarioInactivo() {
        usuario.setRefreshJti("jti-1");
        usuario.setActivo(false);
        String refresh = jwt.generarRefreshToken(usuario, "jti-1");
        when(repositorio.findById("205558993")).thenReturn(Optional.of(usuario));

        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud(refresh)));
    }

    // ---------------------------------------------------------------- logout

    @Test
    @DisplayName("logout borra el jti: el refresh token anterior ya no sirve")
    void logoutInvalidaElRefresh() {
        usuario.setRefreshJti("jti-1");
        String refresh = jwt.generarRefreshToken(usuario, "jti-1");
        when(repositorio.findById("205558993")).thenReturn(Optional.of(usuario));
        guardarDevuelveElMismo();

        servicio.cerrarSesion("205558993");

        assertNull(usuario.getRefreshJti());
        verify(repositorio).save(usuario);
        assertThrows(TokenInvalidoException.class, () -> servicio.refrescar(new RefreshSolicitud(refresh)));
    }

    @Test
    @DisplayName("logout de un usuario que ya no existe no falla")
    void logoutUsuarioInexistente() {
        when(repositorio.findById("205558993")).thenReturn(Optional.empty());

        servicio.cerrarSesion("205558993");

        verify(repositorio, never()).save(any());
    }
}
