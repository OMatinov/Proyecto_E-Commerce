package cl.grwu.catalogo.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

/**
 * Guarda la lista de imagenes adicionales como un arreglo JSON en la columna
 * TEXT imagenes (AGENTS.md, seccion 7.8). El frontend sigue viendo un array.
 */
@Converter
public class ListaImagenesConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> TIPO_LISTA = new TypeReference<>() {
    };

    @Override
    public String convertToDatabaseColumn(List<String> imagenes) {
        if (imagenes == null || imagenes.isEmpty()) {
            return "[]";
        }
        try {
            return MAPPER.writeValueAsString(imagenes);
        } catch (Exception e) {
            throw new IllegalArgumentException("No se pudieron serializar las imagenes del producto", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String columna) {
        if (columna == null || columna.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return MAPPER.readValue(columna, TIPO_LISTA);
        } catch (Exception e) {
            throw new IllegalArgumentException("No se pudieron leer las imagenes del producto", e);
        }
    }
}
