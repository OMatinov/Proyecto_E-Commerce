package cl.grwu.usuarios.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.grwu.usuarios.config.SecurityConfig;
import cl.grwu.usuarios.dto.CambioClaveSolicitud;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.exception.ConflictoException;
import cl.grwu.usuarios.exception.RecursoNoEncontradoException;
import cl.grwu.usuarios.exception.ValidacionException;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.security.JwtService;
import cl.grwu.usuarios.security.RestAccessDeniedHandler;
import cl.grwu.usuarios.security.RestAuthenticationEntryPoint;
import cl.grwu.usuarios.service.UsuarioService;
import java.time.LocalDate;
import java.util.List;
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

/**
 * Matriz de roles de /api/v1/usuarios (sección 11.2 del contexto) con la seguridad real:
 * sin token 401, Cliente y Vendedor en rutas de administración 403, Administrador 200.
 */
@WebMvcTest(UsuarioController.class)
@Import({SecurityConfig.class, JwtService.class, RestAuthenticationEntryPoint.class, RestAccessDeniedHandler.class})
@TestPropertySource(properties = "jwt.secret=secreto-de-pruebas-0123456789-abcdef")
class UsuarioControllerTest {

    private static final String ADMIN = "190110222";
    private static final String CLIENTE = "205558993";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private UsuarioService usuarioService;

    private String bearer(String run, TipoUsuario rol) {
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre("Prueba");
        u.setTipoUsuario(rol);
        return "Bearer " + jwtService.generarAccessToken(u);
    }

    private UsuarioRespuesta respuesta() {
        return new UsuarioRespuesta(CLIENTE, "Javiera", "Contreras Lara", "javiera.contreras@gmail.com",
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", "Manuel Montt 321",
                "+56 9 3333 7788", true);
    }

    // ---------------------------------------------------------------- sin token

