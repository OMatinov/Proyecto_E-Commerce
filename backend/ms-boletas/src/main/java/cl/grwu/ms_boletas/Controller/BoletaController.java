package cl.grwu.ms_boletas.Controller;

import cl.grwu.ms_boletas.DTO.BoletaResponse;
import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.Service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
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
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crear una nueva boleta", description = "Recibe los productos del carrito y procesa el pago simulado")
    public ResponseEntity<BoletaResponse> crearBoleta(@Valid @RequestBody CrearBoletaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        BoletaResponse response = boletaService.crearBoleta(request, usuarioRun);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar boletas", description = "Solo Administradores y Vendedores. Filtro opcional: usuarioRun")
    public ResponseEntity<List<BoletaResponse>> listarBoletas(@RequestParam(required = false) String usuarioRun) {
        if (usuarioRun != null && !usuarioRun.isBlank()) {
            return ResponseEntity.ok(boletaService.obtenerBoletasPorUsuarioResponse(usuarioRun.trim()));
        }
        // Nota: Para que esto devuelva DTOs, tu BoletaService.listarBoletas() debería devolver List<BoletaResponse>.
        // Como el Service devuelve entidades, necesitamos una forma de mapearlas. 
        // La forma correcta es crear un método 'obtenerTodasResponse()' en el Service.
        // Por ahora, lo dejamos con el método existente asumiendo que lo actualizaremos en el siguiente paso.
        return ResponseEntity.ok(boletaService.listarBoletasResponse());
    }

    @GetMapping("/mias")
    @Operation(summary = "Ver mis boletas", description = "Devuelve el historial de compras del usuario autenticado")
    public ResponseEntity<List<BoletaResponse>> obtenerMisBoletas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.obtenerBoletasPorUsuarioResponse(usuarioRun));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una boleta")
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
    @Operation(summary = "Reintentar el pago de una boleta rechazada")
    public ResponseEntity<BoletaResponse> reintentarPago(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.reintentarPago(id, usuarioRun));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Cambiar el estado de una boleta")
    public ResponseEntity<BoletaResponse> cambiarEstado(@PathVariable String id,
                                                        @RequestBody Map<String, String> cuerpo) {
        return ResponseEntity.ok(boletaService.cambiarEstado(id, cuerpo.get("estado")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Cancelar una boleta")
    public ResponseEntity<Void> cancelarBoleta(@PathVariable String id) {
        boletaService.cancelarBoleta(id);
        return ResponseEntity.noContent().build();
    }
}