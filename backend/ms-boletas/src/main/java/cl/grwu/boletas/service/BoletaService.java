package cl.grwu.boletas.service;

import cl.grwu.boletas.dto.BoletaResponse;
import cl.grwu.boletas.dto.CrearBoletaRequest;
import cl.grwu.boletas.entity.Boleta;

import java.util.List;

public interface BoletaService {
    BoletaResponse crearBoleta(CrearBoletaRequest request, String usuarioRun);
    List<Boleta> listarBoletas();

    Boleta obtenerBoleta(String id);
    List<Boleta> obtenerBoletasPorUsuario(String usuarioRun);

    BoletaResponse reintentarPago(String id, String usuarioRun);

    Boleta obtenerBoletaDelCliente(String id, String usuarioRun);

    BoletaResponse cambiarEstado(String id, String nuevoEstado);
    void cancelarBoleta(String id);

    List<BoletaResponse> listarBoletasResponse();

    List<BoletaResponse> obtenerBoletasPorUsuarioResponse(String usuarioRun);

    BoletaResponse obtenerBoletaResponse(String id);
    
    BoletaResponse obtenerBoletaDelClienteResponse(String id, String usuarioRun);
}
