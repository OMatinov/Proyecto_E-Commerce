package cl.grwu.usuarios.security;

import cl.grwu.usuarios.model.TipoUsuario;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Se ejecuta en cada request. Si trae "Authorization: Bearer <accessToken>" válido, identifica al usuario
 * (RUN) y su rol para el resto de la cadena. Si el token falta o no sirve, NO responde error aquí: deja la
 * request sin autenticar y es Spring Security quien responde 401 (si la ruta lo exige) o la deja pasar (rutas públicas).
 *
 * IMPORTANTE: esta clase NO es un @Component a propósito. Si fuera un bean, Spring Boot la registraría también como
 * filtro del servidor, antes de la cadena de seguridad, y la autenticación se perdería. Se crea con "new" en SecurityConfig.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain cadena)
            throws ServletException, IOException {
        String cabecera = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (cabecera != null && cabecera.startsWith(PREFIJO)) {
            try {
                Claims claims = jwtService.leerClaims(cabecera.substring(PREFIJO.length()).trim());
                // Solo los access token autentican: un refresh token NO sirve para llamar a la API.
                if (JwtService.TIPO_ACCESS.equals(claims.get("tipo", String.class))) {
                    TipoUsuario rol = TipoUsuario.valueOf(claims.get("rol", String.class));
                    UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
                            claims.getSubject(), null, List.of(new SimpleGrantedAuthority(rol.rolSpring())));
                    SecurityContextHolder.getContext().setAuthentication(autenticacion);
                }
            } catch (RuntimeException e) {
                // Cualquier problema con el token (firma, expiración, rol desconocido...) = no autenticado.
                SecurityContextHolder.clearContext();
            }
        }
        cadena.doFilter(request, response);
    }
}
