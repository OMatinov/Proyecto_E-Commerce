package cl.grwu.ms_boletas.Service;

import cl.grwu.ms_boletas.DTO.BoletaResponse;
import cl.grwu.ms_boletas.DTO.CrearBoletaRequest;
import cl.grwu.ms_boletas.Entity.Boleta;

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
