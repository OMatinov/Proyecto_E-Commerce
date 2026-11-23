package cl.grwu.usuarios.validation;

import cl.grwu.usuarios.dto.UsuarioSolicitud;
import cl.grwu.usuarios.model.TipoUsuario;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Valida los datos de un usuario y devuelve los errores POR CAMPO ({} si todo está bien), listos para el JSON de
 * error (campo "errores"). Repite las reglas del frontend (utils/formularios.js) con los largos máximos de la tabla.
 *
 * Los largos máximos siguen la base de datos (sección 7.2): nombre 60, apellidos 80. OJO: el formulario del frontend
 * permite apellidos de hasta 100, así que hay que alinearlo a 80.
 */
public final class ValidadorUsuario {

    /** Qué operación se está validando: define qué campos son obligatorios. */
    public enum Modo {
        /** Registro público: RUN y clave obligatorios; el rol se ignora (siempre Cliente). */
        REGISTRO,
        /** Alta por un administrador: RUN, clave y rol obligatorios. */
        CREACION,
        /** Edición por un administrador: rol obligatorio; la clave es opcional (vacía = conservar la actual). */
        EDICION,
        /** Edición del perfil propio: solo datos personales y de contacto. */
        PERFIL
    }

    public static final int NOMBRE_MAX = 60;
    public static final int APELLIDOS_MAX = 80;
    public static final int REGION_MAX = 80;
    public static final int COMUNA_MAX = 80;
    public static final int DIRECCION_MAX = 150;
    private static final LocalDate FECHA_MINIMA = LocalDate.of(1900, 1, 1);

    private ValidadorUsuario() {
    }

    /** Convierte el texto en rol. Exacto (sin distinguir mayúsculas NO): "Administrador", "Vendedor" o "Cliente". */
    public static Optional<TipoUsuario> parseTipo(String valor) {
        if (valor == null) {
            return Optional.empty();
        }
        return Arrays.stream(TipoUsuario.values()).filter(t -> t.name().equals(valor.trim())).findFirst();
    }

    public static Map<String, String> validar(UsuarioSolicitud s, Modo modo) {
        Map<String, String> errores = new LinkedHashMap<>();

        if (modo == Modo.REGISTRO || modo == Modo.CREACION) {
            ResultadoValidacion run = Validaciones.validarRun(s.run());
            if (!run.valido()) {
                errores.put("run", run.mensaje());
            }
        }

        if (esVacio(s.nombre())) {
            errores.put("nombre", "El nombre es obligatorio.");
        } else if (s.nombre().length() > NOMBRE_MAX) {
            errores.put("nombre", "El nombre no puede superar los " + NOMBRE_MAX + " caracteres.");
        }

        if (esVacio(s.apellidos())) {
            errores.put("apellidos", "Los apellidos son obligatorios.");
        } else if (s.apellidos().length() > APELLIDOS_MAX) {
            errores.put("apellidos", "Los apellidos no pueden superar los " + APELLIDOS_MAX + " caracteres.");
        }

        ResultadoValidacion correo = Validaciones.validarCorreo(s.correo());
        if (!correo.valido()) {
            errores.put("correo", correo.mensaje());
        }

        if (modo == Modo.REGISTRO || modo == Modo.CREACION) {
            ResultadoValidacion clave = Validaciones.validarClave(s.clave());
            if (!clave.valido()) {
                errores.put("clave", clave.mensaje());
            }
        } else if (modo == Modo.EDICION && s.clave() != null && !s.clave().isEmpty()) {
            ResultadoValidacion clave = Validaciones.validarClave(s.clave());
            if (!clave.valido()) {
                errores.put("clave", clave.mensaje());
            }
        }

        LocalDate fecha = s.fechaNacimiento();
        if (fecha == null) {
            errores.put("fechaNacimiento", "La fecha de nacimiento es obligatoria.");
        } else if (fecha.isAfter(LocalDate.now())) {
            errores.put("fechaNacimiento", "La fecha de nacimiento no puede ser futura.");
        } else if (fecha.isBefore(FECHA_MINIMA)) {
            errores.put("fechaNacimiento", "La fecha de nacimiento no es válida.");
        }

        if (modo == Modo.CREACION || modo == Modo.EDICION) {
            if (parseTipo(s.tipoUsuario()).isEmpty()) {
                errores.put("tipoUsuario", "El tipo de usuario debe ser Administrador, Vendedor o Cliente.");
            }
        }

        if (esVacio(s.region())) {
            errores.put("region", "Selecciona una región.");
        } else if (s.region().length() > REGION_MAX) {
            errores.put("region", "La región no puede superar los " + REGION_MAX + " caracteres.");
        }

        if (esVacio(s.comuna())) {
            errores.put("comuna", "Selecciona una comuna.");
        } else if (s.comuna().length() > COMUNA_MAX) {
            errores.put("comuna", "La comuna no puede superar los " + COMUNA_MAX + " caracteres.");
        }

        if (s.direccion() != null && s.direccion().length() > DIRECCION_MAX) {
            errores.put("direccion", "La dirección no puede superar los " + DIRECCION_MAX + " caracteres.");
        }

        // El teléfono es opcional, pero si se escribe debe tener formato válido.
        if (!esVacio(s.telefono())) {
            ResultadoValidacion telefono = Validaciones.validarTelefono(s.telefono());
            if (!telefono.valido()) {
                errores.put("telefono", telefono.mensaje());
            }
        }

        return errores;
    }

    private static boolean esVacio(String texto) {
        return texto == null || texto.isBlank();
    }
}
