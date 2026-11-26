package cl.grwu.boletas;

import cl.grwu.boletas.repository.BoletaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Smoke test del contexto. Excluye JPA para que las pruebas corran sin MySQL,
 * ya que la lógica de negocio se cubre con mocks en BoletaServiceTest.
 */
@SpringBootTest(properties = {
        "spring.autoconfigure.exclude="
                + "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
                + "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
                + "org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration",
        "jwt.secret=clave-de-prueba-con-al-menos-32-caracteres",
        "SERVICE_KEY=clave-de-servicio-de-prueba"
})
class MsBoletasApplicationTests {

    @MockitoBean
    private BoletaRepository boletaRepository;

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        assertNotNull(applicationContext.getBean(MsBoletasApplication.class));
    }
}
