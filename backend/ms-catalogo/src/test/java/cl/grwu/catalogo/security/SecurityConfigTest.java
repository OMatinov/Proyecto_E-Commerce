package cl.grwu.catalogo.security;

import cl.grwu.catalogo.support.ControladorDePrueba;
import cl.grwu.catalogo.support.TokensDePrueba;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifica la cadena de seguridad completa sin base de datos:
 * rutas publicas, 401 sin token, 403 por rol insuficiente y el endpoint
 * interno de stock con X-Service-Key.
 */
@WebMvcTest(controllers = ControladorDePrueba.class,
        excludeAutoConfiguration = UserDetailsServiceAutoConfiguration.class)
@Import({
        SecurityConfig.class,
        JwtService.class,
        JwtAuthenticationFilter.class,
        ServiceKeyFilter.class,
        SecurityErrorWriter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class
})
@TestPropertySource(properties = {
        "jwt.secret=" + TokensDePrueba.SECRETO,
        "jwt.issuer=" + TokensDePrueba.ISSUER,
        "grwu.service-key=clave-interna-de-prueba"
})
class SecurityConfigTest {

    private static final String CLAVE_SERVICIO = "clave-interna-de-prueba";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getDeProductosEsPublico() throws Exception {
        mockMvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk());
    }

    @Test
    void postSinTokenResponde401ConJson() throws Exception {
        mockMvc.perform(post("/api/v1/productos"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.path").value("/api/v1/productos"));
    }

    @Test
    void postConRolVendedorResponde403() throws Exception {
        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TokensDePrueba.conRol("Vendedor")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("No tienes permisos para acceder a este recurso"));
    }

    @Test
    void postConRolAdministradorResponde200() throws Exception {
        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + TokensDePrueba.conRol("Administrador")))
                .andExpect(status().isOk());
    }

    @Test
    void tokenConFirmaInvalidaResponde401() throws Exception {
        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer token.invalido.aqui"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rutaNoPublicaSinTokenResponde401() throws Exception {
        mockMvc.perform(get("/api/v1/privado"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void stockConClaveDeServicioValidaResponde200() throws Exception {
        mockMvc.perform(patch("/api/v1/productos/p-001/stock")
                        .header("X-Service-Key", CLAVE_SERVICIO))
                .andExpect(status().isOk());
    }

    @Test
    void stockSinClaveDeServicioResponde401() throws Exception {
        mockMvc.perform(patch("/api/v1/productos/p-001/stock"))
                .andExpect(status().isUnauthorized());
    }
}
