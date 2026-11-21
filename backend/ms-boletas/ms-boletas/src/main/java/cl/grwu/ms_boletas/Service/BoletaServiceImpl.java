package cl.grwu.ms_boletas.Service;

import cl.grwu.ms_boletas.DTO.BoletaResponse;
import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.DTO.ProductoDTO;
import cl.grwu.ms_boletas.Entity.Boleta;
import cl.grwu.ms_boletas.Entity.DetalleBoleta;
import cl.grwu.ms_boletas.Repository.BoletaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BoletaServiceImpl implements BoletaService {

    private final BoletaRepository boletaRepository;
    private final RestTemplate restTemplate;

    @Value("${servicios.catalogo.url}")
    private String urlCatalogo;

    @Value("${pasarela.probabilidad-rechazo:0.10}")
    private double probabilidadRechazo;

    @Value("${pasarela.limite-monto:100000}")
    private int limiteMonto;

    public BoletaServiceImpl(BoletaRepository boletaRepository, RestTemplate restTemplate) {
        this.boletaRepository = boletaRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public BoletaResponse crearBoleta(CrearBoletaRequest request, String usuarioRun) {
        Boleta boleta = new Boleta();
        
        // 1. Generar ID y número correlativo
        Optional<Boleta> ultimaBoleta = boletaRepository.findTopByOrderByNumeroDesc();
        long nuevoNumero = ultimaBoleta.map(b -> b.getNumero() + 1).orElse(20260001L);
        
        boleta.setId("ORD-" + nuevoNumero);
        boleta.setNumero(nuevoNumero);
        boleta.setFecha(Instant.now());
        boleta.setUsuarioRun(usuarioRun);
        
        // 2. Datos del cliente y dirección
        boleta.setClienteNombre(request.getCliente().getNombre());
        boleta.setClienteApellidos(request.getCliente().getApellidos());
        boleta.setClienteCorreo(request.getCliente().getCorreo());
        boleta.setDireccionCalle(request.getDireccion().getCalle());
        boleta.setDireccionDepartamento(request.getDireccion().getDepartamento());
        boleta.setDireccionIndicaciones(request.getDireccion().getIndicaciones());
        boleta.setDireccionRegion(request.getDireccion().getRegion());
        boleta.setDireccionComuna(request.getDireccion().getComuna());
        
        boleta.setDespacho(request.getDespacho());
        boleta.setMetodoPago(request.getMetodoPago());

        // 3. Calcular totales consultando a ms-catalogo
        int subtotal = 0;
        List<DetalleBoleta> detalles = new ArrayList<>();

        for (CrearBoletaRequest.ItemRequest itemReq : request.getItems()) {
            // Llamada a ms-catalogo (Matías)
            String urlProducto = urlCatalogo + "/productos/" + itemReq.getProductoId();
            ResponseEntity<ProductoDTO> response = restTemplate.getForEntity(urlProducto, ProductoDTO.class);
            ProductoDTO producto = response.getBody();

            if (producto == null) {
                throw new RuntimeException("Producto no encontrado: " + itemReq.getProductoId());
            }

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            int subtotalLinea = producto.getPrecio() * itemReq.getCantidad();
            subtotal += subtotalLinea;

            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setProductoId(producto.getId());
            detalle.setNombreProducto(producto.getNombre());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setImagen(producto.getImagen());
            detalle.setCategoria(producto.getCategoriaSlug());
            detalle.setCantidad(itemReq.getCantidad());
            detalle.setSubtotalLinea(subtotalLinea);
            
            detalles.add(detalle);
            boleta.agregarItem(detalle);
        }

        boleta.setSubtotal(subtotal);
        
        // 4. Calcular envío
        int envio = 0;
        if (request.getDespacho().equals("premium")) {
            envio = 5990;
        } else if (subtotal < 44990) {
            envio = 3990;
        }
        boleta.setEnvio(envio);
        boleta.setTotal(subtotal + envio);

        // 5. Simular pasarela de pago
        boolean pagoAprobado = simularPago(boleta.getTotal(), request.getMetodoPago());
        
        if (pagoAprobado) {
            boleta.setEstado("pagada");
            // Aquí deberías llamar a ms-catalogo para descontar stock
            // (Lo dejamos comentado hasta que Matías tenga listo el endpoint de stock)
            // descontarStock(detalles);
        } else {
            boleta.setEstado("rechazada");
            boleta.setMotivoRechazo("Pago rechazado por la pasarela simulada.");
        }

        // 6. Guardar en la base de datos
        boletaRepository.save(boleta);

        return mapearAResponse(boleta);
    }

    private boolean simularPago(int total, String metodoPago) {
        if (!List.of("credito", "debito", "transferencia").contains(metodoPago)) return false;
        if (total <= 0) return false;
        if (total > limiteMonto) return false;
        return new Random().nextDouble() >= probabilidadRechazo;
    }

    private BoletaResponse mapearAResponse(Boleta boleta) {
        BoletaResponse res = new BoletaResponse();
        res.setId(boleta.getId());
        res.setNumero(boleta.getNumero());
        res.setFecha(boleta.getFecha());
        res.setUsuarioRun(boleta.getUsuarioRun());
        res.setSubtotal(boleta.getSubtotal());
        res.setEnvio(boleta.getEnvio());
        res.setTotal(boleta.getTotal());
        res.setEstado(boleta.getEstado());
        res.setMotivoRechazo(boleta.getMotivoRechazo());
        
        List<BoletaResponse.DetalleResponse> detallesRes = new ArrayList<>();
        for (DetalleBoleta d : boleta.getItems()) {
            BoletaResponse.DetalleResponse dr = new BoletaResponse.DetalleResponse();
            dr.setProductoId(d.getProductoId());
            dr.setNombre(d.getNombreProducto());
            dr.setPrecioUnitario(d.getPrecioUnitario());
            dr.setCantidad(d.getCantidad());
            dr.setSubtotal(d.getSubtotalLinea());
            detallesRes.add(dr);
        }
        res.setItems(detallesRes);
        return res;
    }

    @Override
    public List<Boleta> listarBoletas() {
        return boletaRepository.findAll();
    }

    @Override
    public Boleta obtenerBoleta(String id) {
        return boletaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Boleta no encontrada"));
    }

    @Override
    public List<Boleta> obtenerBoletasPorUsuario(String usuarioRun) {
        return boletaRepository.findByUsuarioRunOrderByFechaDesc(usuarioRun);
    }

    @Override
    public BoletaResponse reintentarPago(String id, String usuarioRun) {
        Boleta boleta = obtenerBoleta(id);
        if (!boleta.getEstado().equals("rechazada")) {
            throw new RuntimeException("Solo se pueden reintentar boletas rechazadas");
        }
        
        boolean pagoAprobado = simularPago(boleta.getTotal(), boleta.getMetodoPago());
        if (pagoAprobado) {
            boleta.setEstado("pagada");
            boleta.setMotivoRechazo(null);
            // descontarStock(boleta.getItems());
        } else {
            boleta.setMotivoRechazo("Pago rechazado en el reintento.");
        }
        
        boletaRepository.save(boleta);
        return mapearAResponse(boleta);
    }
}
