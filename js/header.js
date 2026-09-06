// header.js
// Lógica común del header en TODAS las páginas de la tienda:
//   1) Muestra la cantidad de productos en el carrito.
//   2) Cambia "Iniciar sesión" por "Cerrar sesión" si hay una cuenta guardada.
//   3) Marca automáticamente el link del menú que corresponde a la página actual.
//
// Requiere que js/cart.js esté cargado ANTES que este archivo.

document.addEventListener("DOMContentLoaded", function () {
  // ---------- Contador del carrito ----------
  const contadorCarrito = document.getElementById("cart-count");
  if (contadorCarrito && typeof getCart === "function") {
    const cart = getCart();
    contadorCarrito.textContent = cart.reduce(function (total, item) {
      return total + item.qty;
    }, 0);
  }

  // ---------- Iniciar sesión / Cerrar sesión ----------
  const linkSesion = document.getElementById("linkSesion");
  const hayUsuario = localStorage.getItem("tiendaUrbanoUsuario");

  if (linkSesion && hayUsuario) {
    linkSesion.textContent = "Cerrar sesión";
    linkSesion.setAttribute("href", "#");
    linkSesion.addEventListener("click", function (evento) {
      evento.preventDefault();
      localStorage.removeItem("tiendaUrbanoUsuario");
      window.location.href = "index.html";
    });
  }

  // ---------- Link activo del menú ----------
  const rutaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav .nav-link").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === rutaActual) {
      link.classList.add("nav-link-active");
    } else {
      link.classList.remove("nav-link-active");
    }
  });
});
