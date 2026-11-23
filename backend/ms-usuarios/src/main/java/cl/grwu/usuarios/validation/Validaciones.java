package cl.grwu.usuarios.validation;

import java.util.regex.Pattern;

/**
 * Validaciones de negocio repetidas en el backend (decisión D9: el backend es la autoridad).
 * Son una copia fiel de grwu-react/src/utils/validaciones.js, con los mismos mensajes, para que
 * frontend y backend nunca discrepen. Clase de utilidad: sin estado, solo métodos estáticos.
 */
public final class Validaciones {

    public static final int CORREO_MAX = 100;
    public static final int CLAVE_MIN = 4;
    public static final int CLAVE_MAX = 10;

    private static final Pattern CORREO = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$", Pattern.CASE_INSENSITIVE);
    private static final Pattern TELEFONO = Pattern.compile("^[+\\d][\\d\\s-]{6,14}$");

    private Validaciones() {
        // No se instancia.
    }

    /** Deja solo dígitos y K, en mayúscula: "19.011.022-2" -> "190110222". */
    public static String limpiarRun(String run) {
        if (run == null) {
            return "";
        }
        return run.replaceAll("[^0-9kK]", "").toUpperCase();
    }

    /** RUN chileno: 7 a 9 caracteres, cuerpo numérico y dígito verificador correcto (módulo 11). */
    public static ResultadoValidacion validarRun(String runSucio) {
        if (runSucio == null || runSucio.isEmpty()) {
            return ResultadoValidacion.error("El RUN es obligatorio.");
        }
        String run = limpiarRun(runSucio);
        if (run.length() < 7 || run.length() > 9) {
            return ResultadoValidacion.error("El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
        }
        String cuerpo = run.substring(0, run.length() - 1);
        char dv = run.charAt(run.length() - 1);
        if (!cuerpo.matches("\\d+")) {
            return ResultadoValidacion.error("El RUN solo puede contener números (y K en el dígito verificador).");
        }
        // Módulo 11: se multiplica de derecha a izquierda por 2,3,4,5,6,7,2,3,... y se suma.
        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = (multiplicador == 7) ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = (resto == 11) ? '0' : (resto == 10) ? 'K' : (char) ('0' + resto);
        if (dv != esperado) {
            return ResultadoValidacion.error("El RUN ingresado no es válido (dígito verificador incorrecto).");
        }
        return ResultadoValidacion.ok();
    }

    /** Solo @duoc.cl, @profesor.duoc.cl o @gmail.com, máximo 100 caracteres. */
    public static ResultadoValidacion validarCorreo(String correo) {
        if (correo == null || correo.isBlank()) {
            return ResultadoValidacion.error("El correo es obligatorio.");
        }
        String limpio = correo.trim();
        if (limpio.length() > CORREO_MAX) {
            return ResultadoValidacion.error("El correo no puede superar los " + CORREO_MAX + " caracteres.");
        }
        if (!CORREO.matcher(limpio).matches()) {
            return ResultadoValidacion.error("Solo se aceptan correos válidos de @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        }
        return ResultadoValidacion.ok();
    }

    /** Contraseña de 4 a 10 caracteres. */
    public static ResultadoValidacion validarClave(String clave) {
        if (clave == null || clave.isEmpty()) {
            return ResultadoValidacion.error("La contraseña es obligatoria.");
        }
        if (clave.length() < CLAVE_MIN || clave.length() > CLAVE_MAX) {
            return ResultadoValidacion.error(
                    "La contraseña debe tener entre " + CLAVE_MIN + " y " + CLAVE_MAX + " caracteres.");
        }
        return ResultadoValidacion.ok();
    }

    /** Teléfono tipo "+56 9 1234 5678": parte con + o dígito y luego 6 a 14 dígitos, espacios o guiones. */
    public static ResultadoValidacion validarTelefono(String telefono) {
        String v = (telefono == null) ? "" : telefono.trim();
        if (v.isEmpty()) {
            return ResultadoValidacion.error("El teléfono es obligatorio.");
        }
        if (!TELEFONO.matcher(v).matches()) {
            return ResultadoValidacion.error("Ingresa un teléfono válido, ej: +56 9 1234 5678.");
        }
        return ResultadoValidacion.ok();
    }
}
