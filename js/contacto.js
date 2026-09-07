const formularioContacto = document.getElementById("form-contacto");

if (formularioContacto) {
  const nombreInput = document.getElementById("nombre");
  const correoInput = document.getElementById("correo");
  const comentarioInput = document.getElementById("comentario");

  const errorNombre = document.getElementById("error-nombre");
  const errorCorreo = document.getElementById("error-correo");
  const errorComentario = document.getElementById("error-comentario");

  const contadorComentario = document.getElementById("contador-comentario");
  const mensajeExito = document.getElementById("form-success");

  const dominiosPermitidos = [
    "duoc.cl",
    "profesor.duoc.cl",
    "gmail.com"
  ];

  function mostrarError(input, elementoError, mensaje) {
    input.classList.add("input-error");
    input.classList.remove("input-valid");
    input.setAttribute("aria-invalid", "true");
    elementoError.textContent = mensaje;
  }

  function limpiarError(input, elementoError) {
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
    elementoError.textContent = "";
  }

  function marcarValido(input) {
    input.classList.remove("input-error");
    input.classList.add("input-valid");
    input.setAttribute("aria-invalid", "false");
  }

  function validarNombre() {
    const nombre = nombreInput.value.trim();

    if (nombre === "") {
      mostrarError(
        nombreInput,
        errorNombre,
        "Ingresa tu nombre completo."
      );
      return false;
    }

    if (nombre.length > 100) {
      mostrarError(
        nombreInput,
        errorNombre,
        "El nombre no puede superar los 100 caracteres."
      );
      return false;
    }

    limpiarError(nombreInput, errorNombre);
    marcarValido(nombreInput);
    return true;
  }

  function validarCorreo() {
    const correo = correoInput.value.trim().toLowerCase();

    if (correo === "") {
      limpiarError(correoInput, errorCorreo);
      correoInput.classList.remove("input-valid");
      return true;
    }

    if (correo.length > 100) {
      mostrarError(
        correoInput,
        errorCorreo,
        "El correo no puede superar los 100 caracteres."
      );
      return false;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
      mostrarError(
        correoInput,
        errorCorreo,
        "Ingresa un correo electrónico válido."
      );
      return false;
    }

    const dominioCorreo = correo.split("@")[1];

    if (!dominiosPermitidos.includes(dominioCorreo)) {
      mostrarError(
        correoInput,
        errorCorreo,
        "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
      );
      return false;
    }

    limpiarError(correoInput, errorCorreo);
    marcarValido(correoInput);
    return true;
  }

  function validarComentario() {
    const comentario = comentarioInput.value.trim();

    if (comentario === "") {
      mostrarError(
        comentarioInput,
        errorComentario,
        "Escribe un mensaje antes de enviarlo."
      );
      return false;
    }

    if (comentario.length > 500) {
      mostrarError(
        comentarioInput,
        errorComentario,
        "El mensaje no puede superar los 500 caracteres."
      );
      return false;
    }

    limpiarError(comentarioInput, errorComentario);
    marcarValido(comentarioInput);
    return true;
  }

  function actualizarContadorComentario() {
    const cantidadCaracteres = comentarioInput.value.length;

    contadorComentario.textContent = `${cantidadCaracteres} / 500`;

    if (cantidadCaracteres >= 450) {
      contadorComentario.classList.add("counter-limit");
    } else {
      contadorComentario.classList.remove("counter-limit");
    }
  }

  nombreInput.addEventListener("input", validarNombre);
  nombreInput.addEventListener("blur", validarNombre);

  correoInput.addEventListener("input", validarCorreo);
  correoInput.addEventListener("blur", validarCorreo);

  comentarioInput.addEventListener("input", () => {
    actualizarContadorComentario();

    if (comentarioInput.value.trim() !== "") {
      validarComentario();
    }
  });

  comentarioInput.addEventListener("blur", validarComentario);

  formularioContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const comentarioValido = validarComentario();

    if (!nombreValido || !correoValido || !comentarioValido) {
      mensajeExito.hidden = true;
      return;
    }

    mensajeExito.hidden = false;
    mensajeExito.textContent =
      "¡Mensaje enviado correctamente! Gracias por contactar a GRWU. Te responderemos lo antes posible.";

    formularioContacto.reset();

    nombreInput.classList.remove("input-valid");
    correoInput.classList.remove("input-valid");
    comentarioInput.classList.remove("input-valid");

    actualizarContadorComentario();
  });

  actualizarContadorComentario();
}