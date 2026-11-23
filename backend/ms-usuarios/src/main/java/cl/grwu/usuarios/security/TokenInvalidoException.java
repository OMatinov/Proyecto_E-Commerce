package cl.grwu.usuarios.security;

/** El token no sirve: está vacío, mal formado, con firma falsa, de otro emisor o expiró. */
public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException(String mensaje) {
        super(mensaje);
    }

    public TokenInvalidoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
