package cl.grwu.usuarios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import cl.grwu.usuarios.dto.CambioClaveSolicitud;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.exception.ConflictoException;
import cl.grwu.usuarios.exception.RecursoNoEncontradoException;
import cl.grwu.usuarios.exception.ValidacionException;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.repository.UsuarioRepository;
import cl.grwu.usuarios.security.TokenInvalidoException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Pruebas de las reglas de negocio de UsuarioService (registro, CRUD de administración y perfil propio). */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    private static final String RUN = "205558993";
    private static final String CORREO = "javiera.contreras@gmail.com";

    @Mock
    private UsuarioRepository repositorio;

    private final PasswordEncoder codificador = new BCryptPasswordEncoder();
    private UsuarioService servicio;
    private Usuario existente;
    private String hashOriginal;

    @BeforeEach
    void preparar() {
        servicio = new UsuarioService(repositorio, codificador);
        hashOriginal = codificador.encode("1234");
        existente = new Usuario();
        existente.setRun(RUN);
        existente.setNombre("Javiera");
        existente.setApellidos("Contreras Lara");
        existente.setCorreo(CORREO);
        existente.setClaveHash(hashOriginal);
        existente.setFechaNacimiento(LocalDate.of(2000, 6, 25));
        existente.setTipoUsuario(TipoUsuario.Cliente);
        existente.setRegion("Región de la Araucanía");
        existente.setComuna("Temuco");
        existente.setActivo(true);
        existente.setRefreshJti("jti-1");
    }

    private UsuarioSolicitud solicitud(String run, String clave, String tipo) {
        return new UsuarioSolicitud(run, "Javiera", "Contreras Lara", CORREO, clave, LocalDate.of(2000, 6, 25), tipo,
                "Región de la Araucanía", "Temuco", "Manuel Montt 321", "+56 9 3333 7788", null);
    }

    private void guardarDevuelveElMismo() {
        when(repositorio.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    // ---------------------------------------------------------------- registro

    @Test
    @DisplayName("el registro SIEMPRE crea un Cliente (aunque se pida Administrador) y guarda la clave con BCrypt")
    void registroForzaClienteYHasheaLaClave() {
        when(repositorio.existsById(RUN)).thenReturn(false);
        when(repositorio.existsByCorreoIgnoreCase(CORREO)).thenReturn(false);
        guardarDevuelveElMismo();

        UsuarioRespuesta r = servicio.registrar(solicitud(RUN, "1234", "Administrador"));

        ArgumentCaptor<Usuario> guardado = ArgumentCaptor.forClass(Usuario.class);
        verify(repositorio).save(guardado.capture());
        assertEquals(TipoUsuario.Cliente, guardado.getValue().getTipoUsuario());
        assertEquals("Cliente", r.tipoUsuario());
        assertTrue(guardado.getValue().isActivo());
        assertTrue(guardado.getValue().getClaveHash().startsWith("$2"));
        assertTrue(codificador.matches("1234", guardado.getValue().getClaveHash()));
    }

    @Test
    @DisplayName("el RUN se limpia (puntos y guion) antes de buscar si ya existe")
    void registroLimpiaElRun() {
        when(repositorio.existsById(RUN)).thenReturn(true);

        ConflictoException e = assertThrows(ConflictoException.class,
                () -> servicio.registrar(solicitud("20.555.899-3", "1234", null)));

        assertEquals("Ya existe un usuario con ese RUN.", e.getMessage());
        assertEquals("Ya existe un usuario con ese RUN.", e.getErrores().get("run"));
    }

    @Test
    @DisplayName("un correo ya registrado responde 409, sin distinguir mayúsculas")
    void registroCorreoDuplicado() {
        when(repositorio.existsById(RUN)).thenReturn(false);
        when(repositorio.existsByCorreoIgnoreCase(CORREO)).thenReturn(true);

        ConflictoException e = assertThrows(ConflictoException.class,
                () -> servicio.registrar(solicitud(RUN, "1234", null)));

        assertEquals("Ya existe un usuario con ese correo.", e.getErrores().get("correo"));
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("datos inválidos responden 400 con el detalle por campo y no tocan la base")
    void registroDatosInvalidos() {
        UsuarioSolicitud mala = new UsuarioSolicitud("190110223", "", "Contreras", "x@hotmail.com", "1",
                LocalDate.of(2000, 6, 25), null, "R", "C", null, null, null);

        ValidacionException e = assertThrows(ValidacionException.class, () -> servicio.registrar(mala));

        assertTrue(e.getErrores().containsKey("run"));
        assertTrue(e.getErrores().containsKey("nombre"));
        assertTrue(e.getErrores().containsKey("correo"));
        assertTrue(e.getErrores().containsKey("clave"));
        verifyNoInteractions(repositorio);
    }

    @Test
    @DisplayName("una solicitud sin cuerpo responde 400")
    void registroSinCuerpo() {
        assertThrows(ValidacionException.class, () -> servicio.registrar(null));
    }

    // ---------------------------------------------------------------- alta por administrador

    @Test
    @DisplayName("un administrador puede crear un usuario con cualquier rol")
    void adminCreaConRol() {
        when(repositorio.existsById(RUN)).thenReturn(false);
        when(repositorio.existsByCorreoIgnoreCase(CORREO)).thenReturn(false);
        guardarDevuelveElMismo();

        UsuarioRespuesta r = servicio.crear(solicitud(RUN, "1234", "Vendedor"));

        assertEquals("Vendedor", r.tipoUsuario());
    }

    @Test
    @DisplayName("un administrador no puede crear un usuario con un rol inventado")
    void adminCreaConRolInvalido() {
        ValidacionException e = assertThrows(ValidacionException.class,
                () -> servicio.crear(solicitud(RUN, "1234", "Superusuario")));

        assertTrue(e.getErrores().containsKey("tipoUsuario"));
    }

    // ---------------------------------------------------------------- lectura

    @Test
    @DisplayName("listar devuelve todos los usuarios sin exponer la clave")
    void listar() {
        when(repositorio.findAll(any(Sort.class))).thenReturn(List.of(existente));

        List<UsuarioRespuesta> lista = servicio.listar();

        assertEquals(1, lista.size());
        assertEquals(RUN, lista.get(0).run());
    }

    @Test
    @DisplayName("obtener un usuario inexistente responde 404 (acepta el RUN con puntos y guion)")
    void obtenerInexistente() {
        when(repositorio.findById(RUN)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> servicio.obtener("20.555.899-3"));
    }

    // ---------------------------------------------------------------- edición por administrador

    @Test
    @DisplayName("actualizar cambia datos y rol, y conserva la clave si no se envía una nueva")
    void actualizarConservaLaClave() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();
        UsuarioSolicitud cambios = new UsuarioSolicitud(null, "Javiera Paz", "Contreras Lara", CORREO, null,
                LocalDate.of(2000, 6, 25), "Vendedor", "Región de la Araucanía", "Temuco", null, null, null);

        UsuarioRespuesta r = servicio.actualizar(RUN, cambios, "190110222");

        assertEquals("Javiera Paz", r.nombre());
        assertEquals("Vendedor", r.tipoUsuario());
        assertEquals(hashOriginal, existente.getClaveHash());
    }

    @Test
    @DisplayName("actualizar con una clave nueva la guarda con BCrypt")
    void actualizarConClaveNueva() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();

        servicio.actualizar(RUN, solicitud(null, "abcd", "Cliente"), "190110222");

        assertTrue(codificador.matches("abcd", existente.getClaveHash()));
    }

    @Test
    @DisplayName("actualizar rechaza un correo que ya usa OTRO usuario")
    void actualizarCorreoDeOtro() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        when(repositorio.existsByCorreoIgnoreCaseAndRunNot(CORREO, RUN)).thenReturn(true);

        assertThrows(ConflictoException.class, () -> servicio.actualizar(RUN, solicitud(null, null, "Cliente"), "190110222"));
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("un administrador no puede desactivarse a sí mismo editando su propia ficha")
    void actualizarseDesactivarse() {
        existente.setTipoUsuario(TipoUsuario.Administrador);
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        UsuarioSolicitud s = new UsuarioSolicitud(null, "Javiera", "Contreras Lara", CORREO, null,
                LocalDate.of(2000, 6, 25), "Administrador", "R", "C", null, null, false);

        assertThrows(ConflictoException.class, () -> servicio.actualizar(RUN, s, RUN));
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("actualizar con activo=false desactiva al usuario y cierra su sesión")
    void actualizarDesactivaYCierraSesion() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();
        UsuarioSolicitud s = new UsuarioSolicitud(null, "Javiera", "Contreras Lara", CORREO, null,
                LocalDate.of(2000, 6, 25), "Cliente", "R", "C", null, null, false);

        servicio.actualizar(RUN, s, "190110222");

        assertFalse(existente.isActivo());
        assertNull(existente.getRefreshJti());
    }

    @Test
    @DisplayName("actualizar un usuario inexistente responde 404")
    void actualizarInexistente() {
        when(repositorio.findById(RUN)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class,
                () -> servicio.actualizar(RUN, solicitud(null, null, "Cliente"), "190110222"));
    }

    // ---------------------------------------------------------------- borrado lógico

    @Test
    @DisplayName("desactivar marca activo=false y cierra la sesión (no borra la fila)")
    void desactivar() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();

        servicio.desactivar(RUN, "190110222");

        assertFalse(existente.isActivo());
        assertNull(existente.getRefreshJti());
        verify(repositorio).save(existente);
        verify(repositorio, never()).delete(any());
        verify(repositorio, never()).deleteById(any());
    }

    @Test
    @DisplayName("un administrador no puede desactivarse a sí mismo")
    void desactivarseASiMismo() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));

        ConflictoException e = assertThrows(ConflictoException.class, () -> servicio.desactivar(RUN, RUN));

        assertEquals("No puedes desactivar tu propia cuenta.", e.getMessage());
        assertTrue(existente.isActivo());
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("desactivar un usuario inexistente responde 404")
    void desactivarInexistente() {
        when(repositorio.findById(RUN)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> servicio.desactivar(RUN, "190110222"));
    }

    // ---------------------------------------------------------------- perfil propio

    @Test
    @DisplayName("el perfil propio NUNCA cambia RUN, rol, estado ni clave, aunque el cliente los envíe")
    void perfilIgnoraRolEstadoYClave() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();
        UsuarioSolicitud intento = new UsuarioSolicitud("999999999", "Javiera Nueva", "Contreras Lara", CORREO,
                "hackeada", LocalDate.of(2000, 6, 25), "Administrador", "Región de la Araucanía", "Temuco", null,
                null, false);

        UsuarioRespuesta r = servicio.actualizarPerfil(RUN, intento);

        assertEquals("Javiera Nueva", r.nombre());
        assertEquals(RUN, existente.getRun());
        assertEquals(TipoUsuario.Cliente, existente.getTipoUsuario());
        assertTrue(existente.isActivo());
        assertEquals(hashOriginal, existente.getClaveHash());
    }

    @Test
    @DisplayName("el perfil de un usuario desactivado o inexistente responde 401 (la sesión ya no es válida)")
    void perfilDeUsuarioInactivo() {
        existente.setActivo(false);
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));

        assertThrows(TokenInvalidoException.class, () -> servicio.perfil(RUN));
    }

    // ---------------------------------------------------------------- cambio de clave

    @Test
    @DisplayName("cambiar la clave con la actual correcta guarda el hash BCrypt de la nueva")
    void cambiarClave() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));
        guardarDevuelveElMismo();

        servicio.cambiarClave(RUN, new CambioClaveSolicitud("1234", "nueva1"));

        assertTrue(codificador.matches("nueva1", existente.getClaveHash()));
        assertFalse(codificador.matches("1234", existente.getClaveHash()));
    }

    @Test
    @DisplayName("cambiar la clave con una actual incorrecta responde 400 y no guarda nada")
    void cambiarClaveActualIncorrecta() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));

        ValidacionException e = assertThrows(ValidacionException.class,
                () -> servicio.cambiarClave(RUN, new CambioClaveSolicitud("9999", "nueva1")));

        assertEquals("La contraseña actual es incorrecta.", e.getErrores().get("claveActual"));
        verify(repositorio, never()).save(any());
    }

    @Test
    @DisplayName("la clave nueva debe tener entre 4 y 10 caracteres")
    void cambiarClaveNuevaInvalida() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));

        ValidacionException e = assertThrows(ValidacionException.class,
                () -> servicio.cambiarClave(RUN, new CambioClaveSolicitud("1234", "123")));

        assertEquals("La contraseña debe tener entre 4 y 10 caracteres.", e.getErrores().get("claveNueva"));
        assertEquals(1, e.getErrores().size());
    }

    @Test
    @DisplayName("si fallan la clave actual y la nueva se informan ambos errores")
    void cambiarClaveAmbosErrores() {
        when(repositorio.findById(RUN)).thenReturn(Optional.of(existente));

        ValidacionException e = assertThrows(ValidacionException.class,
                () -> servicio.cambiarClave(RUN, new CambioClaveSolicitud(null, null)));

        assertTrue(e.getErrores().containsKey("claveActual"));
        assertTrue(e.getErrores().containsKey("claveNueva"));
    }
}
