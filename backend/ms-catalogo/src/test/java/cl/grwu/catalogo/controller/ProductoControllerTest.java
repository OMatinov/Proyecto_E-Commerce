package cl.grwu.catalogo.controller;

import cl.grwu.catalogo.dto.ProductoRequest;
import cl.grwu.catalogo.dto.ProductoResponse;
import cl.grwu.catalogo.dto.StockRequest;
import cl.grwu.catalogo.exception.RecursoNoEncontradoException;
import cl.grwu.catalogo.security.JwtAuthenticationFilter;
import cl.grwu.catalogo.security.JwtService;
import cl.grwu.catalogo.security.RestAccessDeniedHandler;
import cl.grwu.catalogo.security.RestAuthenticationEntryPoint;
import cl.grwu.catalogo.security.SecurityConfig;
import cl.grwu.catalogo.security.SecurityErrorWriter;
import cl.grwu.catalogo.security.ServiceKeyFilter;
import cl.grwu.catalogo.service.ProductoService;
import cl.grwu.catalogo.support.TokensDePrueba;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas del contrato HTTP de productos con el servicio mockeado:
 * validacion de campos, formato de error, roles y endpoint interno de stock.
 */
@WebMvcTest(controllers = ProductoController.class,
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
class ProductoControllerTest {

    private static final String CLAVE_SERVICIO = "clave-interna-de-prueba";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService productoService;

    @Test
    void listarDevuelve200ConLaLista() throws Exception {
        when(productoService.listar(any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(respuesta()));

        mockMvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("p-001"))
                .andExpect(jsonPath("$[0].categoriaSlug").value("polerones"));
    }

    @Test
    void listarPasaLosFiltrosAlServicio() throws Exception {
        when(productoService.listar(any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/productos")
                        .param("categoria", "polerones")
                        .param("genero", "mujer")
                        .param("oferta", "true")
                        .param("q", "poleron")
                        .param("criticos", "true")
                        .param("umbral", "3"))
                .andExpect(status().isOk());

        verify(productoService).listar("polerones", "mujer", true, "poleron", true, 3);
    }

    @Test
    void detalleInexistenteDevuelve404ConElFormatoDeError() throws Exception {
        when(productoService.obtener("p-999"))
                .thenThrow(new RecursoNoEncontradoException("Producto no encontrado: p-999"));

        mockMvc.perform(get("/api/v1/productos/p-999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Producto no encontrado: p-999"))
                .andExpect(jsonPath("$.path").value("/api/v1/productos/p-999"));
    }

    @Test
    void crearConAdministradorDevuelve201() throws Exception {
        when(productoService.crear(any(ProductoRequest.class))).thenReturn(respuesta());

        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION,
                                "Bearer " + TokensDePrueba.conRol("Administrador"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpoValido()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("p-001"));
    }

    @Test
    void crearConVendedorDevuelve403() throws Exception {
        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION,
                                "Bearer " + TokensDePrueba.conRol("Vendedor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpoValido()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void crearConPrecioInvalidoDevuelve400ConDetalleDelCampo() throws Exception {
        String cuerpo = """
                {
                  "nombre": "Poleron GRWU",
                  "precio": 0,
                  "categoria": "polerones",
                  "genero": "unisex",
                  "stock": 10
                }
                """;

        mockMvc.perform(post("/api/v1/productos")
                        .header(HttpHeaders.AUTHORIZATION,
                                "Bearer " + TokensDePrueba.conRol("Administrador"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errores.precio").exists());
    }

    @Test
    void stockConClaveDeServicioDevuelve200() throws Exception {
        when(productoService.ajustarStock(eq("p-001"), any(StockRequest.class)))
                .thenReturn(respuesta());

        mockMvc.perform(patch("/api/v1/productos/p-001/stock")
                        .header("X-Service-Key", CLAVE_SERVICIO)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cantidad\":2,\"operacion\":\"descontar\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("p-001"));
    }

    @Test
    void stockSinClaveDeServicioDevuelve401() throws Exception {
        mockMvc.perform(patch("/api/v1/productos/p-001/stock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cantidad\":2,\"operacion\":\"descontar\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void eliminarConAdministradorDevuelve204() throws Exception {
        mockMvc.perform(delete("/api/v1/productos/p-001")
                        .header(HttpHeaders.AUTHORIZATION,
                                "Bearer " + TokensDePrueba.conRol("Administrador")))
                .andExpect(status().isNoContent());

        verify(productoService).eliminar("p-001");
    }

    private ProductoResponse respuesta() {
        return new ProductoResponse("p-001", "Poleron GRWU", "Descripcion",
                19990, 0, 0, "c-001", "polerones", "unisex", 10,
                "img/poleron.png", List.of());
    }

    private String cuerpoValido() {
        return """
                {
                  "nombre": "Poleron GRWU",
                  "descripcion": "Poleron de algodon",
                  "precio": 19990,
                  "precioOriginal": 0,
                  "oferta": 0,
                  "categoria": "polerones",
                  "genero": "unisex",
                  "stock": 10,
                  "imagen": "img/poleron.png",
                  "imagenes": []
                }
                """;
    }
}
