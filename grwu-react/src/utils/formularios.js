// formularios.js - Validación de los formularios de Login y Registro.
// Autor: César
//
// Cada función recibe los valores del formulario y devuelve un objeto de errores
// { campo: "mensaje" }. Si el objeto viene vacío, el formulario es válido.
// Se mantiene fuera de los componentes para probarla sin DOM.

import { validarRun, validarCorreo, validarPassword, validarTelefono } from "./validaciones.js";

export function validarLogin({ correo, clave }) {
  const errores = {};
  const c = validarCorreo(correo);
  if (!c.valido) errores.correo = c.mensaje;
  if (!clave) errores.clave = "La contraseña es obligatoria.";
  return errores;
}

export function validarRegistro(d) {
  const errores = {};

  const run = validarRun(d.run);
  if (!run.valido) errores.run = run.mensaje;

  if (!d.nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
  else if (d.nombre.length > 50) errores.nombre = "El nombre no puede superar los 50 caracteres.";

  if (!d.apellidos?.trim()) errores.apellidos = "Los apellidos son obligatorios.";
  else if (d.apellidos.length > 100) errores.apellidos = "Los apellidos no pueden superar los 100 caracteres.";

  const correo = validarCorreo(d.correo);
  if (!correo.valido) errores.correo = correo.mensaje;

  // El teléfono es opcional, pero si se escribe debe tener formato válido.
  if (d.telefono?.trim()) {
    const tel = validarTelefono(d.telefono);
    if (!tel.valido) errores.telefono = tel.mensaje;
  }

  if (!d.region) errores.region = "Selecciona una región.";
  if (!d.comuna) errores.comuna = "Selecciona una comuna.";

  const clave = validarPassword(d.clave);
  if (!clave.valido) errores.clave = clave.mensaje;

  if (!d.clave2) errores.clave2 = "Confirma tu contraseña.";
  else if (d.clave !== d.clave2) errores.clave2 = "Las contraseñas no coinciden.";

  return errores;
}

export function validarCheckout(d) {
  const errores = {};
  if (!d.nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
  if (!d.apellidos?.trim()) errores.apellidos = "Los apellidos son obligatorios.";
  const correo = validarCorreo(d.correo);
  if (!correo.valido) errores.correo = correo.mensaje;
  if (!d.calle?.trim()) errores.calle = "La calle es obligatoria.";
  if (!d.region) errores.region = "Selecciona una región.";
  if (!d.comuna) errores.comuna = "Selecciona una comuna.";
  if (!d.metodoPago) errores.metodoPago = "Selecciona un método de pago.";
  return errores;
}
