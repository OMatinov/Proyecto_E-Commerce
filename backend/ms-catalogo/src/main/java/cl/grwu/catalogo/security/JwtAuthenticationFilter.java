package cl.grwu.catalogo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

/**
 * Lee el header Authorization, valida el JWT y deja al usuario autenticado en
 * el SecurityContext con la autoridad ROLE_&lt;ROL&gt;.
 * Si el token falta o es invalido NO lanza excepcion: deja la request sin
 * autenticar y el SecurityConfig responde 401 con RestAuthenticationEntryPoint.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String PREFIJO_BEARER = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Si otro filtro ya autentico (por ejemplo el X-Service-Key del stock),
        // no se sobrescribe la autenticacion.
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (header == null || !header.startsWith(PREFIJO_BEARER)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(PREFIJO_BEARER.length()).trim();

        try {
            Claims claims = jwtService.validarYExtraerClaims(token);
            String rol = claims.get("rol", String.class);

            if (rol == null || rol.isBlank()) {
                throw new IllegalArgumentException("El token no trae el claim rol");
            }

            // "Administrador" -> ROLE_ADMINISTRADOR (los roles del JSON no llevan prefijo)
            SimpleGrantedAuthority autoridad = new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase(Locale.ROOT));

            UsernamePasswordAuthenticationToken autenticacion =
                    new UsernamePasswordAuthenticationToken(claims.getSubject(), null, List.of(autoridad));
            autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(autenticacion);
        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
            log.debug("Token JWT rechazado: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
