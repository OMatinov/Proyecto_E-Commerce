package cl.grwu.usuarios.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.grwu.usuarios.config.SecurityConfig;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Prueba la cadena de seguridad real (SecurityConfig + filtro JWT + handlers) con MockMvc.
 * Demuestra la matriz de roles: sin token -> 401, rol insuficiente -> 403, rol correcto -> 200.
 */
// controllers = ...: solo se carga el controlador de prueba (no los reales, que repiten las mismas rutas).
@WebMvcTest(controllers = ControladorDePrueba.class)
@Import({SecurityConfig.class, JwtService.class, RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class, ControladorDePrueba.class})
@TestPropertySource(properties = "jwt.secret=secreto-de-pruebas-0123456789-abcdef")
class SeguridadWebTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JwtService jwtService;

    private Usuario usuario(TipoUsuario rol) {
        Usuario u = new Usuario();
        u.setRun("205558993");
        u.setNombre("Javiera");
        u.setTipoUsuario(rol);
        return u;
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    @DisplayName("sin token, una ruta protegida responde 401 con el JSON de error")
    void sinTokenResponde401() throws Exception {
        mvc.perform(get("/api/v1/usuarios/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.path").value("/api/v1/usuarios/me"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    @DisplayName("una ruta pública (login) responde sin token")
    void rutaPublicaSinToken() throws Exception {
        mvc.perform(post("/api/v1/auth/login"))
                .andExpect(status().isOk())
                .andExpect(content().string("publico"));
    }

    @Test
    @DisplayName("con access token válido llega al controlador como el RUN del usuario")
    void tokenValidoIdentificaAlUsuario() throws Exception {
        String token = jwtService.generarAccessToken(usuario(TipoUsuario.Cliente));

        mvc.perform(get("/api/v1/usuarios/me").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(content().string("205558993"));
    }

    @Test
    @DisplayName("un Cliente en una ruta de Administrador recibe 403")
    void clienteEnRutaDeAdminResponde403() throws Exception {
        String token = jwtService.generarAccessToken(usuario(TipoUsuario.Cliente));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    @Test
    @DisplayName("un Vendedor tampoco entra a una ruta de Administrador")
    void vendedorEnRutaDeAdminResponde403() throws Exception {
        String token = jwtService.generarAccessToken(usuario(TipoUsuario.Vendedor));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("un Administrador sí entra a su ruta")
    void adminEnRutaDeAdminResponde200() throws Exception {
        String token = jwtService.generarAccessToken(usuario(TipoUsuario.Administrador));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("un token expirado responde 401")
    void tokenExpiradoResponde401() throws Exception {
        String vencido = new JwtService("secreto-de-pruebas-0123456789-abcdef", "grwu-auth", -1, 7)
                .generarAccessToken(usuario(TipoUsuario.Administrador));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(vencido)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("un refresh token NO sirve para llamar a la API (401)")
    void refreshTokenNoSirveComoAccess() throws Exception {
        String refresh = jwtService.generarRefreshToken(usuario(TipoUsuario.Administrador), "jti-1");

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(refresh)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("un token firmado con otra clave responde 401")
    void firmaFalsaResponde401() throws Exception {
        String falso = new JwtService("otro-secreto-distinto-0123456789-xyz", "grwu-auth", 15, 7)
                .generarAccessToken(usuario(TipoUsuario.Administrador));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(falso)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("un texto basura en el header responde 401")
    void tokenBasuraResponde401() throws Exception {
        mvc.perform(get("/api/v1/usuarios/me").header(HttpHeaders.AUTHORIZATION, "Bearer esto-no-es-un-jwt"))
                .andExpect(status().isUnauthorized());
    }
}
