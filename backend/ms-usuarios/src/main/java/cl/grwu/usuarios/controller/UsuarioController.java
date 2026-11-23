package cl.grwu.usuarios.controller;

import cl.grwu.usuarios.dto.CambioClaveSolicitud;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Usuarios (sección 8.4). Las rutas de administración exigen rol Administrador; /me y /me/clave son para
 * cualquier usuario autenticado. El RUN del solicitante sale SIEMPRE del token (nunca de lo que envíe el cliente).
 */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Administración de usuarios y perfil propio")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private static final String SOLO_ADMIN = "hasRole('ADMINISTRADOR')";

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ---------- Perfil propio (cualquier usuario autenticado) ----------
    // Estas rutas literales tienen prioridad sobre "/{run}".

    @GetMapping("/me")
    @Operation(summary = "Perfil del usuario autenticado")
    public UsuarioRespuesta perfil(Authentication autenticacion) {
        return usuarioService.perfil(autenticacion.getName());
    }

    @PutMapping("/me")
    @Operation(summary = "Actualiza el perfil propio (nunca cambia el rol)")
    public UsuarioRespuesta actualizarPerfil(Authentication autenticacion, @RequestBody UsuarioSolicitud solicitud) {
        return usuarioService.actualizarPerfil(autenticacion.getName(), solicitud);
    }

    @PutMapping("/me/clave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cambia la contraseña propia (exige la contraseña actual)")
    public void cambiarClave(Authentication autenticacion, @RequestBody CambioClaveSolicitud solicitud) {
        usuarioService.cambiarClave(autenticacion.getName(), solicitud);
    }

    // ---------- Administración (solo Administrador) ----------

    @GetMapping
    @PreAuthorize(SOLO_ADMIN)
    @Operation(summary = "Lista todos los usuarios")
    public List<UsuarioRespuesta> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{run}")
    @PreAuthorize(SOLO_ADMIN)
    @Operation(summary = "Detalle de un usuario por RUN")
    public UsuarioRespuesta obtener(@PathVariable String run) {
        return usuarioService.obtener(run);
    }

    @PostMapping
    @PreAuthorize(SOLO_ADMIN)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crea un usuario con cualquier rol")
    public UsuarioRespuesta crear(@RequestBody UsuarioSolicitud solicitud) {
        return usuarioService.crear(solicitud);
    }

    @PutMapping("/{run}")
    @PreAuthorize(SOLO_ADMIN)
    @Operation(summary = "Actualiza datos y rol de un usuario; la clave es opcional")
    public UsuarioRespuesta actualizar(@PathVariable String run, @RequestBody UsuarioSolicitud solicitud,
                                       Authentication autenticacion) {
        return usuarioService.actualizar(run, solicitud, autenticacion.getName());
    }

    @DeleteMapping("/{run}")
    @PreAuthorize(SOLO_ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Borrado lógico (activo = false); no puede desactivarse a sí mismo")
    public void desactivar(@PathVariable String run, Authentication autenticacion) {
        usuarioService.desactivar(run, autenticacion.getName());
    }
}
