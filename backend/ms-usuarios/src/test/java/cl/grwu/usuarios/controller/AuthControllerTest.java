package cl.grwu.usuarios.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.grwu.usuarios.config.SecurityConfig;
import cl.grwu.usuarios.dto.LoginSolicitud;
import cl.grwu.usuarios.dto.RefreshSolicitud;
import cl.grwu.usuarios.dto.RespuestaLogin;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.exception.ConflictoException;
import cl.grwu.usuarios.exception.CredencialesInvalidasException;
import cl.grwu.usuarios.exception.ValidacionException;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.security.JwtService;
import cl.grwu.usuarios.security.RestAccessDeniedHandler;
import cl.grwu.usuarios.security.RestAuthenticationEntryPoint;
import cl.grwu.usuarios.security.TokenInvalidoException;
import cl.grwu.usuarios.service.AuthService;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Endpoints de /api/v1/auth con la seguridad real y el servicio simulado. */
@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtService.class, RestAuthenticationEntryPoint.class, RestAccessDeniedHandler.class})
@TestPropertySource(properties = "jwt.secret=secreto-de-pruebas-0123456789-abcdef")
class AuthControllerTest {

    private static final String LOGIN_JSON = "{\"correo\":\"javiera.contreras@gmail.com\",\"clave\":\"1234\"}";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private AuthService authService;

    private UsuarioRespuesta usuario() {
        return new UsuarioRespuesta("205558993", "Javiera", "Contreras Lara", "javiera.contreras@gmail.com",
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", "Manuel Montt 321",
                "+56 9 3333 7788", true);
    }

    private String tokenAccess() {
        Usuario u = new Usuario();
        u.setRun("205558993");
        u.setNombre("Javiera");
        u.setTipoUsuario(TipoUsuario.Cliente);
        return jwtService.generarAccessToken(u);
    }

    private String tokenRefresh() {
        Usuario u = new Usuario();
        u.setRun("205558993");
        u.setNombre("Javiera");
        u.setTipoUsuario(TipoUsuario.Cliente);
        return jwtService.generarRefreshToken(u, "jti-1");
    }

    // ---------------------------------------------------------------- login

    @Test
    @DisplayName("login responde 200 con tokens, tipo Bearer, expiraEn y el usuario sin clave")
    void loginOk() throws Exception {
        when(authService.login(any(LoginSolicitud.class)))
                .thenReturn(new RespuestaLogin("acc", "ref", "Bearer", 900, usuario()));

        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(LOGIN_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("acc"))
                .andExpect(jsonPath("$.refreshToken").value("ref"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiraEn").value(900))
                .andExpect(jsonPath("$.usuario.run").value("205558993"))
                .andExpect(jsonPath("$.usuario.tipoUsuario").value("Cliente"))
                .andExpect(jsonPath("$.usuario.clave").doesNotExist())
                .andExpect(jsonPath("$.usuario.claveHash").doesNotExist())
                .andExpect(jsonPath("$.usuario.refreshJti").doesNotExist());
    }

    @Test
    @DisplayName("login con credenciales malas responde 401 con el mensaje genérico")
    void loginCredencialesInvalidas() throws Exception {
        when(authService.login(any(LoginSolicitud.class))).thenThrow(new CredencialesInvalidasException());

        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(LOGIN_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Correo o contraseña incorrectos"))
                .andExpect(jsonPath("$.path").value("/api/v1/auth/login"));
    }

    @Test
    @DisplayName("un cuerpo que no es JSON responde 400 con el formato de error")
    void cuerpoMalFormado() throws Exception {
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{esto no es json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("El cuerpo de la solicitud es inválido o está incompleto."));
    }

    @Test
    @DisplayName("usar GET en una ruta de login responde 405 con el formato de error")
    void metodoNoPermitido() throws Exception {
        mvc.perform(get("/api/v1/auth/login"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.status").value(405))
                .andExpect(jsonPath("$.message").value("Método no permitido para esta ruta."));
    }

    // ---------------------------------------------------------------- registro

    @Test
    @DisplayName("registro responde 201 con el usuario creado (rol Cliente)")
    void registroCreado() throws Exception {
        when(authService.registrar(any(UsuarioSolicitud.class))).thenReturn(usuario());

        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"run\":\"205558993\",\"nombre\":\"Javiera\",\"clave\":\"1234\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.run").value("205558993"))
                .andExpect(jsonPath("$.tipoUsuario").value("Cliente"));
    }

    @Test
    @DisplayName("registro con datos inválidos responde 400 con el detalle por campo en \"errores\"")
    void registroInvalido() throws Exception {
        when(authService.registrar(any(UsuarioSolicitud.class)))
                .thenThrow(new ValidacionException(Map.of("correo", "El correo es obligatorio.")));

        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errores.correo").value("El correo es obligatorio."));
    }

    @Test
    @DisplayName("registro con un RUN repetido responde 409")
    void registroDuplicado() throws Exception {
        when(authService.registrar(any(UsuarioSolicitud.class)))
                .thenThrow(new ConflictoException("Ya existe un usuario con ese RUN.", Map.of("run", "Ya existe un usuario con ese RUN.")));

        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.errores.run").value("Ya existe un usuario con ese RUN."));
    }

    // ---------------------------------------------------------------- refresh

    @Test
    @DisplayName("refresh es público y devuelve tokens nuevos")
    void refreshOk() throws Exception {
        when(authService.refrescar(any(RefreshSolicitud.class)))
                .thenReturn(new RespuestaLogin("acc2", "ref2", "Bearer", 900, usuario()));

        mvc.perform(post("/api/v1/auth/refresh").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"cualquiera\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("acc2"));
    }

    @Test
    @DisplayName("refresh con un token inválido responde 401")
    void refreshInvalido() throws Exception {
        when(authService.refrescar(any(RefreshSolicitud.class)))
                .thenThrow(new TokenInvalidoException("El refresh token ya no es válido."));

        mvc.perform(post("/api/v1/auth/refresh").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"viejo\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("El refresh token ya no es válido."));
    }

    // ---------------------------------------------------------------- logout (exige token)

    @Test
    @DisplayName("logout sin token responde 401")
    void logoutSinToken() throws Exception {
        mvc.perform(post("/api/v1/auth/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("logout con access token responde 204 y cierra la sesión del RUN del token")
    void logoutOk() throws Exception {
        mvc.perform(post("/api/v1/auth/logout").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenAccess()))
                .andExpect(status().isNoContent());

        verify(authService).cerrarSesion("205558993");
    }

    @Test
    @DisplayName("un refresh token NO sirve para autenticar el logout")
    void logoutConRefreshToken() throws Exception {
        mvc.perform(post("/api/v1/auth/logout").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenRefresh()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("una ruta que no existe responde 404 con el formato de error")
    void rutaInexistente() throws Exception {
        mvc.perform(get("/api/v1/no-existe").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenAccess()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Recurso no encontrado."));
    }
}
