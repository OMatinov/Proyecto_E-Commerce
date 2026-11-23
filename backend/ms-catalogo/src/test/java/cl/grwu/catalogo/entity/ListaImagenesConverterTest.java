package cl.grwu.catalogo.entity;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ListaImagenesConverterTest {

    private final ListaImagenesConverter converter = new ListaImagenesConverter();

    @Test
    void listaConImagenesSeGuardaComoArregloJson() {
        String columna = converter.convertToDatabaseColumn(List.of("img/a.png", "img/b.png"));

        assertEquals("[\"img/a.png\",\"img/b.png\"]", columna);
    }

    @Test
    void listaVaciaSeGuardaComoArregloVacio() {
        assertEquals("[]", converter.convertToDatabaseColumn(List.of()));
        assertEquals("[]", converter.convertToDatabaseColumn(null));
    }

    @Test
    void arregloJsonSeLeeComoLista() {
        List<String> imagenes = converter.convertToEntityAttribute("[\"img/a.png\",\"img/b.png\"]");

        assertEquals(List.of("img/a.png", "img/b.png"), imagenes);
    }

    @Test
    void columnaVaciaONullDevuelveListaVacia() {
        assertTrue(converter.convertToEntityAttribute(null).isEmpty());
        assertTrue(converter.convertToEntityAttribute("").isEmpty());
        assertTrue(converter.convertToEntityAttribute("   ").isEmpty());
    }

    @Test
    void jsonInvalidoFallaConMensajeClaro() {
        assertThrows(IllegalArgumentException.class,
                () -> converter.convertToEntityAttribute("esto no es json"));
    }
}
