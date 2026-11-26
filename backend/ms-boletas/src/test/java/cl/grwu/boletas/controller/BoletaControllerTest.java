package cl.grwu.boletas.controller;

import cl.grwu.boletas.dto.BoletaResponse;
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
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Controlador: matrices de autorización (Cliente crea / Admin puede modificar)
 * y validación del DTO (@NotEmpty en items) mediante bean validation.
 */
@WebMvcTest(BoletaController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class,
        JwtAccessDeniedHandler.class, JwtService.class})
@TestPropertySource(properties = {
        "jwt.secret=clave-de-prueba-con-al-menos-32-caracteres",
        "jwt.issuer=grwu-auth"
})
class BoletaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoletaService boletaService;

    // RUNs semilla: Cliente 205558993 (Javiera), Vendedor 172076920 (Matías), Admin 190110222 (Camila)
    private static final String BODY_CREAR_BOLETA = """
            {
              "items": [{"productoId": "p-001", "cantidad": 2}],
              "despacho": "estandar",
              "metodoPago": "credito",
              "cliente": {"nombre": "Matias", "apellidos": "Olmedo", "correo": "matias.fuentes@duoc.cl"},
              "direccion": {"calle": "Calle Falsa 123", "region": "Región Metropolitana de Santiago", "comuna": "Santiago"}
            }
            """;

    @Test
    void clienteCreaBoletaYRecibe201() throws Exception {
        lenient().when(boletaService.crearBoleta(any(), eq("205558993"))).thenReturn(respuestaBoleta());

        mockMvc.perform(post("/api/v1/boletas")
                        .with(user("205558993").roles("CLIENTE"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY_CREAR_BOLETA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ORD-20260001"))
                .andExpect(jsonPath("$.usuarioRun").value("205558993"));
    }

    @Test
    void crearBoletaConItemsVaciosDevuelve400() throws Exception {
        mockMvc.perform(post("/api/v1/boletas")
                        .with(user("205558993").roles("CLIENTE"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY_CREAR_BOLETA.replace("[{\"productoId\": \"p-001\", \"cantidad\": 2}]", "[]")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void clienteNoPuedeCambiarEstadoDeBoleta() throws Exception {
        mockMvc.perform(patch("/api/v1/boletas/ORD-20260001/estado")
                        .with(user("205558993").roles("CLIENTE"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\": \"enviada\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void vendedorNoPuedeCambiarEstadoDeBoleta() throws Exception {
        mockMvc.perform(patch("/api/v1/boletas/ORD-20260001/estado")
                        .with(user("172076920").roles("VENDEDOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\": \"enviada\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void vendedorPuedeListarBoletas() throws Exception {
        lenient().when(boletaService.listarBoletasResponse(any(), any(), any(), any())).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/boletas").with(user("172076920").roles("VENDEDOR")))
                .andExpect(status().isOk());
    }

    @Test
    void clienteSoloVeSusBoletas() throws Exception {
        lenient().when(boletaService.obtenerBoletasPorUsuarioResponse(eq("205558993"))).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/boletas/mias").with(user("205558993").roles("CLIENTE")))
                .andExpect(status().isOk());
    }

    @Test
    void administradorPuedeCancelarBoleta() throws Exception {
        mockMvc.perform(delete("/api/v1/boletas/ORD-20260001")
                        .with(user("190110222").roles("ADMINISTRADOR")))
                .andExpect(status().isNoContent());
    }

    private BoletaResponse respuestaBoleta() {
        BoletaResponse res = new BoletaResponse();
        res.setId("ORD-20260001");
        res.setNumero(20260001L);
        res.setUsuarioRun("205558993");
        res.setEstado("pagada");
        res.setTotal(40000);
        res.setItems(List.of());
        BoletaResponse.ClienteResponse cliente = new BoletaResponse.ClienteResponse();
        cliente.setNombre("Matias");
        cliente.setApellidos("Olmedo");
        cliente.setCorreo("matias.fuentes@duoc.cl");
        res.setCliente(cliente);
        return res;
    }
}
