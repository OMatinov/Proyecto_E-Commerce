package cl.grwu.catalogo.controller;

import cl.grwu.catalogo.config.OpenApiConfig;
import cl.grwu.catalogo.dto.ProductoRequest;
import cl.grwu.catalogo.dto.ProductoResponse;
import cl.grwu.catalogo.dto.StockRequest;
import cl.grwu.catalogo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Catalogo de productos (contrato 8.5).
 * GET es publico; POST/PUT/DELETE exigen rol Administrador; el PATCH de stock
 * es interno y se autentica con X-Service-Key.
 */
@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos", description = "Catalogo de productos de GRWU")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    @Operation(summary = "Lista productos activos",
            description = "Todos los filtros son opcionales y se pueden combinar.")
    @ApiResponse(responseCode = "200", description = "Lista de productos activos")
    public List<ProductoResponse> listar(
            @Parameter(description = "Slug de la categoria, ej. polerones")
            @RequestParam(required = false) String categoria,

            @Parameter(description = "hombre, mujer o unisex")
            @RequestParam(required = false) String genero,

            @Parameter(description = "true = solo con oferta; false = solo sin oferta")
            @RequestParam(required = false) Boolean oferta,

            @Parameter(description = "Texto a buscar en el nombre")
            @RequestParam(name = "q", required = false) String texto,

            @Parameter(description = "true = solo productos con stock bajo el umbral")
            @RequestParam(required = false) Boolean criticos,

            @Parameter(description = "Umbral de stock critico; por defecto 5")
            @RequestParam(required = false) Integer umbral) {

        return productoService.listar(categoria, genero, oferta, texto, criticos, umbral);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene un producto activo por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto inexistente o inactivo")
    })
    public ProductoResponse obtener(@PathVariable String id) {
        return productoService.obtener(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Crea un producto", description = "Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "404", description = "Categoria inexistente"),
            @ApiResponse(responseCode = "401", description = "Sin token"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public ProductoResponse crear(@Valid @RequestBody ProductoRequest request) {
        return productoService.crear(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Actualiza un producto", description = "Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "404", description = "Producto o categoria inexistente"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public ProductoResponse actualizar(@PathVariable String id,
                                       @Valid @RequestBody ProductoRequest request) {
        return productoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Desactiva un producto",
            description = "Borrado logico: activo = false. Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto desactivado"),
            @ApiResponse(responseCode = "404", description = "Producto inexistente o inactivo"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public void eliminar(@PathVariable String id) {
        productoService.eliminar(id);
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('INTERNO')")
    @Operation(summary = "Ajusta el stock (interno)",
            description = "Solo para ms-boletas. Requiere el header X-Service-Key; no usa JWT de usuario.")
    @Parameter(name = "X-Service-Key", in = ParameterIn.HEADER, required = true,
            description = "Secreto compartido entre ms-boletas y ms-catalogo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock actualizado"),
            @ApiResponse(responseCode = "401", description = "X-Service-Key ausente o invalida"),
            @ApiResponse(responseCode = "404", description = "Producto inexistente o inactivo"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente para descontar")
    })
    public ProductoResponse ajustarStock(@PathVariable String id,
                                         @Valid @RequestBody StockRequest request) {
        return productoService.ajustarStock(id, request);
    }
}
