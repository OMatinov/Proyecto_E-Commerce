package cl.grwu.catalogo.support;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * ObjectMapper equivalente al de Spring Boot para los tests de seguridad:
 * serializa Instant como ISO-8601 y no como arreglo de numeros.
 */
public final class JsonTestSupport {

    private JsonTestSupport() {
    }

    public static ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
    }
}
