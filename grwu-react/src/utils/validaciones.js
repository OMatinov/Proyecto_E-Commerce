// validaciones.js - Versión ES module de js/validaciones.js (sin acceso al DOM).
// Cada función devuelve { valido, mensaje } para que React muestre el error.

export function limpiarRun(run) {
  if (!run) return "";
  return String(run).replace(/[^0-9kK]/g, "").toUpperCase();
}

export function validarRun(runSucio) {
  if (!runSucio) return { valido: false, mensaje: "El RUN es obligatorio." };
  const run = limpiarRun(runSucio);
  if (run.length < 7 || run.length > 9) {
    return { valido: false, mensaje: "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion." };
  }
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  if (!/^\d+$/.test(cuerpo)) {
    return { valido: false, mensaje: "El RUN solo puede contener números (y K en el dígito verificador)." };
  }
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  if (dv !== esperado) {
    return { valido: false, mensaje: "El RUN ingresado no es válido (dígito verificador incorrecto)." };
  }
  return { valido: true, mensaje: "" };
}

export function validarCorreo(correo, maxLength = 100) {
  if (!correo || typeof correo !== "string") return { valido: false, mensaje: "El correo es obligatorio." };
  const limpio = correo.trim();
  if (limpio.length > maxLength) {
    return { valido: false, mensaje: `El correo no puede superar los ${maxLength} caracteres.` };
  }
  if (!/^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(limpio)) {
    return { valido: false, mensaje: "Solo se aceptan correos válidos de @duoc.cl, @profesor.duoc.cl o @gmail.com." };
  }
  return { valido: true, mensaje: "" };
}

export function validarPassword(password, { min = 4, max = 10, exigirComplejidad = false } = {}) {
  if (!password) return { valido: false, mensaje: "La contraseña es obligatoria." };
  if (password.length < min || password.length > max) {
    return { valido: false, mensaje: `La contraseña debe tener entre ${min} y ${max} caracteres.` };
  }
  if (exigirComplejidad) {
    if (!/[A-Z]/.test(password)) return { valido: false, mensaje: "La contraseña debe incluir al menos una letra mayúscula." };
    if (!/[0-9]/.test(password)) return { valido: false, mensaje: "La contraseña debe incluir al menos un número." };
  }
  return { valido: true, mensaje: "" };
}

export function validarTelefono(valor) {
  const v = (valor || "").trim();
  if (!v) return { valido: false, mensaje: "El teléfono es obligatorio." };
  if (!/^[+\d][\d\s-]{6,14}$/.test(v)) {
    return { valido: false, mensaje: "Ingresa un teléfono válido, ej: +56 9 1234 5678." };
  }
  return { valido: true, mensaje: "" };
}
