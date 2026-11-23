package cl.grwu.usuarios.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.model.TipoUsuario;
import cl.grwu.usuarios.validation.ValidadorUsuario.Modo;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

/** Pruebas de las reglas de validación de usuarios por modo (registro, creación, edición y perfil). */
class ValidadorUsuarioTest {

    private UsuarioSolicitud valida() {
        return new UsuarioSolicitud("205558993", "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", "Manuel Montt 321",
                "+56 9 3333 7788", null);
    }

    private UsuarioSolicitud con(String run, String nombre, String apellidos, String correo, String clave,
                                 LocalDate fecha, String tipo, String region, String comuna, String direccion,
                                 String telefono) {
        return new UsuarioSolicitud(run, nombre, apellidos, correo, clave, fecha, tipo, region, comuna, direccion,
                telefono, null);
    }

    @ParameterizedTest
    @ValueSource(strings = {"REGISTRO", "CREACION", "EDICION", "PERFIL"})
    @DisplayName("unos datos correctos no generan errores en ningún modo")
    void datosCorrectos(String modo) {
        assertTrue(ValidadorUsuario.validar(valida(), Modo.valueOf(modo)).isEmpty());
    }

    @Test
    @DisplayName("en el registro valida RUN, correo y clave, y reporta cada uno en su campo")
    void registroReportaPorCampo() {
        UsuarioSolicitud s = con("190110223", "Javiera", "Contreras Lara", "alguien@hotmail.com", "123",
                LocalDate.of(2000, 6, 25), null, "Región de la Araucanía", "Temuco", null, null);

        Map<String, String> errores = ValidadorUsuario.validar(s, Modo.REGISTRO);

        assertEquals("El RUN ingresado no es válido (dígito verificador incorrecto).", errores.get("run"));
        assertEquals("Solo se aceptan correos válidos de @duoc.cl, @profesor.duoc.cl o @gmail.com.",
                errores.get("correo"));
        assertEquals("La contraseña debe tener entre 4 y 10 caracteres.", errores.get("clave"));
        assertEquals(3, errores.size());
    }

