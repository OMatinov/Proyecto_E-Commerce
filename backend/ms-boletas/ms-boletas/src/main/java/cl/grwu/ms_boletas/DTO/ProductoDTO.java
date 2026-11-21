package cl.grwu.ms_boletas.DTO;

import lombok.Data;

@Data
public class ProductoDTO {
    private String id;
    private String nombre;
    private Integer precio;
    private Integer stock;
    private String imagen;
    private String categoriaSlug; // Viene como "categoria" en el JSON de Matías
}