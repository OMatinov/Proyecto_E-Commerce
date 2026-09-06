// admin-usuarios.js - Mantenedor de usuarios
// Autor: Katerine
//
// Trabaja sobre datos-admin.js (localStorage sembrado desde usuarios.js) y
// reutiliza validarRun / validarCorreo / mostrarError de validaciones.js,
// además de REGIONES / conectarRegionComuna de regiones.js, para no
// duplicar lógica que ya construyó César.

const USUARIOS_POR_PAGINA = 10;

let estadoUsuarios = {
  busqueda: "",
  tipo: "todos",
  pagina: 1
};

function inicialesUsuario(usuario) {
  return (usuario.nombre || "?").trim().charAt(0).toUpperCase();
}

function claseBadgeRol(tipoUsuario) {
  if (tipoUsuario === "Administrador") return "badge-primario";
  if (tipoUsuario === "Vendedor") return "badge-oscuro";
  return "badge-gris";
}

function usuariosFiltrados() {
  let lista = cargarUsuariosAdmin();

  if (estadoUsuarios.tipo !== "todos") {
    lista = lista.filter(function (u) { return u.tipoUsuario === estadoUsuarios.tipo; });
  }
  if (estadoUsuarios.busqueda.trim() !== "") {
    const termino = estadoUsuarios.busqueda.trim().toLowerCase();
    lista = lista.filter(function (u) {
      return (
        u.nombre.toLowerCase().includes(termino) ||
        u.apellidos.toLowerCase().includes(termino) ||
        u.correo.toLowerCase().includes(termino) ||
        u.run.toLowerCase().includes(termino)
      );
    });
  }
  return lista;
}

function renderizarTablaUsuarios() {
  const todos = usuariosFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(todos.length / USUARIOS_POR_PAGINA));
  if (estadoUsuarios.pagina > totalPaginas) estadoUsuarios.pagina = totalPaginas;

  const inicio = (estadoUsuarios.pagina - 1) * USUARIOS_POR_PAGINA;
  const pagina = todos.slice(inicio, inicio + USUARIOS_POR_PAGINA);

  const cuerpo = document.getElementById("tablaUsuariosBody");

  if (pagina.length === 0) {
    cuerpo.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><p>📭 No hay usuarios</p>' +
      "<p>Prueba con otro filtro o crea un usuario nuevo.</p></div></td></tr>";
  } else {
    cuerpo.innerHTML = pagina.map(function (u) {
      const claseAvatar = u.tipoUsuario === "Administrador" ? "table-avatar" : "table-avatar table-avatar-gris";
      return (
        "<tr>" +
        '<td><div class="table-user">' +
        '<div class="' + claseAvatar + '">' + inicialesUsuario(u) + "</div>" +
        "<span>" + u.nombre + " " + u.apellidos + "</span>" +
        "</div></td>" +
        "<td>" + u.run + "</td>" +
        "<td>" + u.correo + "</td>" +
        '<td><span class="table-badge ' + claseBadgeRol(u.tipoUsuario) + '">' + u.tipoUsuario + "</span></td>" +
        "<td>" + u.comuna + "</td>" +
        '<td class="table-actions">' +
        '<button class="btn-icon btn-icon-edit" title="Editar" data-editar-run="' + u.run + '">✏️</button>' +
        '<button class="btn-icon btn-icon-delete" title="Eliminar" data-eliminar-run="' + u.run + '">🗑️</button>' +
        "</td>" +
        "</tr>"
      );
    }).join("");
  }

  document.getElementById("paginacionInfoUsuarios").textContent =
    "Mostrando " + pagina.length + " de " + todos.length + " usuarios";

  const contenedorBotones = document.getElementById("paginacionBotonesUsuarios");
  let botonesHtml = "";
  for (let i = 1; i <= totalPaginas; i++) {
    botonesHtml +=
      '<button class="page-btn' + (i === estadoUsuarios.pagina ? " page-btn-active" : "") +
      '" data-pagina-usuarios="' + i + '">' + i + "</button>";
  }
  contenedorBotones.innerHTML = botonesHtml;

  document.querySelectorAll("[data-pagina-usuarios]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      estadoUsuarios.pagina = parseInt(boton.dataset.paginaUsuarios, 10);
      renderizarTablaUsuarios();
    });
  });

  document.querySelectorAll("[data-editar-run]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirModalUsuario(boton.dataset.editarRun);
    });
  });

  document.querySelectorAll("[data-eliminar-run]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const run = boton.dataset.eliminarRun;
      if (confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
        eliminarUsuario(run);
        renderizarTablaUsuarios();
      }
    });
  });
}

