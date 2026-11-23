package cl.grwu.boletas.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ProductoDTO {
    private String id;
    private String nombre;
    private Integer precio;
    private Integer stock;
    private String imagen;
    @JsonProperty("categoria")
    private String categoriaSlug; // Viene como "categoria" en el JSON de Matías
    
}