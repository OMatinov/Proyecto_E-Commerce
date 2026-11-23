package cl.grwu.usuarios.validation;

/** Resultado de una validación: igual que { valido, mensaje } del frontend (utils/validaciones.js). */
public record ResultadoValidacion(boolean valido, String mensaje) {

    public static ResultadoValidacion ok() {
        return new ResultadoValidacion(true, "");
    }

    public static ResultadoValidacion error(String mensaje) {
        return new ResultadoValidacion(false, mensaje);
    }
}
