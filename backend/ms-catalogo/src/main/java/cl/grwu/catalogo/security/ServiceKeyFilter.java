package cl.grwu.catalogo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Protege el endpoint interno de stock (PATCH /api/v1/productos/{id}/stock),
 * que solo consume ms-boletas y que no viaja con JWT de usuario.
 * Exige el header X-Service-Key con el secreto compartido (SERVICE_KEY) y deja
 * la request autenticada como ROLE_INTERNO.
 */
@Component
public class ServiceKeyFilter extends OncePerRequestFilter {

    private static final Pattern RUTA_STOCK = Pattern.compile("^/api/v1/productos/[^/]+/stock$");
    private static final String CABECERA = "X-Service-Key";

    private final byte[] claveEsperada;
    private final SecurityErrorWriter errorWriter;

    public ServiceKeyFilter(@Value("${grwu.service-key}") String claveEsperada,
                            SecurityErrorWriter errorWriter) {
        this.claveEsperada = claveEsperada.getBytes(StandardCharsets.UTF_8);
        this.errorWriter = errorWriter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        boolean esEndpointStock = "PATCH".equalsIgnoreCase(request.getMethod())
                && RUTA_STOCK.matcher(request.getRequestURI()).matches();

        if (!esEndpointStock) {
            filterChain.doFilter(request, response);
            return;
        }

        String claveRecibida = request.getHeader(CABECERA);

        if (claveRecibida == null || !coincide(claveRecibida)) {
            errorWriter.escribir(request, response, HttpStatus.UNAUTHORIZED,
                    "Clave de servicio invalida");
            return;
        }

        UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
                "ms-boletas",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_INTERNO"))
        );
        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        filterChain.doFilter(request, response);
    }

    /** Comparacion en tiempo constante para no filtrar la clave por diferencias de tiempo. */
    private boolean coincide(String claveRecibida) {
        return MessageDigest.isEqual(claveRecibida.getBytes(StandardCharsets.UTF_8), claveEsperada);
    }
}
