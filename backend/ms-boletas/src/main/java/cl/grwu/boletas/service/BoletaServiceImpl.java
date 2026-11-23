package cl.grwu.boletas.service;

import cl.grwu.boletas.dto.BoletaResponse;
import cl.grwu.boletas.dto.CrearBoletaRequest;
import cl.grwu.boletas.dto.ProductoDTO;
import cl.grwu.boletas.entity.Boleta;
import cl.grwu.boletas.entity.DetalleBoleta;
import cl.grwu.boletas.repository.BoletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import java.util.LinkedHashMap;

import java.time.Instant;
import java.time.format.DateTimeParseException;
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
    private final Random random;

    @Value("${servicios.catalogo.url}")
    private String urlCatalogo;

    @Value("${pasarela.probabilidad-rechazo:0.10}")
    private double probabilidadRechazo;

    @Value("${pasarela.limite-monto:100000}")
    private int limiteMonto;

    @Value("${servicios.catalogo.service-key:}")
    private String serviceKey;

    public BoletaServiceImpl(BoletaRepository boletaRepository, RestTemplate restTemplate) {
        this(boletaRepository, restTemplate, new Random());
    }

    @Autowired
    public BoletaServiceImpl(BoletaRepository boletaRepository, RestTemplate restTemplate, Random random) {
        this.boletaRepository = boletaRepository;
        this.restTemplate = restTemplate;
        this.random = random;
    }

   @Override
    @Transactional(noRollbackFor = ResponseStatusException.class)
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

        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (CrearBoletaRequest.ItemRequest itemReq : request.getItems()) {
            cantidades.merge(itemReq.getProductoId(), itemReq.getCantidad(), Integer::sum);
        }

        for (Map.Entry<String, Integer> entry : cantidades.entrySet()) {
            String productoId = entry.getKey();
            Integer cantidad = entry.getValue();

            String urlProducto = urlCatalogo + "/productos/" + productoId;
            ResponseEntity<ProductoDTO> response = restTemplate.getForEntity(urlProducto, ProductoDTO.class);
            ProductoDTO producto = response.getBody();

            if (producto == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado: " + productoId);
            }

            if (producto.getStock() == null || producto.getStock() < cantidad) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para: " + producto.getNombre());
            }

            int subtotalLinea = producto.getPrecio() * cantidad;
            subtotal += subtotalLinea;

            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setProductoId(producto.getId());
            detalle.setNombreProducto(producto.getNombre());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setImagen(producto.getImagen());
            detalle.setCategoria(producto.getCategoriaSlug());
            detalle.setCantidad(cantidad);
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
                descontarStock(detalles);
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
        return random.nextDouble() >= probabilidadRechazo;
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
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public BoletaResponse reintentarPago(String id, String usuarioRun) {
        Boleta boleta = obtenerBoleta(id);
        if (!boleta.getUsuarioRun().equals(usuarioRun)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para reintentar esta boleta");
        }
        if (!"rechazada".equals(boleta.getEstado())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solo se pueden reintentar boletas rechazadas");
        }

        for (DetalleBoleta detalle : boleta.getItems()) {
            ProductoDTO producto = restTemplate.getForEntity(
                    urlCatalogo + "/productos/" + detalle.getProductoId(), ProductoDTO.class).getBody();
            if (producto == null || producto.getStock() == null
                    || producto.getStock() < detalle.getCantidad()) {
                boleta.setEstado("rechazada");
                boleta.setMotivoRechazo("Stock insuficiente al reintentar el pago.");
                boletaRepository.save(boleta);
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para " + detalle.getProductoId());
            }
        }

        boolean pagoAprobado = simularPago(boleta.getTotal(), boleta.getMetodoPago());
        if (pagoAprobado) {
            try {
                descontarStock(boleta.getItems());
            } catch (Exception e) {
                boleta.setEstado("rechazada");
                boleta.setMotivoRechazo("Stock agotado al reintentar el pago.");
                boletaRepository.save(boleta);
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "No se pudo completar el reintento: stock agotado.");
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
    @Transactional
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
    @Transactional
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
    public List<BoletaResponse> listarBoletasResponse(String estado, String usuarioRun,
                                                      String desde, String hasta) {
        Instant desdeInstant = parsearFecha(desde, "desde");
        Instant hastaInstant = parsearFecha(hasta, "hasta");

        return boletaRepository.findAll().stream()
                .filter(b -> estado == null || estado.isBlank() || b.getEstado().equalsIgnoreCase(estado))
                .filter(b -> usuarioRun == null || usuarioRun.isBlank() || usuarioRun.equals(b.getUsuarioRun()))
                .filter(b -> desdeInstant == null
                        || (b.getFecha() != null && !b.getFecha().isBefore(desdeInstant)))
                .filter(b -> hastaInstant == null
                        || (b.getFecha() != null && !b.getFecha().isAfter(hastaInstant)))
                .map(this::mapearAResponse)
                .collect(Collectors.toList());
    }

    private Instant parsearFecha(String valor, String nombreParametro) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return Instant.parse(valor);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El parámetro " + nombreParametro + " debe ser ISO-8601 UTC (ej. 2026-11-22T10:30:00Z)", e);
        }
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
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Fallo al descontar stock de " + detalle.getProductoId(), e);
            }
        }
    }
}