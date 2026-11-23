package cl.grwu.usuarios.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

/**
 * Prueba el mapeo de la entidad Usuario y las consultas del repositorio contra una base H2 en memoria
 * (no necesita MySQL). Si la entidad tuviera un error de mapeo, estas pruebas fallarían al levantar el contexto.
 */
@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository repositorio;

    private Usuario nuevo(String run, String correo) {
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre("Javiera");
        u.setApellidos("Contreras Lara");
        u.setCorreo(correo);
        u.setClaveHash("$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234"); // 60 caracteres
        u.setFechaNacimiento(LocalDate.of(2000, 6, 25));
        u.setTipoUsuario(TipoUsuario.Cliente);
        return u;
    }

    @Test
    @DisplayName("guarda un usuario y lo encuentra por correo sin distinguir mayúsculas")
    void buscaPorCorreoIgnorandoMayusculas() {
        repositorio.save(nuevo("205558993", "javiera.contreras@gmail.com"));

        Usuario encontrado = repositorio.findByCorreoIgnoreCase("JAVIERA.Contreras@Gmail.com").orElseThrow();

        assertEquals("205558993", encontrado.getRun());
        assertEquals(TipoUsuario.Cliente, encontrado.getTipoUsuario());
    }

    @Test
    @DisplayName("un usuario nuevo queda activo y sin refresh token")
    void valoresPorDefecto() {
        Usuario guardado = repositorio.saveAndFlush(nuevo("137954567", "ignacio.reyes@gmail.com"));

        assertTrue(guardado.isActivo());
        assertNull(guardado.getRefreshJti());
    }

    @Test
    @DisplayName("existsByCorreo detecta duplicados, pero el propio usuario puede conservar su correo")
    void detectaCorreoDuplicado() {
        repositorio.save(nuevo("205558993", "javiera.contreras@gmail.com"));

        assertTrue(repositorio.existsByCorreoIgnoreCase("JAVIERA.CONTRERAS@gmail.com"));
        // Edición del mismo usuario: su propio correo NO cuenta como duplicado.
        assertFalse(repositorio.existsByCorreoIgnoreCaseAndRunNot("javiera.contreras@gmail.com", "205558993"));
        // Otro usuario intentando usar ese correo: SÍ es duplicado.
        assertTrue(repositorio.existsByCorreoIgnoreCaseAndRunNot("javiera.contreras@gmail.com", "137954567"));
    }
}
