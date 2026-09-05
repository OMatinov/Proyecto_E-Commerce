// rol-admin.js - Simulación del rol activo en el panel admin
// Autor: Katerine
//
// El login real (registro/inicio de sesión) todavía no crea una sesión con
// rol asociado, así que mientras tanto simulamos el rol activo guardándolo
// en localStorage. Esto permite mostrar en la presentación cómo cambia el
// panel según el rol, tal como pide el enunciado:
//   - Administrador: acceso total.
//   - Vendedor: solo puede ver productos y ordenes (no gestionar usuarios,
//     no crear/editar/eliminar).
//   - Cliente: no entra al panel admin (queda fuera de este archivo).
//
// Cuando el login real esté integrado, basta con reemplazar
// obtenerRolActivo() para que lea la sesión real en vez de localStorage;
// el resto del panel no debería cambiar.

const CLAVE_ROL_ACTIVO = "grwu_rolActivo";

function obtenerRolActivo() {
  return localStorage.getItem(CLAVE_ROL_ACTIVO) || "Administrador";
}

function establecerRolActivo(rol) {
  localStorage.setItem(CLAVE_ROL_ACTIVO, rol);
}

// Dibuja el selector de rol en el contenedor del sidebar y aplica las
// restricciones visuales correspondientes al rol activo.
function inicializarSelectorRol() {
  const contenedor = document.getElementById("selectorRolContenedor");
  if (!contenedor) return;

  const rolActual = obtenerRolActivo();
  contenedor.innerHTML =
    '<label for="selectorRol" class="selector-rol-label">Rol activo (simulado)</label>' +
    '<select id="selectorRol" class="selector-rol-select">' +
    '<option value="Administrador"' + (rolActual === "Administrador" ? " selected" : "") + '>Administrador</option>' +
    '<option value="Vendedor"' + (rolActual === "Vendedor" ? " selected" : "") + '>Vendedor</option>' +
    '</select>';

  document.getElementById("selectorRol").addEventListener("change", function (evento) {
    establecerRolActivo(evento.target.value);
    window.location.reload();
  });

  aplicarRestriccionesDeRol();
}

// Oculta el link a Usuarios y los botones marcados como "solo-admin"
// cuando el rol activo es Vendedor.
function aplicarRestriccionesDeRol() {
  const rol = obtenerRolActivo();
  if (rol !== "Vendedor") return;

  const linkUsuarios = document.getElementById("linkSidebarUsuarios");
  if (linkUsuarios) linkUsuarios.style.display = "none";

  document.querySelectorAll(".solo-admin").forEach(function (el) {
    el.style.display = "none";
  });
}

// Corta el render de la página de usuarios si el rol activo no tiene acceso.
// Se llama explícitamente desde admin-usuarios.html.
function protegerVistaUsuarios() {
  if (obtenerRolActivo() !== "Vendedor") return false;

  const main = document.querySelector(".admin-main");
  if (main) {
    main.innerHTML =
      '<div class="acceso-restringido">' +
      '<p>🔒 Acceso restringido</p>' +
      '<p>Tu rol actual (Vendedor) no tiene permiso para gestionar usuarios.</p>' +
      "</div>";
  }
  return true;
}

document.addEventListener("DOMContentLoaded", inicializarSelectorRol);