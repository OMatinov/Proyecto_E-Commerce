package cl.grwu.boletas.controller;

import cl.grwu.boletas.security.JwtAccessDeniedHandler;
import cl.grwu.boletas.security.JwtAuthenticationEntryPoint;
import cl.grwu.boletas.security.JwtAuthenticationFilter;
import cl.grwu.boletas.security.JwtService;
import cl.grwu.boletas.security.SecurityConfig;
import cl.grwu.boletas.service.BoletaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BoletaController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class,
        JwtAccessDeniedHandler.class, JwtService.class})
@TestPropertySource(properties = {
        "jwt.secret=clave-de-prueba-con-al-menos-32-caracteres",
        "jwt.issuer=grwu-auth"
})
class BoletaControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoletaService boletaService;

    @Test
    void sinTokenResponde401ConFormatoDelContrato() throws Exception {
        mockMvc.perform(get("/api/v1/boletas"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.path").value("/api/v1/boletas"));
    }

    @Test
    void clienteNoPuedeListarBoletasYResponde403() throws Exception {
        mockMvc.perform(get("/api/v1/boletas").with(user("190110222").roles("CLIENTE")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    @Test
    void administradorPuedeListarBoletas() throws Exception {
        lenient().when(boletaService.listarBoletasResponse(any(), any(), any(), any()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/boletas").with(user("admin").roles("ADMINISTRADOR")))
                .andExpect(status().isOk());
    }
}
