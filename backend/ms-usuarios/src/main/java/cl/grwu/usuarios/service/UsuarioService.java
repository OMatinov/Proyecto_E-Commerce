package cl.grwu.usuarios.service;

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
import cl.grwu.usuarios.validation.ValidadorUsuario;
import cl.grwu.usuarios.validation.ValidadorUsuario.Modo;
import cl.grwu.usuarios.validation.Validaciones;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Reglas de negocio de los usuarios: registro, CRUD de administración y perfil propio.
 * El backend es la autoridad (D9): valida todo, fuerza el rol Cliente en el registro e ignora los datos que el
 * cliente no puede decidir (rol en el perfil, estado, hash de la clave).
 */
@Service
public class UsuarioService {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder codificador;

    public UsuarioService(UsuarioRepository repositorio, PasswordEncoder codificador) {
        this.repositorio = repositorio;
        this.codificador = codificador;
    }

    // ------------------------------------------------------------------ lectura (administrador)

    @Transactional(readOnly = true)
    public List<UsuarioRespuesta> listar() {
        return repositorio.findAll(Sort.by("run")).stream().map(UsuarioRespuesta::de).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioRespuesta obtener(String run) {
        return UsuarioRespuesta.de(buscar(run));
    }

    // ------------------------------------------------------------------ alta

    /** Registro público: el rol SIEMPRE es Cliente, aunque el cliente envíe otro. */
    @Transactional
    public UsuarioRespuesta registrar(UsuarioSolicitud solicitud) {
        return crearUsuario(solicitud, Modo.REGISTRO);
    }

    /** Alta por un administrador: puede elegir cualquier rol. */
    @Transactional
    public UsuarioRespuesta crear(UsuarioSolicitud solicitud) {
        return crearUsuario(solicitud, Modo.CREACION);
    }

    private UsuarioRespuesta crearUsuario(UsuarioSolicitud solicitud, Modo modo) {
        exigirDatosValidos(solicitud, modo);
        String run = Validaciones.limpiarRun(solicitud.run());
        String correo = solicitud.correo().trim();

        if (repositorio.existsById(run)) {
            throw new ConflictoException("Ya existe un usuario con ese RUN.",
                    Map.of("run", "Ya existe un usuario con ese RUN."));
        }
        if (repositorio.existsByCorreoIgnoreCase(correo)) {
            throw new ConflictoException("Ya existe un usuario con ese correo.",
                    Map.of("correo", "Ya existe un usuario con ese correo."));
        }

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        aplicarDatos(usuario, solicitud);
        usuario.setClaveHash(codificador.encode(solicitud.clave()));
        usuario.setTipoUsuario(modo == Modo.REGISTRO
                ? TipoUsuario.Cliente
                : ValidadorUsuario.parseTipo(solicitud.tipoUsuario()).orElseThrow());
        usuario.setActivo(true);
        return UsuarioRespuesta.de(repositorio.save(usuario));
    }

    // ------------------------------------------------------------------ edición (administrador)

    /** Actualiza datos y rol. La clave es opcional (vacía = se conserva la actual). */
    @Transactional
    public UsuarioRespuesta actualizar(String run, UsuarioSolicitud solicitud, String runSolicitante) {
        Usuario usuario = buscar(run);
        exigirDatosValidos(solicitud, Modo.EDICION);
        validarCorreoLibre(solicitud.correo().trim(), usuario.getRun());

        if (usuario.getRun().equals(runSolicitante) && Boolean.FALSE.equals(solicitud.activo())) {
            throw new ConflictoException("No puedes desactivar tu propia cuenta.");
        }

        aplicarDatos(usuario, solicitud);
        usuario.setTipoUsuario(ValidadorUsuario.parseTipo(solicitud.tipoUsuario()).orElseThrow());
        if (solicitud.clave() != null && !solicitud.clave().isEmpty()) {
            usuario.setClaveHash(codificador.encode(solicitud.clave()));
        }
        if (solicitud.activo() != null) {
            usuario.setActivo(solicitud.activo());
            if (!solicitud.activo()) {
                usuario.setRefreshJti(null);
            }
        }
        return UsuarioRespuesta.de(repositorio.save(usuario));
    }

    /** Borrado lógico: activo = false y se cierra su sesión. Un administrador no puede desactivarse a sí mismo. */
    @Transactional
    public void desactivar(String run, String runSolicitante) {
        Usuario usuario = buscar(run);
        if (usuario.getRun().equals(runSolicitante)) {
            throw new ConflictoException("No puedes desactivar tu propia cuenta.");
        }
        usuario.setActivo(false);
        usuario.setRefreshJti(null);
        repositorio.save(usuario);
    }

    // ------------------------------------------------------------------ perfil propio

    @Transactional(readOnly = true)
    public UsuarioRespuesta perfil(String run) {
        return UsuarioRespuesta.de(buscarActivo(run));
    }

    /** El perfil NUNCA cambia RUN, rol, estado ni clave: aunque el cliente los envíe, se ignoran. */
    @Transactional
    public UsuarioRespuesta actualizarPerfil(String run, UsuarioSolicitud solicitud) {
        Usuario usuario = buscarActivo(run);
        exigirDatosValidos(solicitud, Modo.PERFIL);
        validarCorreoLibre(solicitud.correo().trim(), usuario.getRun());
        aplicarDatos(usuario, solicitud);
        return UsuarioRespuesta.de(repositorio.save(usuario));
    }

    @Transactional
    public void cambiarClave(String run, CambioClaveSolicitud solicitud) {
        Usuario usuario = buscarActivo(run);
        Map<String, String> errores = new LinkedHashMap<>();

        String actual = solicitud == null ? null : solicitud.claveActual();
        String nueva = solicitud == null ? null : solicitud.claveNueva();

        if (actual == null || !codificador.matches(actual, usuario.getClaveHash())) {
            errores.put("claveActual", "La contraseña actual es incorrecta.");
        }
        var validacion = Validaciones.validarClave(nueva);
        if (!validacion.valido()) {
            errores.put("claveNueva", validacion.mensaje());
        }
        if (!errores.isEmpty()) {
            throw new ValidacionException(errores);
        }

        usuario.setClaveHash(codificador.encode(nueva));
        repositorio.save(usuario);
    }

    // ------------------------------------------------------------------ auxiliares

    private void exigirDatosValidos(UsuarioSolicitud solicitud, Modo modo) {
        if (solicitud == null) {
            throw new ValidacionException(Map.of("solicitud", "Debes enviar los datos del usuario."));
        }
        Map<String, String> errores = ValidadorUsuario.validar(solicitud, modo);
        if (!errores.isEmpty()) {
            throw new ValidacionException(errores);
        }
    }

    /** El correo no puede estar usado por OTRO usuario (el propio usuario sí puede conservarlo). */
    private void validarCorreoLibre(String correo, String runPropio) {
        if (repositorio.existsByCorreoIgnoreCaseAndRunNot(correo, runPropio)) {
            throw new ConflictoException("Ya existe un usuario con ese correo.",
                    Map.of("correo", "Ya existe un usuario con ese correo."));
        }
    }

    private void aplicarDatos(Usuario usuario, UsuarioSolicitud s) {
        usuario.setNombre(s.nombre().trim());
        usuario.setApellidos(s.apellidos().trim());
        usuario.setCorreo(s.correo().trim());
        usuario.setFechaNacimiento(s.fechaNacimiento());
        usuario.setRegion(s.region().trim());
        usuario.setComuna(s.comuna().trim());
        usuario.setDireccion(vacioANulo(s.direccion()));
        usuario.setTelefono(vacioANulo(s.telefono()));
    }

    private String vacioANulo(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }

    /** Busca por RUN (acepta puntos y guion en la URL). */
    private Usuario buscar(String run) {
        return repositorio.findById(Validaciones.limpiarRun(run))
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado."));
    }

    /** Para el perfil propio: si el usuario ya no existe o fue desactivado, la sesión deja de ser válida (401). */
    private Usuario buscarActivo(String run) {
        return repositorio.findById(run)
                .filter(Usuario::isActivo)
                .orElseThrow(() -> new TokenInvalidoException("La sesión ya no es válida."));
    }
}
