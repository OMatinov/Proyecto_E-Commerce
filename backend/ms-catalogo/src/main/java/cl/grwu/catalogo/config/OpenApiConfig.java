package cl.grwu.catalogo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracion de Swagger/OpenAPI.
 * Declara el esquema bearerAuth para que Swagger UI permita pegar el access
 * token y probar los endpoints protegidos (AGENTS.md, seccion 4.7).
 */
@Configuration
public class OpenApiConfig {

    public static final String ESQUEMA_BEARER = "bearerAuth";

    @Bean
    public OpenAPI grwuOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("GRWU - ms-catalogo")
                        .version("v1")
                        .description("""
                                Microservicio de catalogo del e-commerce GRWU: productos y categorias.
                                Los GET son publicos. Las escrituras exigen rol Administrador.
                                El PATCH de stock es interno y se autentica con el header X-Service-Key.
                                """))
                .components(new Components().addSecuritySchemes(ESQUEMA_BEARER,
                        new SecurityScheme()
                                .name(ESQUEMA_BEARER)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
