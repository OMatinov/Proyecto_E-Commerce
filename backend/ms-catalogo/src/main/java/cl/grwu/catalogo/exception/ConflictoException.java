package cl.grwu.catalogo.exception;

/**
 * Conflicto de negocio: slug duplicado, categoria con productos o stock
 * insuficiente. El manejador global la traduce a 409 (AGENTS.md, seccion 4.6).
 */
public class ConflictoException extends RuntimeException {

    public ConflictoException(String mensaje) {
        super(mensaje);
    }
}
