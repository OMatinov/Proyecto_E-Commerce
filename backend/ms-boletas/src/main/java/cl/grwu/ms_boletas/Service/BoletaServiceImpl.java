package cl.grwu.ms_boletas.Service;

import cl.grwu.ms_boletas.DTO.BoletaResponse;
import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.DTO.ProductoDTO;
import cl.grwu.ms_boletas.Entity.Boleta;
import cl.grwu.ms_boletas.Entity.DetalleBoleta;
import cl.grwu.ms_boletas.Repository.BoletaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

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

    @Value("${servicios.catalogo.service-key:}")
    private String serviceKey;

    public BoletaServiceImpl(BoletaRepository boletaRepository, RestTemplate restTemplate) {
        this.boletaRepository = boletaRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public BoletaResponse crearBoleta(CrearBoletaRequest request, String usuarioRun) {
        Boleta boleta = new Boleta();
        Optional<Boleta> ultimaBoleta = boletaRepository.findTopByOrderByNumeroDesc();
        long nuevoNumero = ultimaBoleta.map(b -> b.getNumero() + 1).orElse(20260001L);
        
        boleta.setId("ORD-" + nuevoNumero);
        boleta.setNumero(nuevoNumero);
        boleta.setFecha(Instant.now());
        boleta.setUsuarioRun(usuarioRun);
        
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

        int subtotal = 0;
        List<DetalleBoleta> detalles = new ArrayList<>();

        for (CrearBoletaRequest.ItemRequest itemReq : request.getItems()) {
            String urlProducto = urlCatalogo + "/productos/" + itemReq.getProductoId();
            ProductoDTO producto;
            try {
                ResponseEntity<ProductoDTO> response = restTemplate.getForEntity(urlProducto, ProductoDTO.class);
                producto = response.getBody();
            } catch (HttpClientErrorException.NotFound e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado: " + itemReq.getProductoId());
            } catch (RestClientException e) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "El catálogo no está disponible. Intenta nuevamente en unos minutos.");
            }

            if (producto == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado: " + itemReq.getProductoId());
            }

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para: " + producto.getNombre());
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
        int envio = 0;
        if (request.getDespacho().equals("premium")) {
            envio = 5990;
        } else if (subtotal < 44990) {
            envio = 3990;
        }
        boleta.setEnvio(envio);
        boleta.setTotal(subtotal + envio);

        boolean pagoAprobado = simularPago(boleta.getTotal(), request.getMetodoPago());
        
        if (pagoAprobado) {
            try {
                descontarStock(detalles); // Llama a Matías
            } catch (Exception e) {
                boleta.setEstado("rechazada");
                boleta.setMotivoRechazo("Stock agotado al momento de procesar el pago.");
                boletaRepository.save(boleta);
                throw new ResponseStatusException(HttpStatus.CONFLICT, "No se pudo completar la compra: stock agotado.");
            }
            boleta.setEstado("pagada");
        } else {
            boleta.setEstado("rechazada");
            boleta.setMotivoRechazo("Pago rechazado por la pasarela simulada.");
        }

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
        res.setDespacho(boleta.getDespacho());
        res.setMetodoPago(boleta.getMetodoPago());
        res.setEstado(boleta.getEstado());
        res.setMotivoRechazo(boleta.getMotivoRechazo());

        // Mapear Cliente
        BoletaResponse.ClienteResponse clienteRes = new BoletaResponse.ClienteResponse();
        clienteRes.setNombre(boleta.getClienteNombre());
        clienteRes.setApellidos(boleta.getClienteApellidos());
        clienteRes.setCorreo(boleta.getClienteCorreo());
        res.setCliente(clienteRes);

        // Mapear Dirección
        BoletaResponse.DireccionResponse dirRes = new BoletaResponse.DireccionResponse();
        dirRes.setCalle(boleta.getDireccionCalle());
        dirRes.setDepartamento(boleta.getDireccionDepartamento());
        dirRes.setIndicaciones(boleta.getDireccionIndicaciones());
        dirRes.setRegion(boleta.getDireccionRegion());
        dirRes.setComuna(boleta.getDireccionComuna());
        res.setDireccion(dirRes);

        // Mapear Items
        List<BoletaResponse.DetalleResponse> detallesRes = new ArrayList<>();
        for (DetalleBoleta d : boleta.getItems()) {
            BoletaResponse.DetalleResponse dr = new BoletaResponse.DetalleResponse();
            dr.setProductoId(d.getProductoId());
            dr.setNombre(d.getNombreProducto());
            dr.setImagen(d.getImagen());
            dr.setCategoria(d.getCategoria());
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
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Boleta no encontrada"));
    }

    @Override
    public List<Boleta> obtenerBoletasPorUsuario(String usuarioRun) {
        return boletaRepository.findByUsuarioRunOrderByFechaDesc(usuarioRun);
    }

    @Override
    public Boleta obtenerBoletaDelCliente(String id, String usuarioRun) {
        Boleta boleta = obtenerBoleta(id);
        if (!boleta.getUsuarioRun().equals(usuarioRun)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver esta boleta");
        }
        return boleta;
    }

    @Override
    public BoletaResponse reintentarPago(String id, String usuarioRun) {
        Boleta boleta = obtenerBoleta(id);
        if (!boleta.getUsuarioRun().equals(usuarioRun)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para reintentar esta boleta");
        }
        if (!boleta.getEstado().equals("rechazada")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solo se pueden reintentar boletas rechazadas");
        }
        
        boolean pagoAprobado = simularPago(boleta.getTotal(), boleta.getMetodoPago());
        if (pagoAprobado) {
            // Al crear la boleta rechazada no se descontó stock: se descuenta recién ahora que queda pagada.
            try {
                descontarStock(boleta.getItems());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "No se pudo completar la compra: stock agotado.");
            }
            boleta.setEstado("pagada");
            boleta.setMotivoRechazo(null);
        } else {
            boleta.setMotivoRechazo("Pago rechazado en el reintento.");
        }
        
        boletaRepository.save(boleta);
        return mapearAResponse(boleta);
    }

    @Override
    public BoletaResponse cambiarEstado(String id, String nuevoEstado) {
        Boleta boleta = obtenerBoleta(id);
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado es obligatorio");
        }
        if (!esTransicionValida(boleta.getEstado(), nuevoEstado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Transición no permitida: " + boleta.getEstado() + " → " + nuevoEstado);
        }
        if (boleta.getEstado().equals("pagada") && nuevoEstado.equals("cancelada")) {
            reponerStock(boleta);
        }
        boleta.setEstado(nuevoEstado);
        boletaRepository.save(boleta);
        return mapearAResponse(boleta);
    }

    @Override
    public void cancelarBoleta(String id) {
        Boleta boleta = obtenerBoleta(id);
        if (!esTransicionValida(boleta.getEstado(), "cancelada")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede cancelar una boleta " + boleta.getEstado());
        }
        if (boleta.getEstado().equals("pagada")) {
            reponerStock(boleta);
        }
        boleta.setEstado("cancelada");
        boletaRepository.save(boleta);
    }

    private void reponerStock(Boleta boleta) {
        if (serviceKey == null || serviceKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Reposición de stock no configurada (SERVICE_KEY)");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Service-Key", serviceKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        for (DetalleBoleta detalle : boleta.getItems()) {
            String url = urlCatalogo + "/productos/" + detalle.getProductoId() + "/stock";
            Map<String, Object> cuerpo = Map.of("cantidad", detalle.getCantidad(), "operacion", "reponer");
            try {
                restTemplate.exchange(url, HttpMethod.PATCH, new HttpEntity<>(cuerpo, headers), Void.class);
            } catch (RestClientException e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "No se pudo reponer el stock de " + detalle.getProductoId(), e);
            }
        }
    }

    private boolean esTransicionValida(String estadoActual, String nuevoEstado) {
        return switch (estadoActual) {
            case "pagada" -> nuevoEstado.equals("enviada") || nuevoEstado.equals("cancelada");
            case "enviada" -> nuevoEstado.equals("entregada");
            case "rechazada" -> nuevoEstado.equals("cancelada");
            default -> false;
        };
    }

    @Override
    public List<BoletaResponse> listarBoletasResponse() {
        return boletaRepository.findAll().stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BoletaResponse> obtenerBoletasPorUsuarioResponse(String usuarioRun) {
        return boletaRepository.findByUsuarioRunOrderByFechaDesc(usuarioRun).stream()
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BoletaResponse obtenerBoletaResponse(String id) {
        return mapearAResponse(obtenerBoleta(id));
    }

    @Override
    public BoletaResponse obtenerBoletaDelClienteResponse(String id, String usuarioRun) {
        return mapearAResponse(obtenerBoletaDelCliente(id, usuarioRun));
    }

    private void descontarStock(List<DetalleBoleta> detalles) {
        if (serviceKey == null || serviceKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Descuento de stock no configurado");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Service-Key", serviceKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        for (DetalleBoleta detalle : detalles) {
            String url = urlCatalogo + "/productos/" + detalle.getProductoId() + "/stock";
            Map<String, Object> cuerpo = Map.of("cantidad", detalle.getCantidad(), "operacion", "descontar");
            try {
                restTemplate.exchange(url, HttpMethod.PATCH, new HttpEntity<>(cuerpo, headers), Void.class);
            } catch (RestClientException e) {
                throw new RuntimeException("Fallo al descontar stock de " + detalle.getProductoId(), e);
            }
        }
    }
}