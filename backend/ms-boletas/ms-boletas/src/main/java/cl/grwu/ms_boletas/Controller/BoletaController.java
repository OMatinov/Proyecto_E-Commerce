package cl.grwu.ms_boletas.Controller;

import cl.grwu.ms_boletas.DTO.BoletaResponse;
import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.Entity.Boleta;
import cl.grwu.ms_boletas.Service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boletas")
@Tag(name = "Boletas", description = "Endpoints para la gestión de boletas y compras")
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    // 1. Crear una boleta (Solo Clientes)
    @PostMapping
    @Operation(summary = "Crear una nueva boleta", description = "Recibe los productos del carrito y procesa el pago simulado")
    public ResponseEntity<BoletaResponse> crearBoleta(@Valid @RequestBody CrearBoletaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName(); 

        BoletaResponse response = boletaService.crearBoleta(request, usuarioRun);
        // Si la pasarela rechazó el pago, devolvemos 201 igual (porque la boleta se creó como "rechazada")
        // El frontend leerá el campo "estado" para saber si mostrar la pantalla de error.
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. Listar todas las boletas (Admin y Vendedor)
    @GetMapping
    @Operation(summary = "Listar todas las boletas", description = "Solo accesible para Administradores y Vendedores")
    public ResponseEntity<List<Boleta>> listarBoletas() {
        return ResponseEntity.ok(boletaService.listarBoletas());
    }

    // 3. Ver mis boletas (Cliente)
    @GetMapping("/mias")
    @Operation(summary = "Ver mis boletas", description = "Devuelve el historial de compras del usuario autenticado")
    public ResponseEntity<List<Boleta>> obtenerMisBoletas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.obtenerBoletasPorUsuario(usuarioRun));
    }

    // 4. Ver detalle de una boleta (Admin, Vendedor o Cliente dueño)
    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una boleta")
    public ResponseEntity<Boleta> obtenerBoleta(@PathVariable String id) {
        return ResponseEntity.ok(boletaService.obtenerBoleta(id));
    }

    // 5. Reintentar pago (Solo Cliente dueño)
    @PostMapping("/{id}/reintentar-pago")
    @Operation(summary = "Reintentar el pago de una boleta rechazada")
    public ResponseEntity<BoletaResponse> reintentarPago(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioRun = auth.getName();
        return ResponseEntity.ok(boletaService.reintentarPago(id, usuarioRun));
    }
}