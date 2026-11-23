package cl.grwu.ms_boletas.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
             HttpServletRequest request,
             HttpServletResponse response,
             FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;

        // Si no hay token, dejamos pasar la petición (el SecurityConfig decidirá si la bloquea)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        
        try {
            // Solo se autentica con un access token válido; si no, la petición sigue sin autenticar
            // y el AuthenticationEntryPoint responde 401.
            if (jwtService.isTokenValid(jwt)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                String userRun = jwtService.extractUsername(jwt);
                String userRole = jwtService.extractRole(jwt);

                if (userRun != null && userRole != null) {
                    // Spring Security espera los roles con el prefijo ROLE_
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole.toUpperCase());

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userRun,
                            null,
                            List.of(authority)
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token ilegible: se ignora y la petición queda sin autenticar (401).
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