// ---------- Modal ----------

function limpiarErroresFormularioUsuario() {
  [
    "runUsuario", "nombreUsuario", "apellidosUsuario", "correoUsuario",
    "tipoUsuarioSelect", "regionUsuario", "comunaUsuario", "direccionUsuario"
  ].forEach(function (idCampo) { mostrarError(idCampo, ""); });
}

function abrirModalUsuario(runExistente) {
  const formulario = document.getElementById("formUsuario");
  formulario.reset();
  limpiarErroresFormularioUsuario();

  const selectRegion = document.getElementById("regionUsuario");
  const selectComuna = document.getElementById("comunaUsuario");

  if (runExistente) {
    const usuario = obtenerUsuarioPorRun(runExistente);
    document.getElementById("tituloModalUsuario").textContent = "Editar usuario";
    document.getElementById("runOriginalEditando").value = usuario.run;
    document.getElementById("runUsuario").value = usuario.run;
    document.getElementById("nombreUsuario").value = usuario.nombre;
    document.getElementById("apellidosUsuario").value = usuario.apellidos;
    document.getElementById("correoUsuario").value = usuario.correo;
    document.getElementById("fechaNacimientoUsuario").value = usuario.fechaNacimiento || "";
    document.getElementById("tipoUsuarioSelect").value = usuario.tipoUsuario;
    document.getElementById("direccionUsuario").value = usuario.direccion;
    document.getElementById("telefonoUsuario").value = usuario.telefono || "";

    const indiceRegion = REGIONES.findIndex(function (r) { return r.nombre === usuario.region; });
    if (indiceRegion >= 0) {
      selectRegion.value = indiceRegion;
      poblarSelectComunas(selectComuna, indiceRegion);
      selectComuna.value = usuario.comuna;
    }
  } else {
    document.getElementById("tituloModalUsuario").textContent = "Nuevo usuario";
    document.getElementById("runOriginalEditando").value = "";
    poblarSelectComunas(selectComuna, "");
  }

  document.getElementById("modalUsuario").classList.add("active");
}

function cerrarModalUsuario() {
  document.getElementById("modalUsuario").classList.remove("active");
}

// ---------- Validación del formulario ----------

function validarRunUsuario() {
  const valor = document.getElementById("runUsuario").value;
  const resultado = validarRun(valor);
  mostrarError("runUsuario", resultado.valido ? "" : resultado.mensaje);
  return resultado.valido;
}

function validarNombreUsuario() {
  const valor = document.getElementById("nombreUsuario").value.trim();
  let mensaje = "";
  if (!valor) mensaje = "El nombre es obligatorio.";
  else if (valor.length > 50) mensaje = "El nombre no puede superar los 50 caracteres.";
  mostrarError("nombreUsuario", mensaje);
  return !mensaje;
}

function validarApellidosUsuario() {
  const valor = document.getElementById("apellidosUsuario").value.trim();
  let mensaje = "";
  if (!valor) mensaje = "Los apellidos son obligatorios.";
  else if (valor.length > 100) mensaje = "Los apellidos no pueden superar los 100 caracteres.";
  mostrarError("apellidosUsuario", mensaje);
  return !mensaje;
}

function validarCorreoUsuario() {
  const valor = document.getElementById("correoUsuario").value.trim();
  const resultado = validarCorreo(valor);
  mostrarError("correoUsuario", resultado.valido ? "" : resultado.mensaje);
  return resultado.valido;
}

