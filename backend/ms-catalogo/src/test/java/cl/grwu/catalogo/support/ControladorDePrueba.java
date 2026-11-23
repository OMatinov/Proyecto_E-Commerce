package cl.grwu.catalogo.support;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de prueba para @WebMvcTest: reproduce las rutas reales del
 * catalogo sin depender de la base de datos.
 */
@RestController
@RequestMapping("/api/v1")
public class ControladorDePrueba {

    @GetMapping("/productos")
    public String listar() {
        return "ok";
    }

    @PostMapping("/productos")
    public String crear() {
        return "creado";
    }

    @PatchMapping("/productos/{id}/stock")
    public String stock() {
        return "stock";
    }

    @GetMapping("/privado")
    public String privado() {
        return "privado";
    }
}
