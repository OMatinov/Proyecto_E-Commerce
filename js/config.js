// config.js - Configuración centralizada del proyecto GRWU
// Este archivo centraliza constantes, claves de localStorage y configuraciones globales

// ==================== CLAVES DE LOCALSTORAGE ====================
const STORAGE_KEYS = {
  CARRITO: "GRWU_Cart",
  SESION_ACTIVA: "GRWUSesionActiva",
  USUARIO_ACTIVO: "GRWU_Usuario",
  USUARIOS_ADMIN: "GRWU_usuariosAdmin",
  PRODUCTOS_ADMIN: "GRWU_productosAdmin",
  ROL_ACTIVO: "GRWU_rolActivo",
  CONTACTOS: "GRWU_contactos"
};

// ==================== CONFIGURACIÓN DE PRECIOS Y ENVÍOS ====================
const CONFIG_ENVIOS = {
  UMBRAL_ENVIO_GRATIS: 44990,      // Envío gratis desde este monto
  COSTO_ENVIO_ESTANDAR: 3990,       // Costo envío estándar
  COSTO_ENVIO_PREMIUM: 5990,        // Costo envío premium (mismo día)
  TIEMPO_DESPACHO: "24-48 hrs"      // Tiempo estimado de despacho
};

// ==================== CONFIGURACIÓN DE STOCK ====================
const CONFIG_STOCK = {
  STOCK_POR_DEFECTO: 10,           // Stock inicial por producto si no se especifica
  STOCK_MINIMO_AVISO: 5,           // Stock mínimo para mostrar aviso
  TALLAS_DISPONIBLES: ["XS", "S", "M", "L", "XL", "XXL"]
};

// ==================== CONFIGURACIÓN DE PAGINACIÓN ====================
const CONFIG_PAGINACION = {
  PRODUCTOS_POR_PAGINA: 12
};

// ==================== FORMATOS Y UTILIDADES ====================
const FORMATOS = {
  LOCALE: "es-CL",                 // Locale para formato de moneda
  MONEDA: "CLP"                    // Tipo de moneda
};

// ==================== RUTAS ====================
const RUTAS = {
  INDEX: "index.html",
  CATALOGO: "catalogo.html",
  PRODUCTO: "producto.html",
  CHECKOUT: "checkout.html",
  LOGIN: "login.html",
  REGISTRO: "registro.html",
  CUENTA: "cuenta.html",
  ADMIN_INDEX: "admin/admin-index.html"
};

// ==================== UTILIDAD PARA FORMATEAR PRECIOS ====================
/**
 * Formatea un número a pesos chilenos (CLP)
 * @param {number} numero - El número a formatear
 * @returns {string} - El número formateado como moneda chilena
 */
function formatoPrecioCLP(numero) {
  return "$" + Number(numero).toLocaleString(FORMATOS.LOCALE);
}

// Exportar para uso en otros módulos (si se usa con ES6 modules en el futuro)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEYS,
    CONFIG_ENVIOS,
    CONFIG_STOCK,
    CONFIG_PAGINACION,
    FORMATOS,
    RUTAS,
    formatoPrecioCLP
  };
}