function validarTipoUsuario() {
  const valor = document.getElementById("tipoUsuarioSelect").value;
  const mensaje = valor === "" ? "Selecciona un tipo de usuario." : "";
  mostrarError("tipoUsuarioSelect", mensaje);
  return !mensaje;
}

function validarRegionUsuario() {
  const valor = document.getElementById("regionUsuario").value;
  const mensaje = valor === "" ? "Selecciona una región." : "";
  mostrarError("regionUsuario", mensaje);
  return !mensaje;
}

function validarComunaUsuario() {
  const valor = document.getElementById("comunaUsuario").value;
  const mensaje = valor === "" ? "Selecciona una comuna." : "";
  mostrarError("comunaUsuario", mensaje);
  return !mensaje;
}

function validarDireccionUsuario() {
  const valor = document.getElementById("direccionUsuario").value.trim();
  let mensaje = "";
  if (!valor) mensaje = "La dirección es obligatoria.";
  else if (valor.length > 300) mensaje = "La dirección no puede superar los 300 caracteres.";
  mostrarError("direccionUsuario", mensaje);
  return !mensaje;
}

// ---------- Inicialización ----------

document.addEventListener("DOMContentLoaded", function () {
  // el Vendedor no tiene acceso a esta vista: se corta acá si corresponde
  if (protegerVistaUsuarios()) return;

  conectarRegionComuna(document.getElementById("regionUsuario"), document.getElementById("comunaUsuario"));

  renderizarTablaUsuarios();

  document.getElementById("buscarUsuario").addEventListener("input", function (evento) {
    estadoUsuarios.busqueda = evento.target.value;
    estadoUsuarios.pagina = 1;
    renderizarTablaUsuarios();
  });
  document.getElementById("filtroTipoUsuario").addEventListener("change", function (evento) {
    estadoUsuarios.tipo = evento.target.value;
    estadoUsuarios.pagina = 1;
    renderizarTablaUsuarios();
  });

  [
    ["runUsuario", validarRunUsuario],
    ["nombreUsuario", validarNombreUsuario],
    ["apellidosUsuario", validarApellidosUsuario],
    ["correoUsuario", validarCorreoUsuario],
    ["tipoUsuarioSelect", validarTipoUsuario],
    ["regionUsuario", validarRegionUsuario],
    ["comunaUsuario", validarComunaUsuario],
    ["direccionUsuario", validarDireccionUsuario]
  ].forEach(function (par) {
    const campo = document.getElementById(par[0]);
    campo.addEventListener("blur", par[1]);
    campo.addEventListener("change", par[1]);
  });

  document.getElementById("formUsuario").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const valido = [
      validarRunUsuario(), validarNombreUsuario(), validarApellidosUsuario(),
      validarCorreoUsuario(), validarTipoUsuario(), validarRegionUsuario(),
      validarComunaUsuario(), validarDireccionUsuario()
    ].every(Boolean);

    if (!valido) return;

    const selectRegion = document.getElementById("regionUsuario");
    const runNuevo = limpiarRun(document.getElementById("runUsuario").value);

    const usuario = {
      run: runNuevo,
      nombre: document.getElementById("nombreUsuario").value.trim(),
      apellidos: document.getElementById("apellidosUsuario").value.trim(),
      correo: document.getElementById("correoUsuario").value.trim(),
      fechaNacimiento: document.getElementById("fechaNacimientoUsuario").value,
      tipoUsuario: document.getElementById("tipoUsuarioSelect").value,
      region: REGIONES[Number(selectRegion.value)].nombre,
      comuna: document.getElementById("comunaUsuario").value,
      direccion: document.getElementById("direccionUsuario").value.trim(),
      telefono: document.getElementById("telefonoUsuario").value.trim()
    };

    // si estábamos editando y el RUN cambió, eliminamos el registro viejo
    const runOriginal = document.getElementById("runOriginalEditando").value;
    if (runOriginal && runOriginal !== runNuevo) {
      eliminarUsuario(runOriginal);
    }

    guardarUsuario(usuario);
    cerrarModalUsuario();
    renderizarTablaUsuarios();
  });
});