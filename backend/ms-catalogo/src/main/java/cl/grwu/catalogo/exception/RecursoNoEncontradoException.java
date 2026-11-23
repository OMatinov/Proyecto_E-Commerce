package cl.grwu.catalogo.exception;

/**
 * Recurso inexistente o inactivo. El manejador global la traduce a 404.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
