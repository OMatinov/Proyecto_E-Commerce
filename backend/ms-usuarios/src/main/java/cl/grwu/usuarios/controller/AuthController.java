package cl.grwu.usuarios.controller;

import cl.grwu.usuarios.dto.LoginSolicitud;
import cl.grwu.usuarios.dto.RefreshSolicitud;
import cl.grwu.usuarios.dto.RespuestaLogin;
import cl.grwu.usuarios.dto.UsuarioRespuesta;
import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Autenticación (sección 8.3): login, registro y refresh son públicos; logout exige token. */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Login con JWT, registro, refresh y logout")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Inicia sesión y devuelve access token, refresh token y el usuario")
    public RespuestaLogin login(@RequestBody LoginSolicitud solicitud) {
        return authService.login(solicitud);
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registra un usuario nuevo; el rol siempre es Cliente")
    public UsuarioRespuesta registro(@RequestBody UsuarioSolicitud solicitud) {
        return authService.registrar(solicitud);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Entrega tokens nuevos a cambio de un refresh token vigente (rota el refresh)")
    public RespuestaLogin refresh(@RequestBody RefreshSolicitud solicitud) {
        return authService.refrescar(solicitud);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cierra la sesión: invalida el refresh token del usuario autenticado")
    public void logout(Authentication autenticacion) {
        authService.cerrarSesion(autenticacion.getName());
    }
}