    @Test
    @DisplayName("en el registro el rol se ignora (no es obligatorio ni se valida)")
    void registroIgnoraElRol() {
        UsuarioSolicitud s = con("205558993", "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "RolInventado", "Región de la Araucanía", "Temuco", null, null);

        assertTrue(ValidadorUsuario.validar(s, Modo.REGISTRO).isEmpty());
    }

    @Test
    @DisplayName("la creación por un administrador exige un rol válido")
    void creacionExigeRol() {
        UsuarioSolicitud s = con("205558993", "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "Superusuario", "Región de la Araucanía", "Temuco", null, null);

        assertEquals("El tipo de usuario debe ser Administrador, Vendedor o Cliente.",
                ValidadorUsuario.validar(s, Modo.CREACION).get("tipoUsuario"));
    }

    @Test
    @DisplayName("en la edición la clave es opcional, pero si viene debe ser válida")
    void edicionClaveOpcional() {
        UsuarioSolicitud sinClave = con(null, "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", null,
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", null, null);
        UsuarioSolicitud claveCorta = con(null, "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "12",
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", null, null);
        UsuarioSolicitud claveVacia = con(null, "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", "",
                LocalDate.of(2000, 6, 25), "Cliente", "Región de la Araucanía", "Temuco", null, null);

        assertTrue(ValidadorUsuario.validar(sinClave, Modo.EDICION).isEmpty());
        assertTrue(ValidadorUsuario.validar(claveVacia, Modo.EDICION).isEmpty());
        assertTrue(ValidadorUsuario.validar(claveCorta, Modo.EDICION).containsKey("clave"));
    }

    @Test
    @DisplayName("el perfil propio no exige RUN, clave ni rol")
    void perfilNoExigeRunClaveNiRol() {
        UsuarioSolicitud s = con(null, "Javiera", "Contreras Lara", "javiera.contreras@gmail.com", null,
                LocalDate.of(2000, 6, 25), null, "Región de la Araucanía", "Temuco", null, null);

        assertTrue(ValidadorUsuario.validar(s, Modo.PERFIL).isEmpty());
    }

    @Test
    @DisplayName("nombre y apellidos son obligatorios y respetan el largo de la tabla (60 y 80)")
    void nombreYApellidos() {
        UsuarioSolicitud vacios = con("205558993", "  ", null, "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "Cliente", "R", "C", null, null);
        UsuarioSolicitud largos = con("205558993", "a".repeat(61), "b".repeat(81), "javiera.contreras@gmail.com",
                "1234", LocalDate.of(2000, 6, 25), "Cliente", "R", "C", null, null);
        UsuarioSolicitud enElLimite = con("205558993", "a".repeat(60), "b".repeat(80), "javiera.contreras@gmail.com",
                "1234", LocalDate.of(2000, 6, 25), "Cliente", "R", "C", null, null);

        Map<String, String> e1 = ValidadorUsuario.validar(vacios, Modo.CREACION);
        assertEquals("El nombre es obligatorio.", e1.get("nombre"));
        assertEquals("Los apellidos son obligatorios.", e1.get("apellidos"));

        Map<String, String> e2 = ValidadorUsuario.validar(largos, Modo.CREACION);
        assertEquals("El nombre no puede superar los 60 caracteres.", e2.get("nombre"));
        assertEquals("Los apellidos no pueden superar los 80 caracteres.", e2.get("apellidos"));

        assertTrue(ValidadorUsuario.validar(enElLimite, Modo.CREACION).isEmpty());
    }

    @Test
    @DisplayName("la fecha de nacimiento es obligatoria, no puede ser futura ni anterior a 1900")
    void fechaDeNacimiento() {
        UsuarioSolicitud sinFecha = con("205558993", "J", "C", "javiera.contreras@gmail.com", "1234", null,
                "Cliente", "R", "C", null, null);
        UsuarioSolicitud futura = con("205558993", "J", "C", "javiera.contreras@gmail.com", "1234",
                LocalDate.now().plusDays(1), "Cliente", "R", "C", null, null);
        UsuarioSolicitud antigua = con("205558993", "J", "C", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(1899, 12, 31), "Cliente", "R", "C", null, null);

        assertEquals("La fecha de nacimiento es obligatoria.",
                ValidadorUsuario.validar(sinFecha, Modo.CREACION).get("fechaNacimiento"));
        assertEquals("La fecha de nacimiento no puede ser futura.",
                ValidadorUsuario.validar(futura, Modo.CREACION).get("fechaNacimiento"));
        assertEquals("La fecha de nacimiento no es válida.",
                ValidadorUsuario.validar(antigua, Modo.CREACION).get("fechaNacimiento"));
    }

    @Test
    @DisplayName("región y comuna son obligatorias; dirección y teléfono son opcionales")
    void regionComunaObligatorias() {
        UsuarioSolicitud s = con("205558993", "J", "C", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "Cliente", null, " ", null, null);

        Map<String, String> errores = ValidadorUsuario.validar(s, Modo.CREACION);

        assertEquals("Selecciona una región.", errores.get("region"));
        assertEquals("Selecciona una comuna.", errores.get("comuna"));
        assertFalse(errores.containsKey("direccion"));
        assertFalse(errores.containsKey("telefono"));
    }

    @Test
    @DisplayName("si se escribe un teléfono debe tener formato válido")
    void telefonoSiSeEscribe() {
        UsuarioSolicitud mal = con("205558993", "J", "C", "javiera.contreras@gmail.com", "1234",
                LocalDate.of(2000, 6, 25), "Cliente", "R", "C", null, "abc");

        assertEquals("Ingresa un teléfono válido, ej: +56 9 1234 5678.",
                ValidadorUsuario.validar(mal, Modo.CREACION).get("telefono"));
    }

    @Test
    @DisplayName("parseTipo acepta solo los tres roles exactos")
    void parseTipo() {
        assertEquals(TipoUsuario.Administrador, ValidadorUsuario.parseTipo("Administrador").orElseThrow());
        assertEquals(TipoUsuario.Cliente, ValidadorUsuario.parseTipo(" Cliente ").orElseThrow());
        assertTrue(ValidadorUsuario.parseTipo("administrador").isEmpty());
        assertTrue(ValidadorUsuario.parseTipo(null).isEmpty());
        assertTrue(ValidadorUsuario.parseTipo("").isEmpty());
    }
}
