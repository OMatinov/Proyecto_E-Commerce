const CART_KEY = "tiendaUrbanoCart";

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  // product = { id, name, price, qty }
  const cart = getCart();
  const existente = cart.find(item => item.id === product.id);

  if (existente) {
    existente.qty += product.qty;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty); // nunca menos de 1
    saveCart(cart);
  }
}

function calcularSubtotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function calcularEnvio(subtotal, tipoDespacho = "estandar") {
  const UMBRAL_ENVIO_GRATIS = 44990; // según tu promo-bar en catalogo.html
  const COSTO_ENVIO_ESTANDAR = 3990;
  const COSTO_ENVIO_PREMIUM = 5990;

  if (tipoDespacho === "premium") {
    // El despacho premium (entrega el mismo día) siempre se cobra.
    return COSTO_ENVIO_PREMIUM;
  }

  // Despacho estándar: gratis si el subtotal supera el umbral de la promo.
  return subtotal >= UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO_ESTANDAR;
}

function calcularTotal(cart, tipoDespacho = "estandar") {
  const subtotal = calcularSubtotal(cart);
  const envio = calcularEnvio(subtotal, tipoDespacho);
  return {
    subtotal,
    envio,
    total: subtotal + envio
  };
}

// Formatear a pesos chilenos para mostrar en pantalla
function formatearCLP(numero) {
  return numero.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0
  });
}