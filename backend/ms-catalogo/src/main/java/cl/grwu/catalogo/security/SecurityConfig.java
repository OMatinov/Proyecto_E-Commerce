package cl.grwu.catalogo.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Seguridad de ms-catalogo.
 * - Sin sesion: cada request se autentica con el JWT (stateless).
 * - GET de productos y categorias es publico (la tienda se navega sin cuenta).
 * - POST/PUT/DELETE exige Administrador (la matriz de roles se refuerza con
 *   @PreAuthorize en los controladores).
 * - El PATCH de stock es solo para ms-boletas, via X-Service-Key.
 * - 401 y 403 siempre responden el JSON de error de la API.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] RUTAS_SWAGGER_Y_ERROR = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/error"
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ServiceKeyFilter serviceKeyFilter;
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;
    private final String origenesPermitidos;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          ServiceKeyFilter serviceKeyFilter,
                          RestAuthenticationEntryPoint authenticationEntryPoint,
                          RestAccessDeniedHandler accessDeniedHandler,
                          @Value("${grwu.cors.allowed-origins:http://localhost:5173}") String origenesPermitidos) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.serviceKeyFilter = serviceKeyFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.origenesPermitidos = origenesPermitidos;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(manejo -> manejo
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(autorizacion -> autorizacion
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(RUTAS_SWAGGER_Y_ERROR).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/productos/**", "/api/v1/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/productos/*/stock").hasRole("INTERNO")
                        .requestMatchers("/api/v1/productos/**", "/api/v1/categorias/**").hasRole("ADMINISTRADOR")
                        .anyRequest().authenticated())
                .addFilterBefore(serviceKeyFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Los filtros son @Component y Spring Boot los registraria tambien como
     * filtros de servlet, fuera de la cadena de seguridad. Se desactiva ese
     * registro: deben ejecutarse solo en el orden definido en securityFilterChain.
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> registroJwtAuthenticationFilter(
            JwtAuthenticationFilter filtro) {
        FilterRegistrationBean<JwtAuthenticationFilter> registro = new FilterRegistrationBean<>(filtro);
        registro.setEnabled(false);
        return registro;
    }

    @Bean
    public FilterRegistrationBean<ServiceKeyFilter> registroServiceKeyFilter(ServiceKeyFilter filtro) {
        FilterRegistrationBean<ServiceKeyFilter> registro = new FilterRegistrationBean<>(filtro);
        registro.setEnabled(false);
        return registro;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuracion = new CorsConfiguration();
        configuracion.setAllowedOrigins(Arrays.stream(origenesPermitidos.split(","))
                .map(String::trim)
                .filter(origen -> !origen.isEmpty())
                .toList());
        configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuracion.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Service-Key"));
        configuracion.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource fuente = new UrlBasedCorsConfigurationSource();
        fuente.registerCorsConfiguration("/**", configuracion);
        return fuente;
    }
}
