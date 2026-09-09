function validarCampoCorreoLogin() {
      const valor = document.getElementById("correoLogin").value.trim();
      const resultado = validarCorreo(valor);
      mostrarError("correoLogin", resultado.valido ? "" : resultado.mensaje);
      return resultado.valido;
    }

    function validarCampoClaveLogin() {
      const valor = document.getElementById("claveLogin").value;
      const resultado = validarPassword(valor, { min: 4, max: 10 });
      mostrarError("claveLogin", resultado.valido ? "" : resultado.mensaje);
      return resultado.valido;
    }

    document.getElementById("correoLogin").addEventListener("blur", validarCampoCorreoLogin);
    document.getElementById("claveLogin").addEventListener("blur", validarCampoClaveLogin);

    document.getElementById("formLogin").addEventListener("submit", (evento) => {
      evento.preventDefault();

      const errorCredenciales = document.getElementById("error-credenciales");
      errorCredenciales.textContent = "";
      errorCredenciales.style.display = "none";

      const camposValidos = [
        validarCampoCorreoLogin(),
        validarCampoClaveLogin()
      ].every(Boolean);

      if (!camposValidos) return;

      const datosGuardados = localStorage.getItem("GRWU_Usuario");
      if (!datosGuardados) {
        errorCredenciales.textContent = "No existe ninguna cuenta registrada en este navegador. Regístrate primero.";
        errorCredenciales.style.display = "block";
        return;
      }

      const usuario = JSON.parse(datosGuardados);
      const correoIngresado = document.getElementById("correoLogin").value.trim();
      const claveIngresada = document.getElementById("claveLogin").value;

      if (correoIngresado.toLowerCase() !== usuario.correo.toLowerCase() || claveIngresada !== usuario.clave) {
        errorCredenciales.textContent = "Correo o contraseña incorrectos.";
        errorCredenciales.style.display = "block";
        return;
      }

      // Credenciales correctas: activamos la sesión (la cuenta ya estaba guardada)
      localStorage.setItem("GRWUSesionActiva", "1");
      window.location.href = "cuenta.html";
    });