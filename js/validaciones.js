// Usadas en registro.html, inicio-sesion.html y checkout.html.

// ---------- Validación de RUN chileno ----------
function limpiarRun(run) {
  if (!run) return ""; // Protección contra null/undefined
  return String(run).replace(/[^0-9kK]/g, "").toUpperCase();
}

function validarRun(runSucio) {
  if (!runSucio) {
    return { valido: false, mensaje: "El RUN es obligatorio." };
  }

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
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  if (dv !== dvEsperado) {
    return { valido: false, mensaje: "El RUN ingresado no es válido (dígito verificador incorrecto)." };
  }

  return { valido: true, mensaje: "" };
}

// ---------- Validación de correo ----------
function validarCorreo(correo, maxLength = 100) {
  if (!correo || typeof correo !== "string") {
    return { valido: false, mensaje: "El correo es obligatorio." };
  }

  const correoLimpio = correo.trim();

  if (correoLimpio.length > maxLength) {
    return { valido: false, mensaje: `El correo no puede superar los ${maxLength} caracteres.` };
  }

  // Regex ajustada para exigir caracteres válidos ANTES del @
  const dominiosPermitidos = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  if (!dominiosPermitidos.test(correoLimpio)) {
    return { valido: false, mensaje: "Solo se aceptan correos válidos de @duoc.cl, @profesor.duoc.cl o @gmail.com." };
  }

  return { valido: true, mensaje: "" };
}

// ---------- Validación de contraseña ----------
function validarPassword(password, { min = 4, max = 10, exigirComplejidad = false } = {}) {
  if (!password) {
    return { valido: false, mensaje: "La contraseña es obligatoria." };
  }
  if (password.length < min || password.length > max) {
    return { valido: false, mensaje: `La contraseña debe tener entre ${min} y ${max} caracteres.` };
  }
  if (exigirComplejidad) {
    if (!/[A-Z]/.test(password)) {
      return { valido: false, mensaje: "La contraseña debe incluir al menos una letra mayúscula." };
    }
    if (!/[0-9]/.test(password)) {
      return { valido: false, mensaje: "La contraseña debe incluir al menos un número." };
    }
  }
  return { valido: true, mensaje: "" };
}

// ---------- Helpers de UI ----------
function mostrarError(idCampo, mensaje) {
  const input = document.getElementById(idCampo);
  const error = document.getElementById(`error-${idCampo}`);
  if (!input || !error) return;

  if (mensaje) {
    input.classList.add("input-invalido");
    error.textContent = mensaje;
    error.style.display = "block";
  } else {
    input.classList.remove("input-invalido");
    error.textContent = "";
    error.style.display = "none";
  }
}