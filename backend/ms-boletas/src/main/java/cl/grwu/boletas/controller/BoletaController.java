package cl.grwu.boletas.controller;

import cl.grwu.boletas.dto.BoletaResponse;
import cl.grwu.boletas.dto.CrearBoletaRequest;
import cl.grwu.boletas.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/boletas")
@Tag(name = "Boletas", description = "Endpoints para la gestión de boletas y compras")
@ApiResponses({
        @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado"),
        @ApiResponse(responseCode = "403", description = "El rol del usuario no tiene permisos"),
        @ApiResponse(responseCode = "500", description = "Error no controlado")
})
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crear una nueva boleta",
            description = "Recibe el carrito, recalcula subtotal, envío y total en el backend y procesa la pasarela de pago **SIMULADA**. El pago se rechaza si el total supera $100.000 o por probabilidad configurable.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Boleta creada (pagada o rechazada)"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    })
    public ResponseEntity<BoletaResponse> crearBoleta(@Valid @RequestBody CrearBoletaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        BoletaResponse response = boletaService.crearBoleta(request, usuarioRun);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar boletas (Administrador o Vendedor)",
            description = "Filtros opcionales: estado, usuarioRun, desde y hasta (ISO-8601 UTC, sufijo Z).")
    @ApiResponse(responseCode = "200", description = "Listado de boletas")
    public ResponseEntity<List<BoletaResponse>> listarBoletas(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String usuarioRun,
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta) {
        return ResponseEntity.ok(boletaService.listarBoletasResponse(estado, usuarioRun, desde, hasta));
    }

    @GetMapping("/mias")
    @Operation(summary = "Ver mis boletas", description = "Historial de compras del usuario autenticado")
    @ApiResponse(responseCode = "200", description = "Historial del cliente")
    public ResponseEntity<List<BoletaResponse>> obtenerMisBoletas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.obtenerBoletasPorUsuarioResponse(usuarioRun));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una boleta",
            description = "Un Cliente solo puede ver sus propias boletas; Admin y Vendedor pueden ver cualquier boleta.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Detalle de la boleta"),
            @ApiResponse(responseCode = "403", description = "El Cliente no es dueño de la boleta"),
            @ApiResponse(responseCode = "404", description = "Boleta no encontrada")
    })
    public ResponseEntity<BoletaResponse> obtenerBoleta(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        boolean esCliente = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_CLIENTE".equals(a.getAuthority()));

        BoletaResponse boleta = esCliente
                ? boletaService.obtenerBoletaDelClienteResponse(id, usuarioRun)
                : boletaService.obtenerBoletaResponse(id);
        return ResponseEntity.ok(boleta);
    }

    @PostMapping("/{id}/reintentar-pago")
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Reintentar el pago de una boleta rechazada",
            description = "Revalida stock contra ms-catalogo y vuelve a llamar a la pasarela de pago **SIMULADA**. Descuenta stock solo si el pago es aprobado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reintento procesado"),
            @ApiResponse(responseCode = "403", description = "El Cliente no es dueño de la boleta"),
            @ApiResponse(responseCode = "409", description = "La boleta no es rechazada o no hay stock")
    })
    public ResponseEntity<BoletaResponse> reintentarPago(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.reintentarPago(id, usuarioRun));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Cambiar el estado de una boleta (Administrador)",
            description = "Transiciones válidas: pagada → enviada/cancelada, enviada → entregada, rechazada → cancelada.")
    @ApiResponse(responseCode = "409", description = "Transición de estado no permitida")
    public ResponseEntity<BoletaResponse> cambiarEstado(@PathVariable String id,
                                                        @RequestBody Map<String, String> cuerpo) {
        return ResponseEntity.ok(boletaService.cambiarEstado(id, cuerpo.get("estado")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Cancelar una boleta (Administrador)",
            description = "Cambia el estado a cancelada y repone el stock si la boleta estaba pagada.")
    @ApiResponse(responseCode = "409", description = "La boleta no puede cancelarse en su estado actual")
    public ResponseEntity<Void> cancelarBoleta(@PathVariable String id) {
        boletaService.cancelarBoleta(id);
        return ResponseEntity.noContent().build();
    }
}
