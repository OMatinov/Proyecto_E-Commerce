package cl.grwu.catalogo.exception;

/**
 * Datos que pasan la validacion de formato pero no las reglas de negocio
 * (por ejemplo, oferta sin precio original coherente). Se traduce a 400.
 */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
