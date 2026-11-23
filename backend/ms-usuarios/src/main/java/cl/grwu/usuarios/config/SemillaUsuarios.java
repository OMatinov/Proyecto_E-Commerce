package cl.grwu.usuarios.config;

import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.model.Usuario;
import cl.grwu.usuarios.repository.UsuarioRepository;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Datos iniciales: los 6 usuarios de la EV2 (mismos RUN, correos y roles que usuariosData.js).
 * Solo se cargan si la tabla está vacía. Las contraseñas se guardan con BCrypt: NO hay hashes escritos a mano
 * en el código, se generan aquí al arrancar. Todas las cuentas de prueba usan la clave 1234.
 */
@Component
public class SemillaUsuarios implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(SemillaUsuarios.class);
    private static final String CLAVE_DE_PRUEBA = "1234";

    private final UsuarioRepository repositorio;
    private final PasswordEncoder codificador;

    public SemillaUsuarios(UsuarioRepository repositorio, PasswordEncoder codificador) {
        this.repositorio = repositorio;
        this.codificador = codificador;
    }

    @Override
    public void run(String... args) {
        if (repositorio.count() > 0) {
            return;
        }
        crear("190110222", "Camila", "Olmedo Pérez", "camila.olmedo@duoc.cl", "1998-04-12", TipoUsuario.Administrador,
                "Región Metropolitana de Santiago", "Santiago", "Av. Libertador Bernardo O'Higgins 1234", "+56 9 1234 5678");
        crear("172076920", "Matías", "Fuentes Rivas", "matias.fuentes@duoc.cl", "1999-09-03", TipoUsuario.Vendedor,
                "Región de Valparaíso", "Viña del Mar", "Calle Álvarez 456", "+56 9 8765 4321");
        crear("888888888", "César", "Muñoz Díaz", "cesar.munoz@gmail.com", "1997-01-20", TipoUsuario.Vendedor,
                "Región del Biobío", "Concepción", "Los Carrera 789", "+56 9 5555 1122");
        crear("111111111", "Katerine", "Soto Vega", "katerine.soto@profesor.duoc.cl", "1995-11-08",
                TipoUsuario.Administrador, "Región Metropolitana de Santiago", "Providencia",
                "Av. 11 de Septiembre 2100", "+56 9 4444 3322");
        crear("205558993", "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "2000-06-25",
                TipoUsuario.Cliente, "Región de la Araucanía", "Temuco", "Manuel Montt 321", "+56 9 3333 7788");
        crear("137954567", "Ignacio", "Reyes Salinas", "ignacio.reyes@gmail.com", "2001-02-14", TipoUsuario.Cliente,
                "Región del Maule", "Talca", "1 Sur 654", "+56 9 2222 9900");
        LOG.info("Semilla: se crearon 6 usuarios de prueba (clave {}).", CLAVE_DE_PRUEBA);
    }

    private void crear(String run, String nombre, String apellidos, String correo, String nacimiento,
                       TipoUsuario tipo, String region, String comuna, String direccion, String telefono) {
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre(nombre);
        u.setApellidos(apellidos);
        u.setCorreo(correo);
        u.setClaveHash(codificador.encode(CLAVE_DE_PRUEBA));
        u.setFechaNacimiento(LocalDate.parse(nacimiento));
        u.setTipoUsuario(tipo);
        u.setRegion(region);
        u.setComuna(comuna);
        u.setDireccion(direccion);
        u.setTelefono(telefono);
        u.setActivo(true);
        repositorio.save(u);
    }
}
