package cl.grwu.catalogo.controller;

import cl.grwu.catalogo.config.OpenApiConfig;
import cl.grwu.catalogo.dto.CategoriaRequest;
import cl.grwu.catalogo.dto.CategoriaResponse;
import cl.grwu.catalogo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Categorias del catalogo (contrato 8.5).
 * GET es publico; POST/PUT/DELETE exigen rol Administrador.
 */
@RestController
@RequestMapping("/api/v1/categorias")
@Tag(name = "Categorias", description = "Categorias de genero y de prenda")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Lista todas las categorias")
    @ApiResponse(responseCode = "200", description = "Lista de categorias")
    public List<CategoriaResponse> listar() {
        return categoriaService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene una categoria por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoria inexistente")
    })
    public CategoriaResponse obtenerPorId(@PathVariable String id) {
        return categoriaService.obtenerPorId(id);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Obtiene una categoria por slug")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoria inexistente")
    })
    public CategoriaResponse obtenerPorSlug(@PathVariable String slug) {
        return categoriaService.obtenerPorSlug(slug);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Crea una categoria", description = "Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria creada"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "409", description = "Slug duplicado"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public CategoriaResponse crear(@Valid @RequestBody CategoriaRequest request) {
        return categoriaService.crear(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Actualiza una categoria", description = "Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "404", description = "Categoria inexistente"),
            @ApiResponse(responseCode = "409", description = "Slug duplicado"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public CategoriaResponse actualizar(@PathVariable String id,
                                        @Valid @RequestBody CategoriaRequest request) {
        return categoriaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = OpenApiConfig.ESQUEMA_BEARER)
    @Operation(summary = "Elimina una categoria",
            description = "Solo si no tiene productos; si tiene, responde 409. Solo Administrador")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoria eliminada"),
            @ApiResponse(responseCode = "404", description = "Categoria inexistente"),
            @ApiResponse(responseCode = "409", description = "La categoria tiene productos"),
            @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    })
    public void eliminar(@PathVariable String id) {
        categoriaService.eliminar(id);
    }
}
