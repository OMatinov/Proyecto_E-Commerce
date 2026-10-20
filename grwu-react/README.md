# 🛍️ Get Ready With Us (GRWU) - E-Commerce de Moda Urbana

Proyecto de comercio electrónico especializado en moda urbana femenina y masculina. Originalmente desarrollado en tecnologías web estándar, esta versión representa la **migración completa a React**, incorporando enrutamiento, manejo de estados globales (Context API) y una suite de pruebas unitarias (Karma + Jasmine).

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso](#-instalación-y-uso)
- [Panel Administrativo](#-panel-administrativo)
- [Módulos Principales](#-módulos-principales)
- [Testing](#-testing)
- [Base de Datos](#-base-de-datos)
- [Créditos](#-créditos)

---

## ✨ Características

### 👤 Para Clientes
- **Catálogo de productos** con filtros por categoría, género y búsqueda en tiempo real.
- **Ficha de producto** detallada con selección de cantidad y stock en tiempo real.
- **Carrito de compras** global y persistente (`useReducer` + localStorage).
- **Checkout completo** con validación de RUT, cálculo de envíos y pago simulado.
- **Sistema de usuarios** con registro, inicio de sesión y control de sesión (`Context API`).
- **Blog de moda** con 9 artículos reales, filtros por categoría y sistema de compartir.
- **Formulario de contacto** con validaciones puras y contador de caracteres.
- **Diseño responsive** adaptado a móviles y desktop utilizando **Bootstrap 5**.

### 🔐 Para Administradores
- **Dashboard** con estadísticas dinámicas calculadas desde la base de datos.
- **Gestión de productos (CRUD)** y control de stock crítico.
- **Gestión de categorías** y **usuarios** con roles.
- **Gestión de Órdenes y Boletas**: Visualización de compras y generación de boletas.
- **Reportes**: Cálculo de ventas reales y top de productos más vendidos.
- **Moderación de blogs** y **Bandeja de mensajes** de contacto.

---

## 🚀 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.x | Librería principal de UI (Componentes) |
| Vite | 8.x | Entorno de desarrollo y empaquetado |
| React Router DOM | 7.x | Enrutamiento SPA (Single Page Application) |
| Bootstrap | 5.x | Framework CSS para diseño responsive |
| Context API | - | Manejo de estado global (Carrito y Sesión) |
| LocalStorage | - | Persistencia de datos simulada (sin backend) |
| Karma + Jasmine | - | Entorno de testing unitario |
| Testing Library | - | Pruebas de renderizado y eventos en componentes React |

---

## 📁 Estructura del Proyecto

```text
grwu-react/
├── public/                 # Imágenes, íconos y recursos estáticos
├── src/
│   ├── components/         # Componentes reutilizables (Layout, BlogCard, ProductCard, etc.)
│   ├── context/            # Contextos globales (CarritoContext, SesionContext, reducers)
│   ├── data/               # "Base de datos" simulada y funciones CRUD
│   ├── pages/              # Vistas públicas y panel de administración
│   ├── services/           # Lógica de servicios (ej. simulación de pago)
│   ├── styles/             # Hojas de estilo CSS
│   ├── tests/              # Pruebas unitarias (Jasmine/Karma)
│   ├── utils/              # Funciones puras (validaciones, formateos)
│   ├── App.jsx             # Definición de rutas principales
│   └── main.jsx            # Punto de entrada y Providers
├── karma.conf.cjs          # Configuración del entorno de pruebas
├── package.json            # Dependencias y scripts
└── vite.config.js          # Configuración de Vite
```

---

## 🛠️ Instalación y Uso

### Requisitos Previos
- Node.js (versión 18 o superior)
- npm 

### Pasos de Instalación

1. **Clonar el repositorio y entrar a la carpeta React**
   ```bash
   git clone https://github.com/OMatinov/Proyecto_E-Commerce
   ```
   ```bash
   cd grwu-react
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   *El sitio estará disponible en `http://localhost:5173/`*

### Usuarios por Defecto (Pruebas)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | katerine.soto@profesor.duoc.cl | 1234 |
| Administrador | camila.olmedo@duoc.cl | 1234 |
| Vendedor | matias.fuentes@duoc.cl | 1234 |
| Cliente | javiera.contreras@gmail.com | 1234 |

*(Las contraseñas por defecto son `1234` para facilitar las pruebas en la demo).*

---

## 🔐 Panel Administrativo

### Acceso
1. Iniciar sesión con credenciales de Administrador.
2. Navegar a la ruta `/admin` (o usar el botón de acceso en el perfil).

### Funcionalidades Principales
- **Dashboard**: Estadísticas de blogs, contactos, productos y ventas.
- **Productos**: Crear, editar y eliminar. Filtros por categoría y alertas de stock crítico.
- **Categorías**: CRUD completo.
- **Usuarios**: Gestión de roles (Administrador, Vendedor, Cliente) y validación de RUN.
- **Órdenes**: Historial de compras realizadas por los clientes.
- **Boletas**: Vista detallada de la compra con opción de imprimir.
- **Reportes**: Cálculo dinámico de ingresos y productos más vendidos.
- **Blogs y Contactos**: Moderación de artículos y bandeja de entrada de mensajes.

---

## 🧪 Testing

El proyecto incluye una suite de pruebas unitarias configurada con **Karma y Jasmine**, validando tanto la lógica de negocio pura como el renderizado de componentes React.

Para ejecutar las pruebas:
```bash
npm run test
```
*Se abrirá un navegador Chrome en modo invisible (Headless) y se ejecutarán todos los tests (`.spec.js` y `.spec.jsx`).*

---

## 💾 Base de Datos (Simulada en JS)

Los datos se almacenan en el navegador mediante `localStorage`, gestionados por archivos en `src/data/`.

### Estructura de Producto (`productosData.js`)
```javascript
{
  id: "p-001",
  nombre: "Polerón Oversize Negra",
  categoria: "polerones",
  genero: "unisex",
  precio: 24990,
  precioOriginal: 34990,
  oferta: 28, // %
  stock: 18,
  imagen: "public/img/mujer/poleron-negra.png"
}
```

### Estructura de Orden (`ordenesData.js`)
```javascript
{
  id: "ORD-20260001",
  cliente: { nombre, apellidos, correo },
  items: [{ id, nombre, precio, cantidad }],
  subtotal: 24990,
  envio: 0,
  total: 24990,
  estado: "pagada", // pagada, rechazada, enviada, etc.
  fecha: "2026-08-30T..."
}
```

---

## 👥 Créditos

### Desarrolladores
- **Matías** - Catálogo, Productos y Categorías.
- **César** - Usuarios, Autenticación, Carrito y Checkout.
- **Katerine** - Contenido (Blogs, Nosotros, Contacto), Panel Admin y Testing.

### Institución
**Duoc UC** - Proyecto académico de Desarrollo FullStack II.

### Año
© 2026 Get Ready With Us

---
<div align="center">
**Get Ready With Us** - Tu destino online para la moda urbana 🇨🇱
</div>






