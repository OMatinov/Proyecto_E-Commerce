package cl.grwu.usuarios.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** Pruebas de las reglas de negocio de validación (RUN, correo, clave y teléfono). */
class ValidacionesTest {

    // ---------- RUN ----------

    @ParameterizedTest(name = "RUN válido: {0}")
    @ValueSource(strings = {
            "190110222", "172076920", "888888888", "111111111", "205558993", "137954567", // los 6 de la semilla
            "1000005K",      // dígito verificador K
            "10000130",      // dígito verificador 0
            "19.011.022-2",  // con puntos y guion: se limpian antes de validar
            "1000005k"       // k minúscula
    })
    @DisplayName("acepta RUN con dígito verificador correcto")
    void runValido(String run) {
        assertTrue(Validaciones.validarRun(run).valido(), run);
    }

    @Test
    @DisplayName("rechaza un RUN con dígito verificador incorrecto")
    void runDigitoIncorrecto() {
        ResultadoValidacion r = Validaciones.validarRun("190110223");
        assertFalse(r.valido());
        assertEquals("El RUN ingresado no es válido (dígito verificador incorrecto).", r.mensaje());
    }

    @ParameterizedTest(name = "largo inválido: \"{0}\"")
    @ValueSource(strings = {"123456", "1234567890"})
    @DisplayName("rechaza un RUN con menos de 7 o más de 9 caracteres")
    void runLargoInvalido(String run) {
        ResultadoValidacion r = Validaciones.validarRun(run);
        assertFalse(r.valido());
        assertEquals("El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.", r.mensaje());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("el RUN es obligatorio")
    void runObligatorio(String run) {
        assertEquals("El RUN es obligatorio.", Validaciones.validarRun(run).mensaje());
    }

    @Test
    @DisplayName("la K solo se acepta como dígito verificador")
    void runKEnElCuerpo() {
        assertFalse(Validaciones.validarRun("1K000005").valido());
    }

    @Test
    @DisplayName("limpiarRun quita puntos y guion y pasa a mayúscula")
    void limpiarRun() {
        assertEquals("1000005K", Validaciones.limpiarRun("1.000.005-k"));
        assertEquals("", Validaciones.limpiarRun(null));
    }

    // ---------- Correo ----------

    @ParameterizedTest(name = "correo válido: {0}")
    @ValueSource(strings = {"camila.olmedo@duoc.cl", "katerine.soto@profesor.duoc.cl", "javiera@gmail.com",
            "  espacios@gmail.com  ", "MAYUS@GMAIL.COM"})
    @DisplayName("acepta los tres dominios permitidos (sin distinguir mayúsculas)")
    void correoValido(String correo) {
        assertTrue(Validaciones.validarCorreo(correo).valido(), correo);
    }

    @ParameterizedTest(name = "correo inválido: {0}")
    @ValueSource(strings = {"alguien@hotmail.com", "alguien@duoc.com", "sin-arroba.gmail.com", "@gmail.com"})
    @DisplayName("rechaza dominios no permitidos o formato inválido")
    void correoInvalido(String correo) {
        ResultadoValidacion r = Validaciones.validarCorreo(correo);
        assertFalse(r.valido());
        assertEquals("Solo se aceptan correos válidos de @duoc.cl, @profesor.duoc.cl o @gmail.com.", r.mensaje());
    }

    @Test
    @DisplayName("rechaza un correo de más de 100 caracteres")
    void correoMuyLargo() {
        String largo = "a".repeat(100) + "@gmail.com";
        ResultadoValidacion r = Validaciones.validarCorreo(largo);
        assertFalse(r.valido());
        assertEquals("El correo no puede superar los 100 caracteres.", r.mensaje());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    @DisplayName("el correo es obligatorio")
    void correoObligatorio(String correo) {
        assertEquals("El correo es obligatorio.", Validaciones.validarCorreo(correo).mensaje());
    }

    // ---------- Contraseña ----------

    @ParameterizedTest(name = "clave válida de {0} caracteres")
    @ValueSource(strings = {"1234", "abcdefghij"})
    @DisplayName("acepta contraseñas de 4 a 10 caracteres (límites incluidos)")
    void claveValida(String clave) {
        assertTrue(Validaciones.validarClave(clave).valido());
    }

    @ParameterizedTest(name = "clave inválida: \"{0}\"")
    @ValueSource(strings = {"123", "abcdefghijk"})
    @DisplayName("rechaza contraseñas de menos de 4 o más de 10 caracteres")
    void claveLargoInvalido(String clave) {
        assertEquals("La contraseña debe tener entre 4 y 10 caracteres.", Validaciones.validarClave(clave).mensaje());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("la contraseña es obligatoria")
    void claveObligatoria(String clave) {
        assertEquals("La contraseña es obligatoria.", Validaciones.validarClave(clave).mensaje());
    }

    // ---------- Teléfono ----------

    @ParameterizedTest(name = "teléfono válido: {0}")
    @ValueSource(strings = {"+56 9 1234 5678", "912345678", "9 1234-5678"})
    @DisplayName("acepta teléfonos con +, dígitos, espacios o guiones")
    void telefonoValido(String telefono) {
        assertTrue(Validaciones.validarTelefono(telefono).valido(), telefono);
    }

    @ParameterizedTest(name = "teléfono inválido: {0}")
    @ValueSource(strings = {"abc", "12345", "+56 9 1234 56789012345"})
    @DisplayName("rechaza teléfonos con letras o largo fuera de rango")
    void telefonoInvalido(String telefono) {
        assertEquals("Ingresa un teléfono válido, ej: +56 9 1234 5678.", Validaciones.validarTelefono(telefono).mensaje());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("el teléfono es obligatorio")
    void telefonoObligatorio(String telefono) {
        assertEquals("El teléfono es obligatorio.", Validaciones.validarTelefono(telefono).mensaje());
    }
}
