package cl.grwu.catalogo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/**
 * ms-catalogo: productos y categorias del e-commerce GRWU.
 * Se excluye UserDetailsServiceAutoConfiguration porque la autenticacion es
 * solo con JWT: no hay usuarios en memoria ni formulario de login.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class MsCatalogoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsCatalogoApplication.class, args);
	}

}