    @Test
    @DisplayName("sin token, cualquier ruta de usuarios responde 401")
    void sinTokenResponde401() throws Exception {
        mvc.perform(get("/api/v1/usuarios")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/usuarios/me")).andExpect(status().isUnauthorized());
        mvc.perform(put("/api/v1/usuarios/me/clave").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(usuarioService);
    }

    // ---------------------------------------------------------------- Cliente y Vendedor: 403 en administración

    @Test
    @DisplayName("un Cliente recibe 403 en TODAS las rutas de administración de usuarios")
    void clienteRecibe403() throws Exception {
        String token = bearer(CLIENTE, TipoUsuario.Cliente);

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, token)).andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/usuarios/190110222").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
        mvc.perform(put("/api/v1/usuarios/190110222").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/usuarios/190110222").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("Forbidden"));
        verifyNoInteractions(usuarioService);
    }

    @Test
    @DisplayName("un Vendedor tampoco puede administrar usuarios (403)")
    void vendedorRecibe403() throws Exception {
        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer("172076920", TipoUsuario.Vendedor)))
                .andExpect(status().isForbidden());
    }

    // ---------------------------------------------------------------- Administrador

    @Test
    @DisplayName("un Administrador lista los usuarios (200)")
    void adminLista() throws Exception {
        when(usuarioService.listar()).thenReturn(List.of(respuesta()));

        mvc.perform(get("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(ADMIN, TipoUsuario.Administrador)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].run").value(CLIENTE))
                .andExpect(jsonPath("$[0].clave").doesNotExist())
                .andExpect(jsonPath("$[0].claveHash").doesNotExist());
    }

    @Test
    @DisplayName("un Administrador ve el detalle y un usuario inexistente responde 404")
    void adminDetalle() throws Exception {
        String token = bearer(ADMIN, TipoUsuario.Administrador);
        when(usuarioService.obtener(CLIENTE)).thenReturn(respuesta());
        when(usuarioService.obtener("999999999")).thenThrow(new RecursoNoEncontradoException("Usuario no encontrado."));

        mvc.perform(get("/api/v1/usuarios/" + CLIENTE).header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Javiera"));
        mvc.perform(get("/api/v1/usuarios/999999999").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Usuario no encontrado."));
    }

    @Test
    @DisplayName("un Administrador crea un usuario (201)")
    void adminCrea() throws Exception {
        when(usuarioService.crear(any(UsuarioSolicitud.class))).thenReturn(respuesta());

        mvc.perform(post("/api/v1/usuarios").header(HttpHeaders.AUTHORIZATION, bearer(ADMIN, TipoUsuario.Administrador))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"run\":\"205558993\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.run").value(CLIENTE));
    }

    @Test
    @DisplayName("al editar, el RUN del solicitante sale del token y los errores de validación llegan en \"errores\"")
    void adminEditaConValidacion() throws Exception {
        when(usuarioService.actualizar(eq(CLIENTE), any(UsuarioSolicitud.class), eq(ADMIN)))
                .thenThrow(new ValidacionException(Map.of("nombre", "El nombre es obligatorio.")));

        mvc.perform(put("/api/v1/usuarios/" + CLIENTE)
                        .header(HttpHeaders.AUTHORIZATION, bearer(ADMIN, TipoUsuario.Administrador))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.nombre").value("El nombre es obligatorio."));
    }

    @Test
    @DisplayName("un Administrador desactiva a otro usuario (204) pasando su propio RUN como solicitante")
    void adminDesactiva() throws Exception {
        mvc.perform(delete("/api/v1/usuarios/" + CLIENTE)
                        .header(HttpHeaders.AUTHORIZATION, bearer(ADMIN, TipoUsuario.Administrador)))
                .andExpect(status().isNoContent());

        verify(usuarioService).desactivar(CLIENTE, ADMIN);
    }

    @Test
    @DisplayName("desactivarse a sí mismo responde 409")
    void adminSeDesactivaASiMismo() throws Exception {
        doThrow(new ConflictoException("No puedes desactivar tu propia cuenta."))
                .when(usuarioService).desactivar(ADMIN, ADMIN);

        mvc.perform(delete("/api/v1/usuarios/" + ADMIN)
                        .header(HttpHeaders.AUTHORIZATION, bearer(ADMIN, TipoUsuario.Administrador)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("No puedes desactivar tu propia cuenta."));
    }

    // ---------------------------------------------------------------- perfil propio (cualquier usuario autenticado)

    @Test
    @DisplayName("un Cliente ve su propio perfil: el RUN sale del token, no de la URL")
    void clienteVeSuPerfil() throws Exception {
        when(usuarioService.perfil(CLIENTE)).thenReturn(respuesta());

        mvc.perform(get("/api/v1/usuarios/me").header(HttpHeaders.AUTHORIZATION, bearer(CLIENTE, TipoUsuario.Cliente)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.run").value(CLIENTE));
    }

    @Test
    @DisplayName("un Cliente actualiza su perfil (200)")
    void clienteActualizaSuPerfil() throws Exception {
        when(usuarioService.actualizarPerfil(eq(CLIENTE), any(UsuarioSolicitud.class))).thenReturn(respuesta());

        mvc.perform(put("/api/v1/usuarios/me").header(HttpHeaders.AUTHORIZATION, bearer(CLIENTE, TipoUsuario.Cliente))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nombre\":\"Javiera\"}"))
                .andExpect(status().isOk());

        verify(usuarioService).actualizarPerfil(eq(CLIENTE), any(UsuarioSolicitud.class));
    }

    @Test
    @DisplayName("un Vendedor también puede ver su perfil")
    void vendedorVeSuPerfil() throws Exception {
        when(usuarioService.perfil("172076920")).thenReturn(respuesta());

        mvc.perform(get("/api/v1/usuarios/me").header(HttpHeaders.AUTHORIZATION, bearer("172076920", TipoUsuario.Vendedor)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("cambiar la clave responde 204; con una clave actual incorrecta responde 400")
    void cambiarClave() throws Exception {
        String token = bearer(CLIENTE, TipoUsuario.Cliente);

        mvc.perform(put("/api/v1/usuarios/me/clave").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"claveActual\":\"1234\",\"claveNueva\":\"nueva1\"}"))
                .andExpect(status().isNoContent());
        verify(usuarioService).cambiarClave(eq(CLIENTE), any(CambioClaveSolicitud.class));

        doThrow(new ValidacionException(Map.of("claveActual", "La contraseña actual es incorrecta.")))
                .when(usuarioService).cambiarClave(eq(CLIENTE), any(CambioClaveSolicitud.class));
        mvc.perform(put("/api/v1/usuarios/me/clave").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"claveActual\":\"mala\",\"claveNueva\":\"nueva1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.claveActual").value("La contraseña actual es incorrecta."));
    }
}
