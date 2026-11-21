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
}
