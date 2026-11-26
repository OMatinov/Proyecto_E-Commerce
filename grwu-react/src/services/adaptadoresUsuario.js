// adaptadoresUsuario.js - Prepara el cuerpo que se envía a /api/v1/auth/registro y /api/v1/usuarios.
// Autor: César
//
// Vive aparte de adapters.js (de Katerine, boletas) para no mezclar archivos de dueños distintos.

import { limpiarRun } from "../utils/validaciones.js";

// Quita la confirmación de clave, deja el RUN sin puntos ni guion y no envía la clave si viene vacía (edición).
export function aSolicitudUsuario(valores) {
  const { clave2: _clave2, clave, run, ...resto } = valores;
  const cuerpo = { ...resto };
  if (run) cuerpo.run = limpiarRun(run);
  if (clave) cuerpo.clave = clave;
  return cuerpo;
}
