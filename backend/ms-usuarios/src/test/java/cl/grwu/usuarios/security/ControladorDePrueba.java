package cl.grwu.usuarios.security;

import org.springframework.boot.test.context.TestComponent;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controlador SOLO de pruebas: imita las tres situaciones de la matriz de roles (ruta pública, ruta autenticada
 * y ruta solo de Administrador) para probar la cadena de seguridad sin depender de los controladores reales.
 *
 * - @Controller: desde Spring 6 es obligatorio para que Spring MVC reconozca la clase como controlador.
 * - @TestComponent: hace que el escaneo de componentes de otras pruebas NO la registre (así no choca con los
 *   controladores reales); SeguridadWebTest la incorpora explícitamente con @Import.
 */
@Controller
@TestComponent
@ResponseBody
public class ControladorDePrueba {

    @PostMapping("/api/v1/auth/login")
    public String login() {
        return "publico";
    }

    @GetMapping("/api/v1/usuarios/me")
    public String me(Authentication autenticacion) {
        return autenticacion.getName();
    }

    @GetMapping("/api/v1/usuarios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public String soloAdministrador() {
        return "lista";
    }
}
