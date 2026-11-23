// errores.js - Normaliza los errores de Axios a { mensaje, status, errores } para que la UI no dependa de Axios.
// Autor: César
//
//   status 0   -> no hubo respuesta (servicio caído, sin red)
//   errores    -> mapa { campo: mensaje } cuando el backend valida campo por campo (400)

export function normalizarError(error) {
  const respuesta = error?.response;
  if (!respuesta) {
    return {
      mensaje: "No se pudo conectar con el servidor. Revisa que los servicios estén levantados.",
      status: 0,
      errores: null
    };
  }
  const datos = respuesta.data && typeof respuesta.data === "object" ? respuesta.data : {};
  return {
    mensaje: datos.message || datos.mensaje || "Ocurrió un error inesperado. Intenta nuevamente.",
    status: respuesta.status,
    errores: datos.errores || null
  };
}

// Reparte un error normalizado entre los campos del formulario y un mensaje general:
//   400 con "errores"  -> por campo
//   409 (RUN o correo duplicado) -> en el campo que corresponde
//   cualquier otro     -> mensaje general (servicio caído, 403, 500...)
export function repartirError({ mensaje, status, errores }) {
  if (errores) return { campos: errores, general: "" };
  if (status === 409) return { campos: { [mensaje.includes("RUN") ? "run" : "correo"]: mensaje }, general: "" };
  return { campos: {}, general: mensaje };
}
