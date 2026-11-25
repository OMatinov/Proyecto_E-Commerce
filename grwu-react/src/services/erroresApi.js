// erroresApi.js - Normaliza los errores de Axios al formato que usan las pantallas.
// Autor: Matias (catalogo)
//
// El backend responde { timestamp, status, error, message, path, errores? }.
// La UI solo necesita { mensaje, status, errores }, asi no depende del formato
// interno de Axios ni del nombre de los campos del servidor.

export function normalizarError(error) {
  const respuesta = error?.response;

  if (!respuesta) {
    return {
      mensaje: 'No se pudo conectar con el servidor. Revisa que el servicio este en linea.',
      status: 0,
      errores: {},
    };
  }

  const datos = respuesta.data ?? {};

  return {
    mensaje: datos.message || datos.error || 'Ocurrio un error inesperado.',
    status: respuesta.status,
    errores: datos.errores ?? {},
  };
}
