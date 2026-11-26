package cl.grwu.boletas.service;

import cl.grwu.boletas.dto.BoletaResponse;
import cl.grwu.boletas.dto.CrearBoletaRequest;
import cl.grwu.boletas.dto.ProductoDTO;
import cl.grwu.boletas.entity.Boleta;
import cl.grwu.boletas.entity.DetalleBoleta;
import cl.grwu.boletas.repository.BoletaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BoletaServiceTest {

    @Mock
    private BoletaRepository boletaRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private Random random;

    @InjectMocks
    private BoletaServiceImpl boletaService;

    @BeforeEach
    void setUp() {
        // Inyectamos los valores que normalmente vienen del application.yml
        ReflectionTestUtils.setField(boletaService, "urlCatalogo", "http://localhost:8082/api/v1");
        ReflectionTestUtils.setField(boletaService, "probabilidadRechazo", 0.0); // Forzamos que el pago sea APROBADO
        ReflectionTestUtils.setField(boletaService, "limiteMonto", 100000);
        ReflectionTestUtils.setField(boletaService, "serviceKey", "clave-interna-grwu");
    }

    @Test
    void testCrearBoleta_CalculaTotalesCorrectamente() {
        // 1. Preparamos el "falso" producto que nos devolvería Matías
        ProductoDTO productoFalso = new ProductoDTO();
        productoFalso.setId("p-001");
        productoFalso.setNombre("Polera Test");
        productoFalso.setPrecio(20000);
        productoFalso.setStock(10);

        // 2. Simulamos que Matías nos devuelve el producto las veces que sea necesario
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(productoFalso));

        // 3. Simulamos que el descuento de stock responde OK
        when(restTemplate.exchange(anyString(), eq(org.springframework.http.HttpMethod.PATCH), any(), eq(Void.class)))
                .thenReturn(ResponseEntity.ok().build());

        // 4. Preparamos la petición del cliente (2 poleras)
        CrearBoletaRequest request = new CrearBoletaRequest();
        CrearBoletaRequest.ItemRequest item = new CrearBoletaRequest.ItemRequest();
        item.setProductoId("p-001");
        item.setCantidad(2);
        request.setItems(List.of(item));
        request.setDespacho("estandar");
        request.setMetodoPago("credito");

        CrearBoletaRequest.ClienteRequest cliente = new CrearBoletaRequest.ClienteRequest();
        cliente.setNombre("Katerine");
        cliente.setApellidos("Olmedo");
        cliente.setCorreo("katerine@duoc.cl");
        request.setCliente(cliente);

        CrearBoletaRequest.DireccionRequest direccion = new CrearBoletaRequest.DireccionRequest();
        direccion.setCalle("Calle Falsa 123");
        direccion.setRegion("Metropolitana");
        direccion.setComuna("Santiago");
        request.setDireccion(direccion);

        // 5. Ejecutamos el método
        boletaService.crearBoleta(request, "190110222");

        // 6. Verificamos que los cálculos estén bien
        // 2 poleras de 20.000 = 40.000. Como es menor a 44.990, el envío es 3.990. Total = 43.990.
        // Nota: No estamos guardando en la BD real gracias al Mock, pero podemos verificar el objeto antes de guardar.
        
        // Como nuestro método guarda directo, verificamos que llamó a guardar con los datos correctos
        org.mockito.ArgumentCaptor<Boleta> captor = org.mockito.ArgumentCaptor.forClass(Boleta.class);
        org.mockito.Mockito.verify(boletaRepository).save(captor.capture());
        
        Boleta boletaGuardada = captor.getValue();
        
        assertEquals(40000, boletaGuardada.getSubtotal());
        assertEquals(3990, boletaGuardada.getEnvio());
        assertEquals(43990, boletaGuardada.getTotal());
        assertEquals("pagada", boletaGuardada.getEstado()); // Como forzamos 0.0 de rechazo, debe ser pagada
    }

    @Test
    void testCrearBoleta_FallaSiNoHayStock() {
        // 1. Producto con stock 0
        ProductoDTO productoFalso = new ProductoDTO();
        productoFalso.setId("p-001");
        productoFalso.setNombre("Polera Test");
        productoFalso.setPrecio(20000);
        productoFalso.setStock(0);

        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(productoFalso));

        // 2. Pedimos 1 unidad (con datos de cliente y dirección válidos)
        CrearBoletaRequest request = new CrearBoletaRequest();
        CrearBoletaRequest.ItemRequest item = new CrearBoletaRequest.ItemRequest();
        item.setProductoId("p-001");
        item.setCantidad(1);
        request.setItems(List.of(item));
        request.setDespacho("estandar");
        request.setMetodoPago("credito");

        CrearBoletaRequest.ClienteRequest cliente = new CrearBoletaRequest.ClienteRequest();
        cliente.setNombre("Katerine");
        cliente.setApellidos("Olmedo");
        cliente.setCorreo("katerine@duoc.cl");
        request.setCliente(cliente);

        CrearBoletaRequest.DireccionRequest direccion = new CrearBoletaRequest.DireccionRequest();
        direccion.setCalle("Calle Falsa 123");
        direccion.setRegion("Metropolitana");
        direccion.setComuna("Santiago");
        request.setDireccion(direccion);

        // 3. Verificamos que lance 409 CONFLICT con el formato del contrato
        org.springframework.web.server.ResponseStatusException exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> boletaService.crearBoleta(request, "190110222")
        );

        assertEquals(org.springframework.http.HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Stock insuficiente para: Polera Test", exception.getReason());
    }

    @Test
    void testObtenerBoletaDelCliente_LanzaExcepcionSiNoEsElDueño() {
        // 1. Preparamos una boleta que pertenece a otro RUN
        Boleta boletaFalsa = new Boleta();
        boletaFalsa.setId("ORD-20260001");
        boletaFalsa.setUsuarioRun("111111111"); // Otro usuario

        when(boletaRepository.findById("ORD-20260001")).thenReturn(Optional.of(boletaFalsa));

        // 2. Intentamos obtenerla con un RUN distinto
        org.springframework.web.server.ResponseStatusException exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> boletaService.obtenerBoletaDelCliente("ORD-20260001", "222222222")
        );

        // 3. Verificamos que lance 403 FORBIDDEN
        assertEquals(org.springframework.http.HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertEquals("No tienes permiso para ver esta boleta", exception.getReason());
    }

    @Test
    void testReintentarPago_LanzaExcepcionSiLaBoletaNoEstaRechazada() {
        // 1. Preparamos una boleta que ya esta pagada
        Boleta boletaFalsa = new Boleta();
        boletaFalsa.setId("ORD-20260001");
        boletaFalsa.setUsuarioRun("111111111");
        boletaFalsa.setEstado("pagada");

        when(boletaRepository.findById("ORD-20260001")).thenReturn(Optional.of(boletaFalsa));

        // 2. Intentamos reintentar el pago (con el mismo dueño)
        org.springframework.web.server.ResponseStatusException exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> boletaService.reintentarPago("ORD-20260001", "111111111")
        );

        // 3. Verificamos que lance 409 CONFLICT
        assertEquals(org.springframework.http.HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Solo se pueden reintentar boletas rechazadas", exception.getReason());
    }

    @Test
    void testCambiarEstado_LanzaExcepcionSiLaTransicionEsInvalida() {
        // 1. Preparamos una boleta "pagada"
        Boleta boletaFalsa = new Boleta();
        boletaFalsa.setId("ORD-20260001");
        boletaFalsa.setEstado("pagada");

        when(boletaRepository.findById("ORD-20260001")).thenReturn(Optional.of(boletaFalsa));

        // 2. Intentamos pasarla a "entregada" (salteándonos "enviada")
        org.springframework.web.server.ResponseStatusException exception = assertThrows(
                org.springframework.web.server.ResponseStatusException.class,
                () -> boletaService.cambiarEstado("ORD-20260001", "entregada")
        );

        // 3. Verificamos que lance 409 CONFLICT
        assertEquals(org.springframework.http.HttpStatus.CONFLICT, exception.getStatusCode());
        assertTrue(exception.getReason().contains("Transición no permitida"));
    }

    @Test
    void testCrearBoleta_EnvioGratisCuandoSubtotalSuperaUmbral() {
        stubProductoYStock(producto("p-001", 45000, 5));

        boletaService.crearBoleta(requestCon("estandar", item("p-001", 1)), "190110222");

        Boleta guardada = boletaGuardada();
        assertEquals(45000, guardada.getSubtotal());
        assertEquals(0, guardada.getEnvio());
        assertEquals(45000, guardada.getTotal());
    }

    @Test
    void testCrearBoleta_EnvioPremiumSiempreCuesta5990() {
        stubProductoYStock(producto("p-001", 45000, 5));

        boletaService.crearBoleta(requestCon("premium", item("p-001", 1)), "190110222");

        Boleta guardada = boletaGuardada();
        assertEquals(5990, guardada.getEnvio());
        assertEquals(50990, guardada.getTotal());
    }

    @Test
    void testCrearBoleta_RechazaPorMontoMayorAlLimite() {
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(producto("p-001", 60000, 10)));

        boletaService.crearBoleta(requestCon("estandar", item("p-001", 2)), "190110222");

        Boleta guardada = boletaGuardada();
        assertEquals("rechazada", guardada.getEstado());
        assertEquals("Pago rechazado por la pasarela simulada.", guardada.getMotivoRechazo());
        verify(restTemplate, never()).exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class));
    }

    @Test
    void testCrearBoleta_RechazaPorProbabilidad() {
        ReflectionTestUtils.setField(boletaService, "probabilidadRechazo", 1.0);
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(producto("p-001", 20000, 10)));

        boletaService.crearBoleta(requestCon("estandar", item("p-001", 1)), "190110222");

        assertEquals("rechazada", boletaGuardada().getEstado());
        verify(restTemplate, never()).exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class));
    }

    @Test
    void testCrearBoleta_RechazaCuandoAzarInyectadoEsMenorAlUmbral() {
        ReflectionTestUtils.setField(boletaService, "probabilidadRechazo", 0.5);
        when(random.nextDouble()).thenReturn(0.4);
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(producto("p-001", 20000, 10)));

        boletaService.crearBoleta(requestCon("estandar", item("p-001", 1)), "190110222");

        assertEquals("rechazada", boletaGuardada().getEstado());
        assertEquals("Pago rechazado por la pasarela simulada.", boletaGuardada().getMotivoRechazo());
        verify(restTemplate, never()).exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class));
    }

    @Test
    void testCrearBoleta_ApruebaCuandoAzarInyectadoEsAlto() {
        ReflectionTestUtils.setField(boletaService, "probabilidadRechazo", 0.5);
        when(random.nextDouble()).thenReturn(0.95);
        stubProductoYStock(producto("p-001", 20000, 10));

        boletaService.crearBoleta(requestCon("estandar", item("p-001", 1)), "190110222");

        assertEquals("pagada", boletaGuardada().getEstado());
    }

    @Test
    void testCrearBoleta_SumaProductosRepetidosAntesDeValidarStock() {
        stubProductoYStock(producto("p-001", 20000, 10));

        boletaService.crearBoleta(requestCon("estandar",
                item("p-001", 1), item("p-001", 2)), "190110222");

        Boleta guardada = boletaGuardada();
        assertEquals(1, guardada.getItems().size());
        assertEquals(3, guardada.getItems().get(0).getCantidad());
        assertEquals(60000, guardada.getSubtotal());
        verify(restTemplate, times(1)).getForEntity(anyString(), eq(ProductoDTO.class));
    }

    @Test
    void testReintentarPago_AprobadoRevalidaYDescuentaStock() {
        when(boletaRepository.findById("ORD-20260001"))
                .thenReturn(Optional.of(boletaRechazadaConItem("p-001", 1)));
        stubProductoYStock(producto("p-001", 20000, 5));

        boletaService.reintentarPago("ORD-20260001", "190110222");

        Boleta guardada = boletaGuardada();
        assertEquals("pagada", guardada.getEstado());
        assertNull(guardada.getMotivoRechazo());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class));
    }

    @Test
    void testReintentarPago_SinStockLanza409YNoDescuenta() {
        when(boletaRepository.findById("ORD-20260001"))
                .thenReturn(Optional.of(boletaRechazadaConItem("p-001", 1)));
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(producto("p-001", 20000, 0)));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> boletaService.reintentarPago("ORD-20260001", "190110222"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("rechazada", boletaGuardada().getEstado());
        verify(restTemplate, never()).exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class));
    }

    @Test
    void testObtenerBoletaDelCliente_PermiteAlDueño() {
        Boleta boleta = boletaRechazadaConItem("p-001", 1);
        when(boletaRepository.findById("ORD-20260001")).thenReturn(Optional.of(boleta));

        Boleta obtenida = boletaService.obtenerBoletaDelCliente("ORD-20260001", "190110222");

        assertSame(boleta, obtenida);
    }

    @Test
    void testListarBoletas_FiltraPorEstadoUsuarioYRangoDeFechas() {
        Boleta pagada = boletaRechazadaConItem("p-001", 1);
        pagada.setEstado("pagada");
        Boleta ajena = boletaRechazadaConItem("p-001", 1);
        ajena.setId("ORD-20260002");
        ajena.setUsuarioRun("111111111");
        when(boletaRepository.findAll()).thenReturn(List.of(pagada, ajena));

        List<BoletaResponse> resultado = boletaService.listarBoletasResponse(
                "pagada", "190110222", "2026-01-01T00:00:00Z", "2026-12-31T23:59:59Z");

        assertEquals(1, resultado.size());
        assertEquals("ORD-20260001", resultado.get(0).getId());
    }

    @Test
    void testListarBoletas_FechaInvalidaLanza400() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> boletaService.listarBoletasResponse(null, null, "22-11-2026", null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private CrearBoletaRequest.ItemRequest item(String productoId, int cantidad) {
        CrearBoletaRequest.ItemRequest item = new CrearBoletaRequest.ItemRequest();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        return item;
    }

    private CrearBoletaRequest requestCon(String despacho, CrearBoletaRequest.ItemRequest... items) {
        CrearBoletaRequest request = new CrearBoletaRequest();
        request.setItems(List.of(items));
        request.setDespacho(despacho);
        request.setMetodoPago("credito");

        CrearBoletaRequest.ClienteRequest cliente = new CrearBoletaRequest.ClienteRequest();
        cliente.setNombre("Katerine");
        cliente.setApellidos("Olmedo");
        cliente.setCorreo("katerine@duoc.cl");
        request.setCliente(cliente);

        CrearBoletaRequest.DireccionRequest direccion = new CrearBoletaRequest.DireccionRequest();
        direccion.setCalle("Calle Falsa 123");
        direccion.setRegion("Metropolitana");
        direccion.setComuna("Santiago");
        request.setDireccion(direccion);
        return request;
    }

    private ProductoDTO producto(String id, int precio, int stock) {
        ProductoDTO producto = new ProductoDTO();
        producto.setId(id);
        producto.setNombre("Polera Test");
        producto.setPrecio(precio);
        producto.setStock(stock);
        return producto;
    }

    private void stubProductoYStock(ProductoDTO producto) {
        when(restTemplate.getForEntity(anyString(), eq(ProductoDTO.class)))
                .thenReturn(ResponseEntity.ok(producto));
        when(restTemplate.exchange(anyString(), eq(HttpMethod.PATCH), any(), eq(Void.class)))
                .thenReturn(ResponseEntity.ok().build());
    }

    private Boleta boletaGuardada() {
        ArgumentCaptor<Boleta> captor = ArgumentCaptor.forClass(Boleta.class);
        verify(boletaRepository).save(captor.capture());
        return captor.getValue();
    }

    private Boleta boletaRechazadaConItem(String productoId, int cantidad) {
        Boleta boleta = new Boleta();
        boleta.setId("ORD-20260001");
        boleta.setNumero(20260001L);
        boleta.setFecha(Instant.parse("2026-11-22T10:30:00Z"));
        boleta.setUsuarioRun("190110222");
        boleta.setEstado("rechazada");
        boleta.setMetodoPago("credito");
        boleta.setTotal(20000 * cantidad);

        DetalleBoleta detalle = new DetalleBoleta();
        detalle.setProductoId(productoId);
        detalle.setNombreProducto("Polera Test");
        detalle.setCantidad(cantidad);
        detalle.setPrecioUnitario(20000);
        detalle.setSubtotalLinea(20000 * cantidad);
        boleta.agregarItem(detalle);
        return boleta;
    }
}

