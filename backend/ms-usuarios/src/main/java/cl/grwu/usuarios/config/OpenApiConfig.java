package cl.grwu.usuarios.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Metadatos de Swagger y esquema "bearerAuth": permite pegar el accessToken en el botón
 * "Authorize" de Swagger UI y probar los endpoints protegidos.
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "GRWU - API de Usuarios y Autenticación",
        version = "v1",
        description = "Registro, login con JWT (access + refresh), perfil y administración de usuarios. "
                + "Roles: Administrador, Vendedor y Cliente."))
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class OpenApiConfig {
}
