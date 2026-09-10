# 🛍️ Get Ready With Us (GRWU) - E-Commerce de Moda Urbana

Proyecto de comercio electrónico especializado en moda urbana femenina y masculina, desarrollado con tecnologías web estándar (HTML5, CSS3, JavaScript Vanilla). Incluye panel administrativo completo con gestión de productos, usuarios, blogs y contactos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso](#-instalación-y-uso)
- [Panel Administrativo](#-panel-administrativo)
- [Módulos Principales](#-módulos-principales)
- [Configuración](#-configuración)
- [Base de Datos](#-base-de-datos)
- [Créditos](#-créditos)

---

## ✨ Características

### 👤 Para Clientes
- **Catálogo de productos** con filtros por categoría, género y talla
- **Ficha de producto** detallada con selección de tallas y stock en tiempo real
- **Carrito de compras** con persistencia en localStorage
- **Checkout completo** con cálculo de envíos y pago simulado
- **Sistema de usuarios** con registro, login y gestión de cuenta
- **Blog de moda** con artículos filtrables por categoría
- **Formulario de contacto** con validaciones
- **Diseño responsive** adaptado a móviles y desktop

### 🔐 Para Administradores
- **Dashboard** con estadísticas en tiempo real
- **Gestión de productos** (CRUD completo)
  - Crear, editar, eliminar productos
  - Control de stock por tallas (XS, S, M, L, XL, XXL)
  - Validación de códigos únicos
  - Categorías: abrigos, accesorios, poleras, polerones, pantalones, shorts, calzado, sueters
  - Géneros: mujer, hombre, unisex
- **Gestión de usuarios** con roles (Administrador, Vendedor, Cliente)
- **Moderación de blogs**
- **Bandeja de mensajes** de contacto

---

## 🚀 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| HTML5 | - | Estructura semántica |
| CSS3 | - | Estilos y diseño responsive |
| JavaScript Vanilla | ES6+ | Lógica del negocio |
| LocalStorage | - | Persistencia de datos (sin backend) |
| Google Fonts | - | Tipografías (Bebas Neue, Poppins) |

**No requiere frameworks ni librerías externas**

---

## 📁 Estructura del Proyecto

```
Proyecto_E-Commerce/
├── index.html                 # Página de inicio
├── catalogo.html              # Catálogo de productos
├── producto.html              # Ficha de producto individual
├── checkout.html              # Proceso de compra
├── compra-exitosa.html        # Confirmación de compra
├── login.html                 # Inicio de sesión
├── registro.html              # Registro de usuarios
├── cuenta.html                # Gestión de cuenta
├── nosotros.html              # Página sobre la empresa
├── blogs.html                 # Blog de moda
├── blogs-detalles.html        # Detalle de artículo de blog
├── contacto.html              # Formulario de contacto
├── recuperar-clave.html       # Recuperación de contraseña
│
├── admin/                     # Panel administrativo
│   ├── admin-index.html       # Dashboard
│   ├── admin-productos.html   # Gestión de productos
│   ├── admin-usuarios.html    # Gestión de usuarios
│   ├── admin-blogs.html       # Gestión de blogs
│   └── admin-contacto.html    # Mensajes de contacto
│
├── css/                       # Hojas de estilo
│   ├── styles.css             # Estilos globales
│   ├── index.css              # Estilos página de inicio
│   ├── catalogo.css           # Estilos catálogo
│   ├── producto.css           # Estilos ficha de producto
│   ├── checkout.css           # Estilos checkout
│   ├── contacto.css           # Estilos contacto
│   ├── nosotros.css           # Estilos nosotros
│   ├── blogs.css              # Estilos blog
│   ├── login.css              # Estilos login
│   └── admin.css              # Estilos panel admin
│
├── js/                        # Scripts JavaScript
│   ├── config.js              # Configuración centralizada
│   ├── productos-data.js      # Base de datos de productos (~100 productos)
│   ├── usuarios.js            # Base de datos de usuarios
│   ├── regiones.js            # Regiones y comunas de Chile
│   ├── cart.js                # Lógica del carrito
│   ├── catalogo.js            # Lógica del catálogo
│   ├── producto.js            # Lógica ficha de producto
│   ├── checkout.js            # Proceso de compra
│   ├── login.js               # Autenticación
│   ├── registro.js            # Registro de usuarios
│   ├── usuario-sesion.js      # Control de sesión
│   ├── validaciones.js        # Validaciones de formularios
│   ├── utils.js               # Utilidades generales
│   ├── header.js              # Header dinámico
│   ├── index.js               # Lógica página de inicio
│   ├── contacto.js            # Formulario de contacto
│   ├── blogs.js               # Filtros de blog
│   ├── blogs-detalles.js      # Detalle de blog
│   └── admin/                 # Scripts del panel administrativo
│       ├── admin-datos.js     # CRUD productos y usuarios
│       ├── admin-productos.js # Lógica gestión productos
│       ├── admin-usuarios.js  # Lógica gestión usuarios
│       ├── admin-blogs.js     # Lógica gestión blogs
│       ├── admin-contacto.js  # Lógica mensajes contacto
│       └── admin-rol.js       # Selector de roles
│
├── img/                       # Recursos gráficos
│   ├── logoGRWU.png
│   ├── banner.gif
│   ├── mujer/                 # Productos mujer
│   ├── hombre/                # Productos hombre
│   └── unisex/                # Productos unisex
│
└── README.md                  # Documentación
```

---

## 🛠️ Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (opcional, pero recomendado)

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   cd /workspace
   ```

2. **Abrir con servidor local** (recomendado)
   ```bash
   # Con Python
   python -m http.server 8000

   # Con Node.js (npx)
   npx http-server -p 8000
   ```

3. **Acceder al sitio**
   - Tienda: `http://localhost:8000/index.html`
   - Admin: `http://localhost:8000/admin/admin-index.html`

### Usuarios por Defecto

| Rol | Correo | RUN |
|-----|--------|-----|
| Administrador | katerine.soto@profesor.duoc.cl | 111111111 |
| Administrador | camila.olmedo@duoc.cl | 190110222 |
| Vendedor | matias.fuentes@duoc.cl | 172076920 |
| Vendedor | cesar.munoz@gmail.com | 888888888 |
| Cliente | javiera.contreras@gmail.com | 205558993 |

> **Nota:** Las contraseñas se establecen durante el registro y se almacenan en localStorage.

---

## 🔐 Panel Administrativo

### Acceso
1. Iniciar sesión con credenciales de Administrador o Vendedor
2. Navegar a `admin/admin-index.html`

### Funcionalidades

#### 📊 Dashboard
- Estadísticas de productos, usuarios, blogs y mensajes
- Alertas de stock crítico
- Actividad reciente
- Acciones rápidas

#### 👕 Gestión de Productos
- **Crear producto**: Formulario completo con validaciones
- **Editar producto**: Carga datos existentes, permite modificar todo
- **Eliminar producto**: Confirmación antes de borrar
- **Stock por tallas**: Distribución automática en XS, S, M, L, XL, XXL
- **Validación de código único**: Evita duplicados
- **Filtros**: Por categoría, género y búsqueda por nombre

#### 👤 Gestión de Usuarios
- CRUD completo de usuarios
- Asignación de roles (Administrador, Vendedor, Cliente)
- Validación de RUN chileno
- Selector de regiones y comunas de Chile

#### 📝 Gestión de Blogs
- Crear, editar y eliminar artículos
- Estados: Publicado / Borrador

#### 💬 Contactos
- Bandeja de mensajes recibidos
- Marcar como leídos/no leídos
- Eliminar mensajes

---

## 🧩 Módulos Principales

### Configuración Centralizada (`js/config.js`)
```javascript
STORAGE_KEYS      // Claves de localStorage
CONFIG_ENVIOS     // Costos y umbrales de envío
CONFIG_STOCK      // Stock por defecto y tallas
CONFIG_PAGINACION // Productos por página
FORMATOS          // Locale y moneda (CLP)
RUTAS             // Rutas del sitio
```

### Base de Datos de Productos (`js/productos-data.js`)
- ~100 productos organizados por categoría
- Stock gestionado por tallas
- Múltiples imágenes por producto
- Descripciones detalladas

### Carrito de Compras (`js/cart.js`)
- Agregar/remover productos
- Actualizar cantidades
- Calcular total con envío
- Persistencia en localStorage

### Checkout (`js/checkout.js`)
- Resumen de compra
- Selección de región y comuna
- Cálculo de envío (estándar $3.990 / premium $5.990)
- Envío gratis sobre $44.990
- Simulación de pago Webpay

### Autenticación (`js/login.js`, `js/registro.js`, `js/usuario-sesion.js`)
- Registro con validaciones
- Login verificado contra localStorage
- Control de sesión activa
- Roles de usuario

---

## ⚙️ Configuración

### Variables de Configuración (`js/config.js`)

```javascript
// Envíos
UMBRAL_ENVIO_GRATIS: 44990      // Gratis sobre este monto
COSTO_ENVIO_ESTANDAR: 3990      // Envío estándar
COSTO_ENVIO_PREMIUM: 5990       // Envío premium

// Stock
STOCK_POR_DEFECTO: 10           // Stock inicial
STOCK_MINIMO_AVISO: 5           // Mínimo para alerta
TALLAS_DISPONIBLES: ["XS", "S", "M", "L", "XL", "XXL"]

// Paginación
PRODUCTOS_POR_PAGINA: 12

// Moneda
LOCALE: "es-CL"
MONEDA: "CLP"
```

### Claves de LocalStorage

| Clave | Propósito |
|-------|-----------|
| `GRWU_Cart` | Carrito de compras |
| `GRWU_SesionActiva` | Estado de sesión |
| `GRWU_Usuario` | Usuario logueado |
| `GRWU_usuariosAdmin` | Base de datos usuarios |
| `GRWU_productosAdmin` | Base de datos productos |
| `GRWU_rolActivo` | Rol seleccionado |
| `GRWU_contactos` | Mensajes de contacto |

---

## 💾 Base de Datos

### Productos
Cada producto contiene:
```javascript
{
  id: string,              // Identificador único
  nombre: string,          // Nombre del producto
  categoria: string,       // abrigos, accesorios, poleras, etc.
  genero: string,          // mujer, hombre, unisex
  precio: number,          // Precio en CLP
  imagen: string,          // URL imagen principal
  imagenes: array,         // URLs de imágenes adicionales
  descripcion: string,     // Descripción detallada
  stock: object            // Stock por talla: {"S": 5, "M": 8, ...}
}
```

### Usuarios
Cada usuario contiene:
```javascript
{
  run: string,             // RUN sin puntos ni guión
  nombre: string,          // Nombre
  apellidos: string,       // Apellidos completos
  correo: string,          // Email único
  fechaNacimiento: string, // YYYY-MM-DD
  tipoUsuario: string,     // Administrador, Vendedor, Cliente
  region: string,          // Región de Chile
  comuna: string,          // Comuna
  direccion: string,       // Dirección completa
  telefono: string         // Teléfono con formato +56 9 XXXX XXXX
}
```

---

## 👥 Créditos

### Desarrolladores
- **Matías Fuentes** - Base de datos de productos, módulo de productos admin
- **Katerine Soto** - Panel administrativo, gestión de datos
- **César Muñoz** - Módulo de usuarios, autenticación
- **Camila Olmedo** - Dashboard, estadísticas
- **Javiera Contreras** - Colaboradora
- **Ignacio Reyes** - Colaborador

### Institución
**Duoc UC** - Proyecto académico de desarrollo web

### Año
© 2026 Get Ready With Us

---

## 📞 Contacto

- **Sitio web**: GRWU
- **Email**: contacto@grwu.cl (simulado)
- **Ubicación**: Chile

---

## 📝 Licencia

Proyecto académico desarrollado para fines educativos. Todos los derechos reservados.

---

<div align="center">

**Get Ready With Us** - Tu destino online para la moda urbana 🇨🇱

</div>
