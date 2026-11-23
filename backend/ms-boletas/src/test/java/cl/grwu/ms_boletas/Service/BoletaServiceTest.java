package cl.grwu.ms_boletas.Service;

import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.DTO.ProductoDTO;
import cl.grwu.ms_boletas.Entity.Boleta;
import cl.grwu.ms_boletas.Repository.BoletaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BoletaServiceTest {

    @Mock
    private BoletaRepository boletaRepository;

    @Mock
    private RestTemplate restTemplate;

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

        // 3. Verificamos que lance la excepción
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
        // 1. Preparamos una boleta que YA está pagada
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
}

