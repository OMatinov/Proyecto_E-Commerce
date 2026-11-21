# CONTEXTO_EQUIPO_EV3.md

**Proyecto:** GRWU — Get Ready With Us (e-commerce de moda urbana)
**Asignatura:** DSY1104 Desarrollo FullStack II — Duoc UC
**Evaluación:** Parcial 3 (40 % de la asignatura) — "Integrando backend y frontend a la tienda online"
**Equipo:** Matías, César y Katerine
**Versión del documento:** 2.0
**Fecha:** 17/11/2026
**Estado:** contexto oficial del equipo para la EV3. Reemplaza el borrador V1.0.

---

## Cómo usar este documento

Este archivo está pensado para **pegarlo completo en cualquier chat de IA** (ChatGPT, Claude, Gemini, Copilot, Cursor, OpenCode) y obtener respuestas alineadas con el proyecto. También sirve como documento de estudio para la defensa oral.

**Instrucciones para la IA que reciba este documento:**

1. Léelo completo antes de responder. No inventes endpoints, modelos, roles ni decisiones que no estén aquí.
2. Si algo no está definido, dilo y propón opciones; no lo des por hecho.
3. No generes código sin explicarlo. El equipo debe poder defender cada línea.
4. Respeta la propiedad de archivos por integrante (sección 12). Si un cambio toca a otra persona, avísalo.
5. Usa español para la interfaz, los mensajes y la documentación; inglés solo para términos técnicos.
6. Antes de proponer un cambio de arquitectura, revisa las decisiones aprobadas (sección 5). No las reabras sin justificación.
7. Cuando entregues código, incluye: qué hace, por qué, cómo se prueba y qué preguntas podrían hacer en la defensa.
8. No propongas simulaciones, datos falsos ni `localStorage` como base de datos. La EV3 se evalúa con backend y MySQL reales.
9. Si el usuario pide algo que contradice las PAUTAS o este documento, adviértele antes de ejecutar.
10. Prioriza que el equipo **entienda** por sobre que el código "funcione".

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [La evaluación EV3](#2-la-evaluación-ev3)
3. [De dónde venimos](#3-de-dónde-venimos)
4. [Estado actual del código (EV2)](#4-estado-actual-del-código-ev2)
5. [Decisiones aprobadas](#5-decisiones-aprobadas)
6. [Arquitectura objetivo](#6-arquitectura-objetivo)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Contrato de API v1.0](#8-contrato-de-api-v10)
9. [Seguridad y sesión](#9-seguridad-y-sesión)
10. [Reglas de negocio](#10-reglas-de-negocio)
11. [Matriz de roles y accesos](#11-matriz-de-roles-y-accesos)
12. [Reparto de trabajo](#12-reparto-de-trabajo)
13. [Flujo Git y entrega](#13-flujo-git-y-entrega)
14. [Documentos y anexos](#14-documentos-y-anexos)
15. [Plan de pruebas](#15-plan-de-pruebas)
16. [Checklist final](#16-checklist-final)
17. [Riesgos y trampas](#17-riesgos-y-trampas)
18. [Preguntas de defensa oral](#18-preguntas-de-defensa-oral)
19. [Glosario](#19-glosario)
20. [Anexo A - Inventario del frontend actual](#anexo-a---inventario-del-frontend-actual)

---

## 1. Resumen ejecutivo

GRWU es una tienda online de ropa urbana unisex. La EV1 fue un sitio con HTML, CSS y JavaScript puro. La EV2 lo migró a **React + Vite + Bootstrap**, con React Router, Context API, pruebas con Karma/Jasmine y **toda la persistencia en `localStorage`**. La EV3 debe reemplazar esa persistencia por un **backend real con Spring Boot y MySQL**, integrarlo con el frontend mediante una **API REST versionada y documentada en Swagger**, y agregar **autenticación con roles y JWT**, **sesión persistente y segura** y **restricciones de acceso por rol**.

**Lo que se entrega:**

- Frontend React existente, migrado de `localStorage` a API REST.
- Tres microservicios Spring Boot: `ms-usuarios` (8081), `ms-catalogo` (8082) y `ms-boletas` (8083).
- Una base MySQL con un esquema por servicio.
- Swagger en cada servicio.
- Login con JWT, refresh token, BCrypt y roles `Administrador`, `Vendedor`, `Cliente`.
- Guards de ruta y menú por rol en el frontend.
- Documentos: ERS V3, Anexo 2 (APIs e Integración), Anexo 3 (planilla Excel), Anexo 4 (Manual de usuario), informe de pruebas y presentación.

**La verdad incómoda:** el 60 % de la nota es una **presentación individual**. No basta con que el sistema funcione; cada integrante debe poder explicar el backend, la API, la integración, JWT, la sesión y las restricciones de punta a punta. Por eso este documento insiste en entender, no solo en entregar.

---

## 2. La evaluación EV3

### 2.1 Datos oficiales

| Dato | Valor |
|---|---|
| Asignatura | DSY1104 Desarrollo FullStack II |
| Evaluación | Parcial 3 |
| Ponderación en la asignatura | 40 % |
| Tiempo | 1 semana |
| Equipo | Máximo 3 estudiantes |
| Situación evaluativa 1 | Entrega por encargo, **grupal**, 40 % de la evaluación |
| Situación evaluativa 2 | Presentación, **individual**, 60 % de la evaluación |
| Presentación | 15 minutos por equipo + 5 minutos de preguntas abiertas |
| Objetivo | Integrar backend Spring Boot + base de datos con el frontend, API REST, seguridad y sesión |

### 2.2 Qué evalúa la rúbrica (pesos exactos)

**Situación 1 — Encargo grupal (40 %):**

| Indicador | Qué evalúa | Peso |
|---|---|---:|
| IE3.1.1 | Backend con conexión a BD, lógica de negocio y modelos según el cliente | 8 % |
| IE3.2.1 | API REST con CRUD completo documentado en Swagger | 8 % |
| IE3.2.2 | Integración backend–frontend mediante API REST | 6 % |
| IE3.3.1 | Autenticación en backend con roles y JWT | 6 % |
| IE3.3.2 | Sesión en frontend, persistente y segura | 6 % |
| IE3.3.3 | Restricciones de acceso en frontend | 6 % |

**Situación 2 — Presentación individual (60 %):**

| Indicador | Qué evalúa | Peso |
|---|---|---:|
| IE3.1.2 | Describir el backend, la lógica de negocio y los modelos | 12 % |
| IE3.2.3 | Explicar la API REST, el CRUD y Swagger | 12 % |
| IE3.2.4 | Justificar la integración y el flujo de datos | 10 % |
| IE3.3.4 | Describir autenticación con roles y JWT | 10 % |
| IE3.3.5 | Exponer la gestión de sesiones en el frontend | 8 % |
| IE3.3.6 | Explicar las restricciones de acceso en el frontend | 8 % |

**Niveles de logro:** 100 % (muy buen desempeño), 80 % (buen desempeño), 60 % (aceptable), 30 % (incipiente), 0 % (no logrado).

**Alerta importante:** en IE3.2.1, IE3.3.1, IE3.3.2 (en parte) e IE3.3.5 la rúbrica tiene niveles **"NO APLICA"**. Eso significa que no hay término medio: o está completo y funcionando, o se cae directo al 60 %. No se puede entregar "la mitad" de esos indicadores.

### 2.3 Entregables oficiales

Según el Anexo 1 y la hoja del estudiante:

- Enlace GitHub público del proyecto frontend.
- Enlace GitHub público del proyecto backend.
- Proyecto frontend comprimido (`grwu-react/`).
- Proyecto backend comprimido (`backend/`).
- Documento ERS terminado.
- Manual de usuario con pantallazos detallados.
- Documentación de APIs.
- Documento de APIs e Integración (modelo de la base de datos, endpoints usados, pruebas y resultado de la comunicación).

> **Ojo con la diferencia entre documentos.** El Anexo 1 (instrucciones generales) exige **todos** los entregables de la lista: ERS, manual de usuario, documentación de APIs, documento de APIs e Integración, enlaces y comprimidos. La hoja resumida del estudiante solo nombra el manual de usuario y el documento de APIs e Integración. Para no arriesgar nota, el equipo entrega **la lista completa del Anexo 1**; si sobra tiempo o el docente aclara que algunos no aplican, se ajusta. No se elimina ninguno por iniciativa propia.

**Contingencia por el formato de repositorio:** la PAUTA pide dos enlaces (frontend y backend), pero la decisión del equipo es un **monorepo**. Se entrega el enlace del monorepo y se explica en el README que el frontend está en `grwu-react/` y el backend en `/backend/`. Si el docente exige dos enlaces separados, se crea al momento de la entrega un repo espejo solo con `/backend/` y se entregan ambos enlaces. **Confirmar esto con el docente antes de la entrega.**

### 2.4 Roles definidos por la PAUTA

- **Administrador:** acceso total al sistema.
- **Vendedor:** solo puede visualizar la lista de productos y su detalle, y la lista de órdenes y su detalle. **Todos los demás accesos no deben aparecer en su vista.**
- **Cliente:** solo puede acceder a la tienda.

### 2.5 Modelo de base de datos propuesto por el docente (Figura 1)

Tablas: **USUARIO, BOLETA, DETALLE_BOLETA, PRODUCTO, CATEGORIA**.

Relaciones:

- Un usuario tiene muchas boletas.
- Una boleta tiene muchos detalles de boleta.
- Un producto aparece en muchos detalles de boleta.
- Una categoría agrupa muchos productos.

El modelo de la sección 7 respeta esas cinco tablas. Se agregan columnas de apoyo (por ejemplo `activo`, datos de dirección en la boleta y snapshot de producto en el detalle), pero no se inventan tablas fuera del modelo.

---

## 3. De dónde venimos

### 3.1 Historia del proyecto

| Etapa | Qué se hizo |
|---|---|
| EV1 | Sitio de ropa con HTML, CSS y JavaScript puro. Paleta crema `#E7D8CA`, casi negro `#220707`, vino `#531C22` y taupe `#AC9185`. Tipografías Bebas Neue y Poppins. |
| EV2 | Migración a React + Vite + Bootstrap. React Router, Context API, carrito con `useReducer`, pruebas con Karma + Jasmine + Testing Library, datos en `localStorage`. |
| EV3 | Reemplazar `localStorage` por backend Spring Boot + MySQL, API REST, JWT, roles, sesión segura y Swagger. |

### 3.2 Lecciones de la EV2 (no repetir)

1. Se presentó una demo que **simulaba** Karma/Jasmine en vez de mostrar las pruebas corriendo.
2. Personas distintas a la responsable hicieron el testing, aunque estaba asignado.
3. Se modificó código minutos antes de la presentación, cuando ya se había enviado.
4. La sesión se resolvía en el navegador con el RUN y contraseña en texto plano.

**Reglas que existen para evitar esto:** una rama por persona, PR revisado, congelamiento de código, tag de entrega, demo real y cada uno explica lo suyo.

---

## 4. Estado actual del código (EV2)

> Esta sección describe el código **real** que existe hoy. Sirve como línea base y como evidencia de las brechas. No es la arquitectura objetivo.

### 4.1 Stack y estructura actual

- React 19, Vite 8, React Router 7, Bootstrap 5, Chart.js, `canvas-confetti`.
- Pruebas: Karma + Jasmine + Testing Library + `babel-plugin-istanbul`.
- Sin Axios, sin `fetch`, sin backend y sin base de datos.
- El frontend vive en `grwu-react/`, dentro del monorepo; no se mueve.
- Scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm test` (queda observando), `npm run test:coverage` (una corrida con cobertura).
- Diseño vigente: primario `#4B1D5A`, secundario `#244FA4`, acento `#02756D`, fondo `#F7F7F7`, texto `#333333`; fuentes **Bebas Neue** y **Poppins**. Solo se importan `grwu-react/src/styles/styles.css`, `home.css`, `catalogo.css` y `admin.css`; el resto de `grwu-react/src/styles` no se usa ni se edita. La paleta crema/vino de la EV1 es solo historia y no se usa.

### 4.2 Datos y persistencia actual

Todo pasa por `grwu-react/src/data/storage.js` y estas claves de `localStorage` (estado EV2):

| Clave | Contenido | Módulo |
|---|---|---|
| `grwu_usuarios` | Usuarios | `usuariosData.js` |
| `grwu_productos` | Productos | `productosData.js` |
| `grwu_categorias` | Categorías | `categoriasData.js` |
| `grwu_ordenes` | Órdenes/boletas | `ordenesData.js` |
| `GRWU_Cart` | Carrito | `carritoData.js` |
| `GRWU_Sesion` | Solo el RUN del usuario con sesión | `SesionContext.jsx` |

> En la EV3 las claves de negocio (`grwu_usuarios`, `grwu_productos`, `grwu_categorias`, `grwu_ordenes`) desaparecen y pasan a la API. `localStorage` queda solo para el refresh token, preferencias no sensibles, `GRWU_Cart`, `grwu_blogs` y `grwu_contactos`.

### 4.3 Volumen de datos actual

| Dato | Cantidad |
|---|---:|
| Productos | 102 (`p-001` a `p-102`) |
| Productos en oferta (`oferta > 0`) | 34 |
| Productos con stock crítico (≤ 5) | 5 |
| Categorías | 13 (2 de género + 11 de prenda) |
| Usuarios semilla | 6 |
| Tests | 168 ejecutadas en 23 archivos `.spec` (informe de cobertura EV2) |
| Tests de `RecuperarClave` | 8 |

**Usuarios semilla:** 6, todos con contraseña `1234` en texto plano. Roles: 2 Administrador, 2 Vendedor, 2 Cliente. Los nombres son datos de prueba; no confundirlos con la identidad real del equipo.

**Cobertura reportada en EV2:** 71,7 % líneas, 62,0 % funciones, 70,1 % sentencias, 60,8 % ramas (Karma/Istanbul, 168 tests). Es la línea base, no la meta final.

### 4.4 Forma de los datos actuales

**Usuario:**

```js
{
  run, nombre, apellidos, correo, clave, fechaNacimiento,
  tipoUsuario, // "Administrador" | "Vendedor" | "Cliente"
  region, comuna, direccion, telefono
}
```

**Producto:**

```js
{
  id: "p-001",
  nombre, descripcion,
  precio,          // precio final en CLP
  precioOriginal,  // precio base; 0 si no hay oferta
  oferta,          // porcentaje entero: 0, 10, 15, 20, 25, 30, 40
  categoria,       // slug: "polerones", "abrigos", ...
  genero,          // "hombre" | "mujer" | "unisex"
  stock,
  imagen,
  imagenes: []     // imágenes adicionales
}
```

**Categoría:**

```js
{
  id: "c-001" | "c-g-hombre" | "c-g-mujer",
  slug: "polerones" | "hombre" | "mujer",
  nombre, descripcion, imagen,
  genero // "todos" en las de género; ausente en las de prenda
}
```

**Orden/boleta:**

```js
{
  id: "ORD-20260001",
  numero: 20260001,
  fecha: "2026-08-30T...",
  usuarioRun: "205558993" | null,
  cliente: "Nombre Apellidos",   // string en el código actual
  direccion: "Calle 123, Comuna, Región", // string en el código actual
  items: [{ id, nombre, precio, imagen, qty }],
  subtotal, envio, total,
  despacho: "estandar" | "premium",
  metodoPago: "credito" | "debito" | "transferencia",
  estado: "pagada" | "rechazada" | "enviada" | "entregada" | "cancelada"
}
```

> **Ojo:** el README muestra `cliente` como objeto, pero el código real lo guarda como string. La API usará datos estructurados y el adaptador del frontend los aplanará para no reescribir todas las vistas.

### 4.5 Rutas actuales del frontend

**Tienda:**

`/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:slug`, `/ofertas`, `/carrito`, `/checkout`, `/pago-correcto/:id`, `/pago-error/:id`, `/registro`, `/login`, `/recuperar-clave`, `/nosotros`, `/blogs`, `/blogs/:id`, `/contacto`, `*`.

**Panel admin (todas bajo `/admin`, sin protección real):**

`/admin`, `/admin/ordenes`, `/admin/ordenes/:id`, `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id/editar`, `/admin/productos/criticos`, `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/:id/editar`, `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/:id/editar`, `/admin/usuarios/:id/historial`, `/admin/reportes`, `/admin/perfil`, `/admin/blogs`, `/admin/contactos`.

### 4.6 Reglas de negocio ya existentes en el frontend

- Envío gratis desde `$44.990`.
- Envío estándar `$3.990`; envío premium `$5.990` (el premium se cobra siempre).
- Pasarela simulada en `grwu-react/src/services/pago.js`: rechaza montos sobre `$100.000` y aproximadamente 10 % de las transacciones al azar.
- La orden se crea con estado `pagada` o `rechazada` según el resultado del pago.
- El carrito nunca baja la cantidad de 1; para eliminar se usa `quitarItem`.
- Los totales se calculan en el frontend con `calcularSubtotal`, `calcularEnvio` y `calcularTotal`.

### 4.7 Validaciones actuales

| Validación | Regla actual |
|---|---|
| RUN | Limpia puntos y guion; 7–9 caracteres; módulo 11; DV `0`–`9` o `K` |
| Correo | Solo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`; máximo 100 caracteres |
| Contraseña | Entre 4 y 10 caracteres; complejidad opcional (mayúscula y número) |
| Teléfono | `^[+\d][\d\s-]{6,14}$` (ej. `+56 9 1234 5678`) |
| Login | Correo y contraseña obligatorios |
| Producto | Campos obligatorios, precio y stock numéricos |
| Categoría | Nombre y slug obligatorios |

### 4.8 Brechas verificadas frente a la EV3

1. **No existe ninguna llamada `fetch` ni Axios.** Todo se lee y escribe en `localStorage`.
2. **El panel `/admin` no está protegido.** Ninguna ruta ni layout revisa sesión o rol; cualquiera que escriba la URL entra.
3. **El Vendedor no tiene vista restringida.** El menú de `AdminLayout` es fijo y muestra todo. Además, el login solo manda a `/admin` a los Administradores; los Vendedores van a la tienda.
4. **La sesión no usa JWT.** Se guarda solo el RUN en `GRWU_Sesion`; la contraseña se compara en el navegador y los usuarios semilla tienen `1234` en texto plano.
5. **El modelo no coincide con la Figura 1.** Las órdenes llevan los ítems embebidos (se necesitan BOLETA y DETALLE_BOLETA), el producto referencia la categoría por slug y el usuario se identifica por RUN.
6. **Blogs y Contactos existen solo en el frontend** y no están en el modelo del docente.
7. **Inconsistencia `qty` vs `cantidad`.** El carrito y las órdenes usan `qty`; `AdminBoleta.jsx` lee `prod.cantidad`, por lo que la cantidad y el subtotal de la boleta se muestran mal. La decisión D4 lo corrige con un adaptador.
8. **`/recuperar-clave` sigue existiendo** con su página, su enlace en Login, 8 tests y el RF-18 en el ERS. La EV3 lo elimina.

---

## 5. Decisiones aprobadas

> Estas 11 decisiones están **cerradas**. No se reabren sin una conversación del equipo y una actualización de este documento. Cada una indica qué implica y cómo se demuestra en la defensa.

### D1 — Monorepo con tres microservicios y sin API Gateway

- Un solo repositorio: frontend React en `grwu-react/` (no se mueve) y backend en `/backend/`, al lado.
- Tres servicios independientes: `ms-usuarios` (8081), `ms-catalogo` (8082), `ms-boletas` (8083).
- **Sin API Gateway.** El frontend llama directo a cada servicio; en desarrollo usa el proxy de Vite.
- Blogs y Contactos quedan fuera del backend.

**Por qué:** menos piezas, menos configuración, cada servicio se levanta y se documenta por separado, y el equipo puede explicar el flujo completo sin un componente extra que nadie domina. **Cómo se demuestra:** abrir los tres Swagger y mostrar que cada uno responde en su puerto.

### D2 — Stack del backend

- Java 21, Spring Boot 3, Maven, Spring Data JPA, MySQL.
- Una base de datos por servicio (tres esquemas).
- Spring Security + JWT con clave compartida, expiración y refresh.
- BCrypt para contraseñas.
- Swagger/OpenAPI con springdoc.
- JUnit 5 + Mockito.

**Por qué:** es el stack pedido por la PAUTA y el más documentado. **Cómo se demuestra:** `./mvnw test`, Swagger y una consulta directa a MySQL.

### D3 — Stack del frontend e integración

- Axios con rutas relativas `/api/v1/...`.
- Proxy de Vite hacia 8081, 8082 y 8083.
- Servicios en `grwu-react/src/services/`; los componentes no llaman Axios directo.
- Pruebas con `npm run test:coverage`.

**Por qué:** rutas relativas evitan hardcodear puertos y el proxy evita CORS en desarrollo. **Cómo se demuestra:** abrir DevTools, ver la llamada a `/api/v1/productos` y comprobar que el proxy la envía a 8082.

### D4 — Modelos e identificadores

- Se mantienen `p-001`, `c-001`, `ORD-2026...` y el RUN como identificador de usuario.
- La API usa `cantidad` en los ítems de boleta.
- Un adaptador convierte `qty` (carrito) ↔ `cantidad` (API).

**Por qué:** preserva los datos y tests existentes y corrige el bug real de `AdminBoleta`. **Cómo se demuestra:** crear una boleta con 2 unidades y ver `cantidad: 2` en Swagger y en la respuesta de la API.

### D5 — Regla de compra

- Un visitante puede navegar el catálogo y usar el carrito sin cuenta.
- Para **pagar en el Checkout** debe haber una sesión de **Cliente**.

**Por qué:** baja la fricción de compra y, al mismo tiempo, asegura que la boleta quede asociada a un usuario real. **Cómo se demuestra:** intentar pagar sin sesión → redirección a `/login`; con sesión de Cliente → boleta creada.

### D6 — Pasarela de pago en `ms-boletas`

- La simulación se mueve del frontend (`grwu-react/src/services/pago.js`) al backend.
- Rechaza montos superiores a `$100.000`.
- Probabilidad de rechazo configurable (por defecto `0.10`).
- Endpoint de reintento para boletas rechazadas.
- Se declara explícitamente que es **simulada**.

**Por qué:** el backend debe ser la autoridad del pago y del estado de la boleta. **Cómo se demuestra:** crear una boleta sobre `$100.000`, ver el rechazo y reintentar.

### D7 — Limpieza de la EV2

- Se elimina `/recuperar-clave`, su enlace en Login, su página, sus 8 tests y el RF-18 del ERS.
- Se reemplaza `localStorage` como base de datos por la API REST.
- Solo se conserva en `localStorage` el refresh token, preferencias no sensibles, el carrito (`GRWU_Cart`), los blogs (`grwu_blogs`) y los contactos (`grwu_contactos`). Usuarios, productos, categorías y boletas pasan a la API.

**Por qué:** "recuperar contraseña" no está en el alcance de la EV3 y distrae de los indicadores; la persistencia local ya no corresponde. **Cómo se demuestra:** `grep` de `recuperar-clave` sin resultados y Login sin el enlace.

### D8 — Roles, guards y menú

- Guards de ruta y menú por rol.
- `Administrador`: acceso total.
- `Vendedor`: solo `/admin/productos` y `/admin/ordenes`, en modo lectura; aterriza en `/admin/productos`.
- `Cliente`: redirigido fuera de `/admin`.
- Backend responde **401** sin token y **403** con rol insuficiente.

**Por qué:** es un indicador explícito de la rúbrica (IE3.3.3 / IE3.3.6) y una exigencia de la PAUTA. **Cómo se demuestra:** iniciar sesión con cada rol y probar URL directa, menú y botones.

### D9 — El backend es la autoridad

- Recalcula subtotales, envío y total.
- Valida y descuenta stock.
- Repite las validaciones del frontend: RUN módulo 11, dominios de correo, contraseña 4–10, campos obligatorios.
- Ignora precios, totales y roles enviados por el cliente.

**Por qué:** evita manipulación desde DevTools y demuestra lógica de negocio real (IE3.1.1 / IE3.1.2). **Cómo se demuestra:** alterar el precio en la request con Postman y ver que el total no cambia.

### D10 — Flujo Git

- Un solo repositorio.
- Una rama por integrante.
- Pull requests revisados por otro integrante.
- Congelamiento del frontend antes de la entrega.
- Tag de entrega.

**Por qué:** la PAUTA evalúa colaboración y el docente pregunta por los cambios en GitHub. **Cómo se demuestra:** historial de commits con autoría real, PRs mergeados y tag `ev3-entrega-1.0`.

### D11 — Asignación final

| Integrante | Backend | Frontend | Documentos |
|---|---|---|---|
| **Matías** | `ms-catalogo` (8082) | Catálogo, productos, categorías, ofertas; admin de productos y categorías | ERS V3 |
| **César** | `ms-usuarios` (8081), Security/JWT/roles | Login, registro, `SesionContext`, admin de usuarios y perfil admin; Checkout y pagos conectados a `/api/v1/boletas` | Anexo 4 (Manual de usuario), informe de pruebas |
| **Katerine** | `ms-boletas` (8083): boletas, detalles, stock, pasarela | Proxy de Vite, Axios base, guards de ruta/menú, admin de órdenes y boletas, dashboard | Anexo 2, Anexo 3, Swagger, presentación, orden del repo |

**Por qué:** cada uno es dueño de un área completa (backend + frontend + documento), para que pueda explicar su parte de punta a punta. **Cómo se demuestra:** cada integrante presenta su vertical y luego todos explican el flujo completo.

---

## 6. Arquitectura objetivo

### 6.1 Diagrama

```text
┌──────────────────────────────────────────────────────────────┐
│  Navegador — React 19 + Vite 8 + Bootstrap 5                 │
│  http://localhost:5173                                       │
│                                                              │
│  SesionContext  ──  Axios (/api/v1)  ──  Guards por rol      │
└───────────────┬──────────────────┬──────────────────┬────────┘
                │                  │                  │
        /api/v1/auth              │                  │
        /api/v1/usuarios          │                  │
                ▼                  ▼                  ▼
      ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
      │  ms-usuarios    │  │  ms-catalogo    │  │  ms-boletas     │
      │  :8081          │  │  :8082          │  │  :8083          │
      │                 │  │                 │  │                 │
      │ Spring Security │  │ Productos       │  │ Boletas         │
      │ JWT + BCrypt    │  │ Categorías      │  │ Detalles        │
      │ Usuarios        │  │ Stock           │  │ Pago simulado   │
      └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
               │                    │                    │
               ▼                    ▼                    ▼
      ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
      │ grwu_usuarios   │  │ grwu_catalogo   │  │ grwu_boletas    │
      │ MySQL           │  │ MySQL           │  │ MySQL           │
      └─────────────────┘  └─────────────────┘  └─────────────────┘
```

**No hay API Gateway.** El frontend sigue en `grwu-react/` y se integra con el backend sin mover archivos. En desarrollo, Vite enruta:

| Prefijo | Destino |
|---|---|
| `/api/v1/auth` | `http://localhost:8081` |
| `/api/v1/usuarios` | `http://localhost:8081` |
| `/api/v1/productos` | `http://localhost:8082` |
| `/api/v1/categorias` | `http://localhost:8082` |
| `/api/v1/boletas` | `http://localhost:8083` |

### 6.2 Estructura final del repositorio

```text
/  (raíz)
├── AGENTS.md
├── CONTEXTO_EQUIPO_EV3.md
├── backend/
│   ├── ms-usuarios/
│   │   ├── pom.xml
│   │   ├── mvnw / mvnw.cmd
│   │   └── src/main/java/cl/grwu/usuarios/...
│   ├── ms-catalogo/
│   └── ms-boletas/
├── docs/                        # ERS, anexos, capturas, presentación
└── grwu-react/                  # frontend React; no se mueve
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── karma.conf.cjs
    ├── index.html
    ├── public/                  # imágenes y recursos
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        │   └── admin/
        ├── services/
        ├── styles/
        ├── tests/
        └── utils/
```

### 6.3 Por qué microservicios sin gateway

**A favor:**

- Cada servicio tiene su propio Swagger, su propia base y su propio despliegue.
- No hay un componente extra que configurar, explicar ni depurar en el tiempo disponible.
- Si un servicio falla, los otros dos siguen respondiendo.
- El equipo puede dividir el trabajo sin bloquearse: tres carpetas, tres dueños.

**En contra (y cómo se mitiga):**

- El frontend conoce tres rutas → se ocultan detrás del proxy y de `api.js`.
- CORS → en desarrollo se usa el proxy; en producción se configura un origen permitido.
- Configuración JWT duplicada → se comparte la clave por variable de entorno y se documenta una sola vez.
- Sin gateway no hay un punto único de rate limiting → fuera del alcance de la EV3; se menciona como mejora futura.

**Respuesta corta para la defensa:** "Usamos microservicios porque la PAUTA pide separar responsabilidades y cada uno puede explicar su servicio completo. No usamos gateway porque agrega una pieza que no se evalúa y que en el tiempo disponible nos quitaría tiempo de lógica de negocio y seguridad. El proxy de Vite cumple la función de enrutar en desarrollo."

### 6.4 Ruteo del proxy y base de Axios

El frontend nunca hardcodea puertos. `vite.config.js` define este mapeo (los prefijos no se solapan, así que cada ruta tiene un destino único):

```js
server: {
  proxy: {
    "/api/v1/auth":     "http://localhost:8081",
    "/api/v1/usuarios": "http://localhost:8081",
    "/api/v1/productos":  "http://localhost:8082",
    "/api/v1/categorias": "http://localhost:8082",
    "/api/v1/boletas":  "http://localhost:8083",
  },
}
```

Y `grwu-react/src/services/api.js` crea **una sola** instancia:

```js
import axios from "axios";

export const api = axios.create({ baseURL: "/api/v1" });
```

Ningún componente importa Axios ni escribe `http://localhost`. Si mañana cambia un puerto, se cambia en `vite.config.js` (y en el `application.yml` del servicio), no en 20 archivos.

> **Instalación:** Axios no está en `package.json` hoy. Se instala una vez con `npm install axios` (dependencia aprobada en D3) y se versiona `package-lock.json`. No se agrega ninguna otra librería de HTTP, estado o UI.

---

## 7. Modelo de datos

### 7.1 Principios

- Cinco tablas principales, alineadas con la Figura 1: `USUARIO`, `CATEGORIA`, `PRODUCTO`, `BOLETA`, `DETALLE_BOLETA`.
- Cada servicio tiene su esquema; **no hay claves foráneas físicas entre esquemas**.
- Las referencias entre servicios son lógicas: `BOLETA.usuario_run` y `DETALLE_BOLETA.producto_id` guardan el ID, pero la integridad se valida en la capa de servicio.
- El detalle de boleta guarda un **snapshot** del nombre, precio, imagen y categoría del producto: si el producto cambia de precio, imagen o categoría, o se elimina, la boleta histórica no se altera.
- Dinero en enteros CLP. Sin decimales.
- Fechas en ISO-8601 UTC con sufijo `Z` (en Java `Instant`, en MySQL `DATETIME(6)`).

### 7.2 `USUARIO` — esquema `grwu_usuarios`

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `run` | `VARCHAR(9)` | PK | Sin puntos ni guion; incluye DV |
| `nombre` | `VARCHAR(60)` | NOT NULL | |
| `apellidos` | `VARCHAR(80)` | NOT NULL | |
| `correo` | `VARCHAR(100)` | UNIQUE, NOT NULL | Dominios permitidos |
| `clave_hash` | `VARCHAR(60)` | NOT NULL | BCrypt |
| `fecha_nacimiento` | `DATE` | NOT NULL | |
| `tipo_usuario` | `VARCHAR(20)` | NOT NULL | `Administrador`, `Vendedor`, `Cliente` |
| `region` | `VARCHAR(80)` | | |
| `comuna` | `VARCHAR(80)` | | |
| `direccion` | `VARCHAR(150)` | | |
| `telefono` | `VARCHAR(20)` | | |
| `activo` | `BOOLEAN` | NOT NULL, default TRUE | Borrado lógico |

### 7.3 `CATEGORIA` — esquema `grwu_catalogo`

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `VARCHAR(12)` | PK | `c-001`, `c-g-hombre`, `c-g-mujer` |
| `slug` | `VARCHAR(40)` | UNIQUE, NOT NULL | `polerones`, `hombre`, ... |
| `nombre` | `VARCHAR(60)` | NOT NULL | |
| `descripcion` | `VARCHAR(255)` | | |
| `imagen` | `VARCHAR(255)` | | Ruta relativa a `public/`, sin `/` inicial (ej. `img/categoria/hombre.png`) |
| `genero` | `VARCHAR(20)` | | `hombre`, `mujer`, `todos` o `NULL` |

> **Sobre las rutas de imágenes:** el frontend actual guarda valores como `img/mujer/abrigo1.png` y los archivos viven en `grwu-react/public/img/...`. La API **conserva ese formato** (ruta relativa servida desde `public/`), no una URL absoluta ni una ruta de disco. Así el mismo string funciona en React (dentro de `grwu-react/`) y en una eventual compilación. Si un día las imágenes se suben a un CDN, se cambia solo el valor en la BD, no el contrato.

### 7.4 `PRODUCTO` — esquema `grwu_catalogo`

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `VARCHAR(10)` | PK | `p-001` ... |
| `nombre` | `VARCHAR(120)` | NOT NULL | |
| `descripcion` | `TEXT` | | |
| `precio` | `INT` | NOT NULL, > 0 | Precio final CLP |
| `precio_original` | `INT` | default 0 | 0 si no hay oferta |
| `oferta` | `INT` | default 0, 0–100 | Porcentaje de descuento |
| `categoria_id` | `VARCHAR(12)` | FK a `CATEGORIA`, NOT NULL | Relación real dentro del esquema |
| `genero` | `VARCHAR(20)` | NOT NULL | `hombre` o `mujer` (valores actuales); `unisex` solo si se agrega un producto mixto |
| `stock` | `INT` | NOT NULL, >= 0 | |
| `imagen` | `VARCHAR(255)` | | |
| `imagenes` | `TEXT` | | JSON array de rutas |
| `activo` | `BOOLEAN` | NOT NULL, default TRUE | Borrado lógico |

### 7.5 `BOLETA` — esquema `grwu_boletas`

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `VARCHAR(15)` | PK | `ORD-20260001` |
| `numero` | `BIGINT` | UNIQUE, NOT NULL | `20260001` |
| `fecha` | `DATETIME(6)` | NOT NULL | ISO-8601 UTC (`Instant`) |
| `usuario_run` | `VARCHAR(9)` | NOT NULL | Referencia lógica a `USUARIO` |
| `cliente_nombre` | `VARCHAR(60)` | NOT NULL | Snapshot; se guarda separado del apellido |
| `cliente_apellidos` | `VARCHAR(80)` | NOT NULL | Snapshot; coincide con el JSON |
| `cliente_correo` | `VARCHAR(100)` | NOT NULL | Snapshot |
| `direccion_calle` | `VARCHAR(150)` | NOT NULL | |
| `direccion_departamento` | `VARCHAR(30)` | | |
| `direccion_indicaciones` | `VARCHAR(200)` | | Opcional, máximo 200 caracteres |
| `direccion_region` | `VARCHAR(80)` | NOT NULL | |
| `direccion_comuna` | `VARCHAR(80)` | NOT NULL | |
| `subtotal` | `INT` | NOT NULL | Calculado en backend |
| `envio` | `INT` | NOT NULL | Calculado en backend |
| `total` | `INT` | NOT NULL | Calculado en backend |
| `despacho` | `VARCHAR(20)` | NOT NULL | `estandar`, `premium` |
| `metodo_pago` | `VARCHAR(20)` | NOT NULL | `credito`, `debito`, `transferencia` |
| `estado` | `VARCHAR(20)` | NOT NULL | Ver estados |
| `motivo_rechazo` | `VARCHAR(255)` | | Solo si `rechazada` |

### 7.6 `DETALLE_BOLETA` — esquema `grwu_boletas`

| Columna | Tipo | Restricciones | Notas |
|---|---|---|---|
| `id` | `BIGINT` | PK, AUTO_INCREMENT | |
| `boleta_id` | `VARCHAR(15)` | FK a `BOLETA`, NOT NULL | `ON DELETE CASCADE` dentro del esquema |
| `producto_id` | `VARCHAR(10)` | NOT NULL | Referencia lógica a `PRODUCTO` |
| `nombre_producto` | `VARCHAR(120)` | NOT NULL | Snapshot |
| `precio_unitario` | `INT` | NOT NULL | Snapshot del precio al momento de comprar |
| `imagen` | `VARCHAR(255)` | | Snapshot de la ruta de imagen |
| `categoria` | `VARCHAR(60)` | | Snapshot del slug de categoría al momento de comprar |
| `cantidad` | `INT` | NOT NULL, > 0 | **La API usa `cantidad`, no `qty`** |
| `subtotal_linea` | `INT` | NOT NULL | `precio_unitario * cantidad` |

### 7.7 Relaciones

```text
USUARIO 1 ──── N BOLETA          (lógica, entre esquemas)
BOLETA  1 ──── N DETALLE_BOLETA  (física, mismo esquema)
CATEGORIA 1 ── N PRODUCTO        (física, mismo esquema)
PRODUCTO 1 ─── N DETALLE_BOLETA  (lógica, entre esquemas)
```

### 7.8 Mapeo desde los datos actuales

| Actual (`localStorage`) | Destino | Transformación |
|---|---|---|
| `grwu_usuarios[].clave` | `USUARIO.clave_hash` | BCrypt al sembrar; nunca texto plano |
| `grwu_productos[].categoria` (slug) | `PRODUCTO.categoria_id` | Buscar `CATEGORIA` por slug y guardar el `id` |
| `grwu_productos[].imagenes[]` | `PRODUCTO.imagenes` | `JSON.stringify` |
| `grwu_ordenes[].items[].qty` | `DETALLE_BOLETA.cantidad` | Renombrar |
| `ms-catalogo` (producto) | `DETALLE_BOLETA.nombre_producto`, `precio_unitario`, `imagen`, `categoria` | Copiar el snapshot al crear la boleta |
| `grwu_ordenes[].cliente` (string) | `BOLETA.cliente_nombre` + `cliente_apellidos` + `cliente_correo` | Estructurar; nombres separados |
| `grwu_ordenes[].direccion` (string) | Campos `direccion_*` | Estructurar |
| `GRWU_Sesion` (RUN) | Token JWT | Reemplazar por completo |

**Semilla:** migrar solo usuarios, categorías y productos. Las boletas de la EV2 son datos de demo; la tabla arranca vacía. Los IDs se conservan (`p-001`, `c-001`, RUN).

---

## 8. Contrato de API v1.0

> **Regla:** este contrato se congela antes de programar. Un cambio se avisa al equipo y se actualiza el Anexo 3 y este documento. La API usa `camelCase` en JSON y `snake_case` en la base.

### 8.1 Convenciones generales

- Base: `http://localhost:8081/api/v1`, `http://localhost:8082/api/v1`, `http://localhost:8083/api/v1`.
- Autenticación: `Authorization: Bearer <accessToken>`.
- Fechas: ISO-8601 UTC con sufijo `Z` (`Instant` en Java, `DATETIME(6)` en MySQL).
- Dinero: entero CLP.
- IDs en la URL: string, tal como se definió.
- Errores: formato único de la sección 8.2.
- Swagger: `http://localhost:PORT/swagger-ui/index.html`.

### 8.2 Formato de error

```json
{
  "timestamp": "2026-11-17T10:30:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Stock insuficiente para p-010",
  "path": "/api/v1/boletas",
  "errores": {
    "items[0].cantidad": "Solo quedan 2 unidades"
  }
}
```

`errores` es opcional; se usa para validación de campos.

### 8.3 Autenticación — `ms-usuarios` (8081)

| Método | Ruta | Acceso | Entrada | Respuesta |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | Público | `{ correo, clave }` | 200 `{ accessToken, refreshToken, tokenType, expiraEn, usuario }` · 401 |
| POST | `/api/v1/auth/registro` | Público | Datos de usuario + `clave` | 201 usuario creado con rol `Cliente` · 400 · 409 |
| POST | `/api/v1/auth/refresh` | Público con refresh | `{ refreshToken }` | 200 tokens nuevos · 401 |
| POST | `/api/v1/auth/logout` | Autenticado | `{ refreshToken }` | 204 · 401 |

**Respuesta de login (ejemplo):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiraEn": 900,
  "usuario": {
    "run": "205558993",
    "nombre": "Javiera",
    "apellidos": "Contreras Lara",
    "correo": "javiera.contreras@gmail.com",
    "fechaNacimiento": "2000-06-25",
    "tipoUsuario": "Cliente",
    "region": "Región de la Araucanía",
    "comuna": "Temuco",
    "direccion": "Manuel Montt 321",
    "telefono": "+56 9 3333 7788"
  }
}
```

**Registro:** el rol siempre es `Cliente`; el backend lo fuerza aunque el cliente mande otro. El login devuelve `401` con mensaje genérico "Correo o contraseña incorrectos" (no revelar si el correo existe).

### 8.4 Usuarios — `ms-usuarios` (8081)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/v1/usuarios` | Administrador | Lista todos |
| GET | `/api/v1/usuarios/{run}` | Administrador | Detalle |
| POST | `/api/v1/usuarios` | Administrador | Crea usuario con cualquier rol |
| PUT | `/api/v1/usuarios/{run}` | Administrador | Actualiza datos y rol; clave opcional |
| DELETE | `/api/v1/usuarios/{run}` | Administrador | Borrado lógico (`activo=false`); no puede desactivarse a sí mismo |
| GET | `/api/v1/usuarios/me` | Autenticado | Perfil propio |
| PUT | `/api/v1/usuarios/me` | Autenticado | Actualiza perfil propio; **no** puede cambiar su rol |
| PUT | `/api/v1/usuarios/me/clave` | Autenticado | `{ claveActual, claveNueva }`; 204 |

**Historial de compras de un usuario (vista admin):** no vive en `ms-usuarios`. El frontend llama `GET /api/v1/boletas?usuarioRun={run}` a `ms-boletas` con token de Administrador.

### 8.5 Catálogo — `ms-catalogo` (8082)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/v1/productos` | Público | Lista productos activos; filtros opcionales |
| GET | `/api/v1/productos/{id}` | Público | Detalle |
| POST | `/api/v1/productos` | Administrador | Crea |
| PUT | `/api/v1/productos/{id}` | Administrador | Actualiza |
| DELETE | `/api/v1/productos/{id}` | Administrador | Borrado lógico (`activo=false`) |
| PATCH | `/api/v1/productos/{id}/stock` | Interno (`X-Service-Key`) | Descuenta o repone stock |
| GET | `/api/v1/categorias` | Público | Lista |
| GET | `/api/v1/categorias/{id}` | Público | Detalle por ID |
| GET | `/api/v1/categorias/slug/{slug}` | Público | Detalle por slug |
| POST | `/api/v1/categorias` | Administrador | Crea |
| PUT | `/api/v1/categorias/{id}` | Administrador | Actualiza |
| DELETE | `/api/v1/categorias/{id}` | Administrador | Elimina si no tiene productos; si tiene, 409 |

**Filtros de productos:** `?categoria=polerones&genero=mujer&oferta=true&q=poleron&criticos=true&umbral=5`. Todos opcionales. Para la EV3 no se exige paginación; se devuelve la lista completa (102 productos es manejable).

**Producto (respuesta):**

```json
{
  "id": "p-001",
  "nombre": "Abrigo Largo Paño",
  "descripcion": "Abrigo de paño línea GRWU...",
  "precio": 50690,
  "precioOriginal": 0,
  "oferta": 0,
  "categoriaId": "c-005",
  "categoriaSlug": "abrigos",
  "genero": "mujer",
  "stock": 42,
  "imagen": "img/mujer/abrigo1.png",
  "imagenes": []
}
```

**Stock interno:**

```http
PATCH /api/v1/productos/p-001/stock
Content-Type: application/json
X-Service-Key: <secreto-compartido>

{ "cantidad": 2, "operacion": "descontar" }
```

- `descontar`: `UPDATE producto SET stock = stock - :cantidad WHERE id = :id AND stock >= :cantidad`. Si afecta 0 filas → 409.
- `reponer`: suma.
- Requiere header `X-Service-Key` con el secreto compartido. No se documenta como endpoint público en el Anexo 3; se marca como interno.

### 8.6 Boletas — `ms-boletas` (8083)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| POST | `/api/v1/boletas` | Cliente | Crea boleta, valida stock, procesa pago simulado |
| GET | `/api/v1/boletas` | Administrador, Vendedor | Lista todas; filtros `estado`, `usuarioRun`, `desde`, `hasta` |
| GET | `/api/v1/boletas/mias` | Cliente | Boletas del usuario autenticado |
| GET | `/api/v1/boletas/{id}` | Admin/Vendedor o Cliente dueño | Detalle |
| POST | `/api/v1/boletas/{id}/reintentar-pago` | Cliente dueño | Reintenta solo si está `rechazada` |
| PATCH | `/api/v1/boletas/{id}/estado` | Administrador | Cambia estado con transiciones válidas |
| DELETE | `/api/v1/boletas/{id}` | Administrador | Cancela (borrado lógico); repone stock si estaba pagada |

**Crear boleta (request):**

```json
{
  "items": [
    { "productoId": "p-001", "cantidad": 2 },
    { "productoId": "p-010", "cantidad": 1 }
  ],
  "despacho": "estandar",
  "metodoPago": "credito",
  "cliente": {
    "nombre": "Javiera",
    "apellidos": "Contreras Lara",
    "correo": "javiera.contreras@gmail.com"
  },
  "direccion": {
    "calle": "Manuel Montt 321",
    "departamento": "",
    "indicaciones": "Dejar en conserjería",
    "region": "Región de la Araucanía",
    "comuna": "Temuco"
  }
}
```

**Crear boleta (respuesta):**

```json
{
  "id": "ORD-20260001",
  "numero": 20260001,
  "fecha": "2026-11-17T10:30:00Z",
  "usuarioRun": "205558993",
  "cliente": {
    "nombre": "Javiera",
    "apellidos": "Contreras Lara",
    "correo": "javiera.contreras@gmail.com"
  },
  "direccion": {
    "calle": "Manuel Montt 321",
    "departamento": "",
    "indicaciones": "Dejar en conserjería",
    "region": "Región de la Araucanía",
    "comuna": "Temuco"
  },
  "items": [
    {
      "productoId": "p-001",
      "nombre": "Abrigo Largo Paño",
      "imagen": "img/mujer/abrigo1.png",
      "categoria": "abrigos",
      "precioUnitario": 50690,
      "cantidad": 2,
      "subtotal": 101380
    }
  ],
  "subtotal": 101380,
  "envio": 0,
  "total": 101380,
  "despacho": "estandar",
  "metodoPago": "credito",
  "estado": "rechazada",
  "motivoRechazo": "El monto supera el límite de la tarjeta."
}
```

> El ejemplo supera `$100.000`, por eso la pasarela lo rechaza. Es útil para demostrar el flujo de error y el reintento.

**Reglas del request:**

- El `usuarioRun` se obtiene del JWT; si viene en el body, se ignora.
- El backend ignora precios, nombres y totales enviados; los busca en `ms-catalogo`.
- `items` no puede estar vacío; `cantidad` entero ≥ 1.
- Si el mismo producto aparece dos veces, se suman las cantidades antes de validar stock.
- `despacho` y `metodoPago` deben ser valores del enum.
- Los datos de `cliente` y `direccion` son obligatorios. `direccion.indicaciones` es opcional y admite hasta 200 caracteres.
- Los ítems de la respuesta incluyen `imagen` y `categoria`; `ms-boletas` los copia desde `ms-catalogo` al momento de comprar y los guarda como snapshot.

### 8.7 Estados de la boleta

La pasarela es síncrona: al crear la boleta queda **`pagada` o `rechazada`**, nunca en un estado intermedio.

```text
creación ──► pagada ──► enviada ──► entregada
                 │
                 └──► cancelada (repone stock)

creación ──► rechazada ──► (reintento) ──► pagada | rechazada
                  │
                  └──► cancelada
```

| Transición | Quién | Efecto |
|---|---|---|
| `creación → pagada` | Sistema | Pago aprobado; descuenta stock de forma atómica |
| `creación → rechazada` | Sistema | Pago rechazado, o falla el descuento de stock: motivo «Stock agotado» y respuesta **409** |
| `rechazada → pagada` | Cliente (reintento) | Revalida stock y vuelve a llamar a la pasarela; si aprueba, descuenta stock |
| `rechazada → rechazada` | Cliente (reintento) | Si vuelve a fallar, conserva o actualiza el motivo |
| `pagada → enviada` | Administrador | Sin cambio de stock |
| `enviada → entregada` | Administrador | Sin cambio de stock |
| `pagada → cancelada` | Administrador | Repone stock |
| `rechazada → cancelada` | Administrador | Sin cambio de stock |

Cualquier otra transición → **409**. No se puede editar una boleta `entregada` ni `cancelada`.

---

## 9. Seguridad y sesión

### 9.1 JWT

| Elemento | Decisión |
|---|---|
| Algoritmo | HS256 |
| Secreto | `JWT_SECRET`, mínimo 32 caracteres, **el mismo en los tres servicios** |
| Emisor | `grwu-auth` |
| Claims | `sub` = RUN, `rol` = `Administrador`/`Vendedor`/`Cliente`, `nombre` |
| Access token | 15 minutos |
| Refresh token | 7 días |
| Validación | Cada servicio valida firma y expiración localmente; no llama a `ms-usuarios` en cada request |
| Contraseñas | BCrypt (`BCryptPasswordEncoder`), nunca texto plano |

**Flujo de login:**

1. El frontend envía correo y clave a `POST /api/v1/auth/login`.
2. `ms-usuarios` busca al usuario activo, compara con BCrypt y genera access + refresh.
3. El frontend guarda el access **en memoria** y el refresh en `localStorage`.
4. Cada request lleva `Authorization: Bearer <access>`.
5. Si el access expira, el frontend llama una sola vez a `/auth/refresh`, obtiene uno nuevo y reintenta la request original.
6. Si el refresh falla, se limpia la sesión y se redirige a `/login`.

**Por qué el access va en memoria:** si un atacante logra inyectar JavaScript (XSS), no encuentra el access token en `localStorage`. El refresh sí se persiste porque es necesario para sobrevivir a la recarga; se mitiga con expiración corta, rotación y logout del servidor. **En un sistema real se usaría una cookie `HttpOnly` + `Secure` + `SameSite`; se menciona como mejora, no se implementa en la EV3 por tiempo y por la configuración cross-origin.**

### 9.2 Spring Security por servicio

- `ms-usuarios`: cadena completa con login, registro, refresh, logout y CRUD de usuarios.
- `ms-catalogo` y `ms-boletas`: incluyen un `JwtAuthenticationFilter` y un `SecurityConfig` que valida el token con la misma clave. No emiten tokens.
- Rutas públicas: `/api/v1/auth/**`, Swagger (`/swagger-ui/**`, `/v3/api-docs/**`), `GET /api/v1/productos/**` y `GET /api/v1/categorias/**`.
- Todo lo demás exige autenticación.
- Autorización por método con `@PreAuthorize`.
- Mapeo de roles: `tipoUsuario` → `ROLE_ADMINISTRADOR`, `ROLE_VENDEDOR`, `ROLE_CLIENTE`. En anotaciones: `hasRole('ADMINISTRADOR')`.
- **401** cuando no hay token, es inválido o expiró. **403** cuando hay token válido pero el rol no alcanza.
- `AuthenticationEntryPoint` y `AccessDeniedHandler` devuelven el JSON de error, no una página HTML.

### 9.3 Sesión en el frontend

Estructura sugerida:

```text
grwu-react/src/services/tokenStore.js   # get/set/clear access y refresh; evita imports circulares
grwu-react/src/services/api.js          # instancia Axios + interceptores
grwu-react/src/context/SesionContext.jsx
```

`SesionContext` expone:

```js
{
  usuario,            // objeto o null
  cargandoSesion,     // true mientras se restaura desde el refresh
  haySesion,
  esAdmin,
  esVendedor,
  esCliente,
  tieneRol(roles),
  iniciarSesion(correo, clave),
  registrar(datos),
  cerrarSesion(),
  actualizarPerfil(cambios)
}
```

**Restauración al recargar:**

1. Al montar, si hay refresh token, llamar a `/auth/refresh`.
2. Guardar el access nuevo en memoria.
3. Llamar a `/usuarios/me` para reconstruir el usuario.
4. Si algo falla, limpiar tokens y dejar `usuario = null`.
5. Los guards esperan a que `cargandoSesion` sea `false` antes de redirigir (evita el "parpadeo" al recargar).

### 9.4 Interceptor de Axios

- Request: agrega `Authorization` si hay access.
- Response:
  - Si llega **401** y la request no es `/auth/login` ni `/auth/refresh`, intenta refrescar **una sola vez**.
  - Mientras refresca, las demás requests esperan la misma promesa (evita 5 refresh simultáneos).
  - Si el refresh funciona, reintenta la request original.
  - Si falla, limpia tokens, emite un evento de logout y redirige a `/login`.
  - Si llega **403**, no refresca: muestra "No tienes permisos" y redirige según el rol.
- Normaliza el error a `{ mensaje, status, errores }`.

### 9.5 Guards y menú

- `RutaProtegida`: exige sesión; si no hay, redirige a `/login` guardando `from`.
- `RutaPorRol roles={["Administrador"]}`: exige uno de los roles; si no, redirige a la vista permitida.
- `AdminLayout` filtra el menú:
  - Administrador: Dashboard, Órdenes, Productos, Categorías, Usuarios, Reportes, Blogs, Contactos, Perfil.
  - Vendedor: **solo** Órdenes y Productos; aterriza en `/admin/productos`.
  - Cliente: no entra al layout.
- En las vistas de Vendedor se ocultan botones de crear, editar y eliminar. `AdminProductoEditar` se reutiliza en modo lectura o se crea `AdminProductoDetalle`.
- Cliente que escribe `/admin` → `/`.
- Vendedor que escribe `/admin/usuarios` → `/admin/productos`.
- Sin sesión → `/login`.

> **La seguridad real está en el backend.** Los guards son experiencia de usuario; si alguien desactiva JavaScript o llama la API directo, el backend debe seguir respondiendo 401/403.

---

## 10. Reglas de negocio

### 10.1 Cálculo de totales (backend)

1. Para cada ítem, buscar el producto por ID en `ms-catalogo`.
2. Verificar que esté activo y que `cantidad` sea entero ≥ 1.
3. Verificar `stock >= cantidad`.
4. Usar el `precio` de la base, **no** el precio enviado por el cliente.
5. `subtotalLinea = precio * cantidad`.
6. `subtotal = suma(subtotalLinea)`.
7. Calcular envío:
   - Si no hay ítems → 400.
   - Si `despacho = premium` → `5.990` siempre.
   - Si `despacho = estandar` y `subtotal >= 44.990` → `0`.
   - Si `despacho = estandar` y `subtotal < 44.990` → `3.990`.
8. `total = subtotal + envio`.
9. Guardar `subtotal`, `envio`, `total` en la boleta.
10. Guardar en cada línea `nombre_producto`, `precio_unitario`, `imagen` y `categoria` copiados desde `ms-catalogo`.

### 10.2 Stock

- Validar stock antes de procesar el pago (lectura desde `ms-catalogo`).
- **No descontar stock al crear la boleta.** El descuento ocurre solo si la pasarela aprueba el pago.
- Si el pago se aprueba, descontar con una operación atómica: `UPDATE producto SET stock = stock - :cantidad WHERE id = :id AND stock >= :cantidad`.
- Si alguna línea afecta 0 filas, compensar las líneas ya descontadas (reponerlas), marcar la boleta `rechazada` con motivo «Stock agotado» y responder **409**. Con la pasarela simulada no hay cobro real que revertir; se documenta igual como compensación.
- Si el pago se rechaza, no se toca el stock.
- Al crear, la boleta queda `pagada` o `rechazada`; no existe un estado intermedio.
- Si el cliente reintenta, revalidar stock y volver a llamar a la pasarela.
- Si el administrador cancela una boleta `pagada`, reponer el stock.
- Si dos clientes compran el último producto al mismo tiempo, ambos pueden llegar a pagar, pero solo uno descuenta: el `UPDATE ... WHERE stock >= cantidad` hace que el segundo afecte 0 filas y reciba **409**. Su boleta queda `rechazada` con motivo «Stock agotado». Es el trade-off de no reservar stock antes de pagar y se acepta por el alcance de la EV3.

**Secuencia exacta al crear una boleta:**

1. Validar request y calcular totales con precios de la BD.
2. Generar `id` y `fecha` y construir la boleta en memoria, sin persistirla todavía.
3. Validar stock leyendo `ms-catalogo`.
4. Llamar a la pasarela simulada.
5. Si **rechaza** → persistir `rechazada` + motivo; el stock no se toca; responder 201 con el estado (el frontend muestra `/pago-error/:id`).
6. Si **aprueba** → descontar stock atómicamente; si todo va bien, persistir `pagada` y responder 201 (el frontend muestra `/pago-correcto/:id`).
7. Si el descuento falla a mitad de camino → reponer lo descontado, persistir `rechazada` con motivo «Stock agotado» y responder **409**.
8. El reintento repite los pasos 3 a 7 sobre la misma boleta, que ya está `rechazada`.

### 10.3 Pasarela simulada (`ms-boletas`)

- Métodos válidos: `credito`, `debito`, `transferencia`.
- Orden de validaciones:
  1. Método válido.
  2. `total > 0`.
  3. `total <= 100.000`.
  4. Rechazo aleatorio con probabilidad configurable (`pasarela.probabilidad-rechazo`, default `0.10`).
- Respuesta: `{ aprobado, motivo, codigoAutorizacion }`.
- El azar se inyecta para poder testear sin depender de `Math.random` (igual que el `pago.js` actual).
- Se declara **SIMULADA** en Swagger, README, Anexo 2 y Manual de usuario.
- Endpoint de reintento: `POST /api/v1/boletas/{id}/reintentar-pago`, solo para el Cliente dueño y solo si está `rechazada`.

### 10.4 Validaciones que el backend repite

| Regla | Implementación |
|---|---|
| RUN | Limpiar, 7–9 caracteres, módulo 11, DV correcto |
| Correo | Regex de dominios permitidos + max 100 |
| Contraseña | 4–10 caracteres; BCrypt al guardar |
| Teléfono | `^[+\d][\d\s-]{6,14}$` |
| Nombre/apellidos | No vacíos, max según tabla |
| Producto | `precio > 0`, `stock >= 0`, `oferta` 0–100, `precioOriginal >= precio` si es > 0 |
| Categoría | `slug` único, nombre obligatorio |
| Boleta | Ítems no vacíos, cantidades enteras, despacho/método válidos |
| Rol | Solo valores del enum; el registro fuerza `Cliente` |

### 10.5 Reglas de UI y persistencia que se mantienen

- `localStorage` se permite solo para el refresh token, preferencias no sensibles, el carrito (`GRWU_Cart`), los blogs (`grwu_blogs`) y los contactos (`grwu_contactos`). Usuarios, productos, categorías y boletas siempre se leen y escriben por API.
- El carrito permite navegar y agregar sin sesión.
- El botón de pago del Checkout exige sesión de Cliente; si no hay, redirige a `/login` y vuelve al Checkout.
- El Cliente puede ver sus propias boletas; no las de otros.
- El Vendedor no ve botones de acción; solo lectura.
- El Administrador puede todo, salvo desactivar su propia cuenta.

---

## 11. Matriz de roles y accesos

### 11.1 Frontend

| Ruta | Público | Cliente | Vendedor | Administrador |
|---|:---:|:---:|:---:|:---:|
| `/`, `/productos`, `/productos/:id` | ✅ | ✅ | ✅ | ✅ |
| `/categorias`, `/categorias/:slug`, `/ofertas` | ✅ | ✅ | ✅ | ✅ |
| `/nosotros`, `/blogs`, `/blogs/:id`, `/contacto` | ✅ | ✅ | ✅ | ✅ |
| `/carrito` | ✅ | ✅ | ✅ | ✅ |
| `/login`, `/registro` | ✅ | — | — | — |
| `/checkout` | ❌ | ✅ | ❌ | ❌ |
| `/pago-correcto/:id`, `/pago-error/:id` | ❌ | ✅ (dueño) | ❌ | ❌ |
| `/admin` (dashboard), `/admin/reportes` | ❌ | ❌ | ❌ | ✅ |
| `/admin/usuarios/**` | ❌ | ❌ | ❌ | ✅ |
| `/admin/categorias/**` | ❌ | ❌ | ❌ | ✅ |
| `/admin/blogs`, `/admin/contactos` | ❌ | ❌ | ❌ | ✅ |
| `/admin/productos`, `/admin/productos/:id` | ❌ | ❌ | ✅ lectura | ✅ |
| `/admin/ordenes`, `/admin/ordenes/:id` | ❌ | ❌ | ✅ lectura | ✅ |
| `/admin/perfil` | ❌ | ❌ | ❌ | ✅ |

**Redirecciones:** sin sesión → `/login`; Cliente que intenta `/admin` → `/`; Vendedor que intenta una ruta no permitida → `/admin/productos`.

### 11.2 Backend

| Endpoint | Público | Cliente | Vendedor | Administrador |
|---|:---:|:---:|:---:|:---:|
| `POST /auth/login`, `/auth/registro`, `/auth/refresh` | ✅ | — | — | — |
| `POST /auth/logout` | ❌ | ✅ | ✅ | ✅ |
| `GET /productos/**`, `GET /categorias/**` | ✅ | ✅ | ✅ | ✅ |
| `POST/PUT/DELETE /productos/**`, `/categorias/**` | ❌ | ❌ | ❌ | ✅ |
| `PATCH /productos/{id}/stock` | ❌ | ❌ | ❌ | Solo servicio (`X-Service-Key`) |
| `GET /usuarios/**`, `POST/PUT/DELETE /usuarios/**` | ❌ | ❌ | ❌ | ✅ |
| `GET/PUT /usuarios/me`, `PUT /usuarios/me/clave` | ❌ | ✅ | ✅ | ✅ |
| `POST /boletas` | ❌ | ✅ | ❌ | ❌ |
| `GET /boletas` | ❌ | ❌ | ✅ | ✅ |
| `GET /boletas/mias` | ❌ | ✅ | ❌ | ❌ |
| `GET /boletas/{id}` | ❌ | ✅ dueño | ✅ | ✅ |
| `POST /boletas/{id}/reintentar-pago` | ❌ | ✅ dueño | ❌ | ❌ |
| `PATCH /boletas/{id}/estado` | ❌ | ❌ | ❌ | ✅ |
| `DELETE /boletas/{id}` | ❌ | ❌ | ❌ | ✅ |

**Pruebas mínimas de la matriz:** sin token → 401; token de Cliente en `/usuarios` → 403; token de Vendedor en `POST /productos` → 403; token de Cliente en `/boletas` (lista general) → 403; Cliente en `/boletas/{id}` de otro → 403.

---

## 12. Reparto de trabajo

> Cada integrante es dueño de una vertical completa: backend, frontend y documento. La regla es: **si tocas algo ajeno, lo pides; no lo editas**.

> **Reparto confirmado por Katerine el 17-nov-2026.**

### 12.1 Matías — Catálogo

**Backend (`backend/ms-catalogo`, 8082):**

- Entidades `Categoria` y `Producto`; repositorios; DTOs; servicios; controladores.
- CRUD de productos y categorías con validaciones.
- Filtros de productos (categoría, género, oferta, búsqueda, críticos).
- Endpoint interno de stock con `X-Service-Key`.
- Semilla de 102 productos y 13 categorías desde los datos actuales.
- Swagger con ejemplos y códigos de respuesta.
- Tests JUnit + Mockito: precio, oferta, stock, categoría inexistente, borrado lógico, stock insuficiente.

**Frontend:**

- `grwu-react/src/services/productos.js` y `categorias.js`.
- `Home`, `Productos`, `DetalleProducto`, `Ofertas`, `Categorias`, `Categoria`.
- `AdminProductos`, `AdminProductoNuevo`, `AdminProductoEditar`, `AdminProductosCriticos`, `AdminCategorias`, `AdminCategoriaNueva`, `AdminCategoriaEditar`.
- Nuevo `AdminProductoDetalle` en modo lectura para Vendedor (o `AdminProductoEditar` con `soloLectura`).
- Adaptar `ProductCard` si cambia la forma de los datos (no debería, por el adaptador).
- Actualizar tests afectados.

**Documento:** ERS V3.

**Criterio de aceptación:** el catálogo se ve igual que en EV2, pero los datos vienen de 8082; el admin crea/edita/elimina productos y categorías contra la API; el Vendedor ve la lista y el detalle sin botones de acción.

### 12.2 César — Usuarios, autenticación y compra

**Backend (`backend/ms-usuarios`, 8081):**

- Entidad `Usuario`, repositorio, servicio, controlador.
- `SecurityConfig`, `JwtService`, `JwtAuthenticationFilter`, `AuthenticationEntryPoint`, `AccessDeniedHandler`.
- Login, registro, refresh, logout, `/me`, cambio de clave.
- BCrypt, validaciones de RUN/correo/contraseña, roles y 401/403.
- CRUD de usuarios para Administrador.
- Tests: login ok/fallido, usuario inactivo, RUN inválido, correo duplicado, rol insuficiente, refresh inválido, registro fuerza Cliente.

**Frontend:**

- `grwu-react/src/services/tokenStore.js`, `auth.js`, `usuarios.js`.
- `SesionContext` con access en memoria, refresh persistente, restauración al recargar y helpers de rol.
- `Login`, `Registro`.
- `AdminUsuarios`, `AdminUsuarioNuevo`, `AdminUsuarioEditar`, `AdminPerfil`, `AdminHistorialCompras` (consumiendo boletas).
- `Checkout`: exigir Cliente, enviar la boleta a `/api/v1/boletas`, manejar 401/403/409 y los estados de pago.
- `PagoCorrecto` y `PagoError` con datos reales de la boleta.
- Tests: sesión, login, registro, restauración, interceptor, checkout.

**Documentos:** Anexo 4 (Manual de usuario) e informe de pruebas actualizado.

**Criterio de aceptación:** login real contra MySQL, F5 mantiene la sesión, logout la cierra, Cliente puede comprar y ver su boleta, Admin gestiona usuarios, rutas protegidas responden 401/403.

### 12.3 Katerine — Boletas, integración y entrega

**Backend (`backend/ms-boletas`, 8083):**

- Entidades `Boleta` y `DetalleBoleta`; repositorios; DTOs; servicio; controlador.
- Creación de boleta con recálculo de totales, validación y descuento de stock vía `ms-catalogo` solo si el pago se aprueba.
- Pasarela simulada configurable + reintento.
- Transiciones de estado y reposición de stock.
- Listados con filtros, `/mias`, detalle con control de dueño.
- Swagger y pruebas JUnit/Mockito: totales, envío gratis/estándar/premium, stock insuficiente, pago rechazado por monto, pago rechazado por probabilidad, reintento, transición inválida, Cliente dueño vs otro.

**Frontend:**

- `vite.config.js` con proxy a 8081/8082/8083.
- `grwu-react/src/services/api.js` (Axios + interceptores), `boletas.js`, `adapters.js`.
- `RutaProtegida`, `RutaPorRol`, `AdminLayout` con menú dinámico.
- `App.jsx` con rutas protegidas y redirecciones.
- `AdminOrdenes`, `AdminBoleta`, `AdminDashboard`, `AdminReportes`.
- Fix del adaptador `cantidad`/`qty` y de `AdminBoleta`.
- Tests: guards, menú por rol, adaptadores, admin de órdenes, dashboard.

**Documentos:** Anexo 2 (APIs e Integración), Anexo 3 (Excel), Swagger de los tres servicios (verificación), presentación y orden del repositorio.

**Criterio de aceptación:** compra completa Cliente → boleta en MySQL → admin la ve → Vendedor la ve en solo lectura → dashboard y reportes calculan con datos reales; ningún rol puede entrar donde no debe.

### 12.4 Orden de implementación (12 jornadas desde el 17-nov-2026)

La fecha real de la presentación está **por confirmar**; si cambia, se ajusta el calendario manteniendo el orden y la jornada 12 como congelamiento, un día antes de la presentación.

| Jornada | Foco | Responsable principal | Otros |
|---|---|---|---|
| 1 (17-nov) | Entorno: MySQL, esquemas, esqueletos Spring Boot, proxy de Vite y Axios base | Katerine | Todos revisan |
| 2 | Contrato congelado: DTOs, tablas, enums y acuerdos de API | Todos | Katerine integra |
| 3 | `ms-usuarios`: entidades, JWT, login, registro y refresh | César | — |
| 4 | `ms-catalogo`: CRUD, filtros, stock interno y validaciones | Matías | — |
| 5 | `ms-boletas`: creación, totales, pasarela simulada y estados | Katerine | — |
| 6 | Backends completos, tests unitarios, semilla (102/13/6) y capa `api.js` + servicios | Cada uno | Katerine integra |
| 7 | Integración de catálogo y usuarios; guards y menú por rol | Matías / César | Katerine |
| 8 | Checkout, boletas, pagos y admin de órdenes | César / Katerine | Matías |
| 9 | Integración completa: 401/403, adaptador `qty`/`cantidad`, correcciones | Todos | — |
| 10 | Documentos: ERS, Anexo 2, Anexo 3, Anexo 4 e informe de pruebas | Cada uno | — |
| 11 | Pruebas end-to-end, Swagger y ensayo de presentación | Todos | — |
| 12 | Congelamiento, tag `ev3-entrega-1.0` y comprimidos; un día antes de la presentación | Todos | — |

**Dependencias críticas:**

- El entorno y el contrato congelado (jornadas 1-2) bloquean a todos.
- El login (César) bloquea las rutas protegidas.
- El catálogo (Matías) bloquea el Checkout.
- Las boletas (Katerine) bloquean el admin de órdenes.
- Mientras falte una pieza, se puede trabajar con mocks locales en los servicios, pero **no** se commitea código que simule la demo.

---

## 13. Flujo Git y entrega

### 13.1 Ramas

| Rama | Dueño | Contenido |
|---|---|---|
| `main` | — | Siempre compilable; solo merges revisados |
| `katerine/integracion` | Katerine | Proxy + Axios base + guards + integración |
| `matias/catalogo` | Matías | `ms-catalogo` + frontend de catálogo |
| `cesar/usuarios-auth` | César | `ms-usuarios` + login/sesión/checkout |
| `katerine/boletas-integracion` | Katerine | `ms-boletas` + guards + admin órdenes |
| `docs/*` | Cada uno | Documentos de su área |

### 13.2 Commits

Formato sugerido (Conventional Commits, en español o inglés consistente):

```text
feat(catalogo): agregar CRUD de productos con validación de stock
feat(auth): implementar login con JWT y refresh token
feat(boletas): calcular totales y procesar pago simulado
fix(admin): corregir cantidad en detalle de boleta
test(catalogo): cubrir stock insuficiente y borrado lógico
docs(anexo2): documentar endpoints de boletas
```

Reglas:

- Commits pequeños y con intención clara.
- `user.name` y `user.email` reales de cada integrante antes del primer commit.
- No commitear `node_modules/`, `target/`, `dist/`, `coverage/`, `.env`, logs.
- No hacer `push` directo a `main`.
- Cada PR lo revisa otro integrante y deja al menos un comentario o aprobación.

### 13.3 `.gitignore` mínimo

```gitignore
node_modules/
dist/
coverage/
target/
*.log
.env
.env.local
backend/**/application-local.yml
.idea/
.vscode/
```

### 13.4 Variables de entorno

Crear `.env.example` (sí se versiona) y `.env` (no se versiona):

```env
JWT_SECRET=cambiar-por-un-secreto-de-al-menos-32-caracteres
JWT_ACCESS_MINUTES=15
JWT_REFRESH_DAYS=7
DB_HOST=localhost
DB_PORT=3306
DB_USER=grwu
DB_PASSWORD=cambiar
PASARELA_PROBABILIDAD_RECHAZO=0.10
PASARELA_LIMITE_MONTO=100000
SERVICE_KEY=cambiar-por-una-clave-interna
```

Cada servicio lee solo las que necesita. La `JWT_SECRET` debe ser idéntica en los tres.

### 13.5 Congelamiento y tag

1. Definir fecha y hora de corte en el canal del equipo, con al menos 24 horas de anticipación y nunca después del día anterior a la presentación.
2. Antes del corte: merge de todo, tests verdes, documentos listos.
3. Después del corte: **no se hace push**.
4. Crear el tag:
   ```bash
   git tag -a ev3-entrega-1.0 -m "Entrega EV3 GRWU"
   git push origin ev3-entrega-1.0
   ```
5. Comprimir dos carpetas desde ese tag: `grwu-react/` y `backend/` (sin `node_modules/`, `coverage/` ni `target/`).
6. Presentar desde ese tag, no desde una copia local modificada.

### 13.6 Si se exigen dos repositorios

La PAUTA pide un enlace de frontend y uno de backend. Como el equipo decidió monorepo, con el frontend en `grwu-react/` y el backend en `backend/`:

- Entregar el enlace del monorepo y explicar la estructura en el README.
- Si el docente insiste, crear al momento de la entrega dos repos espejo con el mismo tag: `GRWU-frontend` (contenido de `grwu-react/`) y `GRWU-backend` (contenido de `backend/`).
- No duplicar el trabajo durante el desarrollo; solo al momento de la entrega.

---

## 14. Documentos y anexos

### 14.1 ERS V3 — Matías

Actualizar el ERS existente (`ERS_GRWU.docx`, hoy en `grwu-react/`):

- Arquitectura de microservicios y responsabilidades.
- Modelo de datos con las cinco tablas y relaciones.
- Requerimientos funcionales: eliminar RF-18 ("recuperar contraseña"); agregar login JWT, refresh, roles, CRUD por API, checkout con boleta, pasarela simulada y restricciones por rol.
- Requerimientos no funcionales: seguridad, BCrypt, JWT, CORS, validaciones, disponibilidad de los tres servicios, pruebas.
- Actores y casos de uso actualizados.
- Matriz de trazabilidad requisito → endpoint → prueba.
- Diagramas: arquitectura, modelo de datos, flujo de compra y flujo de autenticación.

### 14.2 Anexo 2 — Documentación de APIs e Integración (Katerine)

Estructura obligatoria:

1. Título, versión y fecha.
2. Descripción general.
3. Información general: URL de la API y URL de Swagger (las tres).
4. Endpoints por versión (`v1`): método, ruta, descripción, datos de entrada, respuestas, autenticación, roles y observaciones.
5. Integración con el frontend:
   - Capturas de pantalla de las llamadas reales (DevTools o Postman).
   - Capturas de la interfaz mostrando el resultado.
   - Explicación debajo de cada imagen.
6. Pruebas de comunicación y resultados.
7. Modelo de la base de datos y justificación de microservicios.

> Cada imagen debe ir numerada, con título, imagen con borde negro de 1 px y una nota explicativa. No dejar texto de la plantilla Pokémon ni fechas de ejemplo.

### 14.3 Anexo 3 — Planilla Excel de APIs (Katerine)

Columnas exactas:

| Columna | Contenido |
|---|---|
| Método HTTP | GET, POST, PUT, PATCH, DELETE |
| Ruta del Endpoint | `/api/v1/...` |
| Descripción | Qué hace |
| Datos de entrada | JSON o `N/A` |
| Respuestas | Códigos y significado |
| API PÚBLICA/PRIVADA | Pública o Privada |
| Requiere Autenticación | Sí/No |
| Roles permitidos | Administrador, Vendedor, Cliente, Público, Interno |
| Observaciones | Reglas, validaciones, notas |

Incluir los tres servicios, marcar el endpoint interno de stock como `Interno` y agregar una hoja de portada con título, versión, fecha y URLs.

### 14.4 Anexo 4 — Manual de usuario (César)

Secciones obligatorias:

1. Introducción: propósito, descripción del sistema, cómo usar el manual.
2. Requisitos del sistema: hardware y software (Node, Java 21, MySQL, navegador).
3. Instalación y configuración: paso a paso con pantallazos; crear los esquemas, variables de entorno, levantar los tres servicios y el frontend.
4. Comenzando: registro e inicio de sesión con pantallazos.
5. Uso del software: funciones principales (catálogo, carrito, checkout, pago, boleta, admin de productos/categorías/usuarios/órdenes, roles).
6. Preguntas frecuentes y solución de problemas.

**Formato de cada imagen:** número, título, imagen con borde de 1 px negro y nota. Reemplazar la plantilla Pokémon y las fechas de ejemplo.

### 14.5 Swagger — los tres servicios

- `springdoc-openapi-starter-webmvc-ui`.
- Esquema `bearerAuth`.
- `@Operation` con descripción, roles y códigos.
- Ejemplos de request/response.
- La pasarela simulada debe decir **SIMULADA** en la descripción.
- Verificar que el endpoint interno de stock no se muestre como público.

### 14.6 Informe de pruebas — César

- Tests del frontend antes y después (168 → 160 aprox. por la eliminación de los 8 de `RecuperarClave`, más los nuevos; confirmar el número exacto con la corrida real).
- Cobertura actualizada con `npm run test:coverage`.
- Tests del backend por servicio y qué regla cubre cada uno.
- Pruebas de integración con Postman: login, CRUD, compra, rechazo, reintento, 401/403.
- Evidencia de los tres roles.
- Conclusión: qué se probó, qué no y por qué.

### 14.7 Presentación — Katerine (todos exponen)

15 minutos + 5 de preguntas. Distribución sugerida:

| Minuto | Tema | Quién |
|---|---|---|
| 0–2 | Problema, objetivo y arquitectura | Katerine |
| 2–5 | Catálogo, productos, categorías y modelo de datos | Matías |
| 5–8 | Usuarios, JWT, roles y sesión | César |
| 8–11 | Checkout, boletas, stock y pasarela simulada | Katerine |
| 11–14 | Demo en vivo con los tres roles | Todos |
| 14–15 | Pruebas, aprendizajes y cierre | César |

**Demo en vivo:** crear una compra con Cliente, mostrar la boleta en admin, entrar como Vendedor y comprobar que solo ve productos y órdenes, intentar una URL prohibida y mostrar la redirección. Tener Postman/Swagger abierto como respaldo, pero **no** reemplazar la demo real por diapositivas.

---

## 15. Plan de pruebas

### 15.1 Frontend

- Comando único: `npm run test:coverage`.
- No usar `npm test` para la entrega: queda en modo observación.
- Los tests no deben depender del backend; mockear `grwu-react/src/services/*`.
- Casos nuevos mínimos:
  - `api.js`: agrega token, refresca una vez en 401, limpia sesión si falla.
  - `SesionContext`: restaura sesión al recargar, logout, helpers de rol.
  - `RutaProtegida` / `RutaPorRol`: sin sesión, rol incorrecto, rol correcto.
  - `AdminLayout`: menú de Administrador vs Vendedor.
  - `adapters`: `qty ↔ cantidad`, boleta API → UI.
  - `Checkout`: sin sesión redirige; con Cliente crea boleta; pago rechazado muestra error.
  - `AdminOrdenes` / `AdminBoleta`: lista y detalle con datos de API.
  - Catálogo: productos y categorías desde servicios mockeados.
- Eliminar `grwu-react/src/tests/RecuperarClave.spec.jsx` (8 tests).
- Actualizar cualquier test que dependa de `localStorage` como fuente de datos.

### 15.2 Backend

- `./mvnw test` en cada servicio.
- JUnit 5 + Mockito.
- Priorizar reglas de negocio, no getters.
- Mínimo por servicio:
  - `ms-catalogo`: crear/editar producto, precio inválido, oferta inválida, stock insuficiente, borrado lógico, categoría con productos.
  - `ms-usuarios`: login ok, login mal, usuario inactivo, RUN inválido, correo duplicado, registro fuerza Cliente, refresh inválido, acceso denegado por rol.
  - `ms-boletas`: totales, envío gratis/estándar/premium, carrito vacío, stock insuficiente, pago aprobado, pago rechazado por monto, pago rechazado por probabilidad, reintento, transición inválida, Cliente dueño vs otro.
- Usar `@WebMvcTest` para 401/403 y validación de DTOs.
- No es obligatorio Testcontainers; si se usa H2, cuidar las diferencias de SQL.

### 15.3 Integración

- Postman o Swagger para cada flujo:
  1. Registro → login → `/me`.
  2. Login Admin → CRUD producto → ver en catálogo.
  3. Login Cliente → crear boleta → ver en `/mias`.
  4. Boleta > $100.000 → rechazo → reintento.
  5. Login Vendedor → `GET /boletas` ok → `POST /productos` 403.
  6. Sin token → 401.
- Guardar capturas para el Anexo 2.
- Verificar en MySQL que la boleta y sus detalles quedaron guardados.

### 15.4 Criterios de aceptación de pruebas

- 0 tests rojos en frontend y backend.
- Cobertura de frontend ≥ 70 % de líneas (meta interna; la EV2 tenía 71,7 %).
- Todos los endpoints del contrato aparecen en Swagger.
- Todos los roles probados al menos una vez.
- 401 y 403 demostrados con captura.
- Flujo de compra completo demostrado con datos reales.

---

## 16. Checklist final

### Repositorio y estructura

- [ ] Frontend en `grwu-react/` y backend en `backend/`, sin mover el frontend.
- [ ] `README.md` con instrucciones de instalación, puertos, variables de entorno y usuarios de prueba.
- [ ] `.gitignore` correcto; sin `node_modules/`, `target/`, `.env`.
- [ ] Ramas y PRs mergeados; autoría real en Git.
- [ ] Tag `ev3-entrega-1.0`.

### Backend

- [ ] Tres servicios levantan en 8081, 8082 y 8083.
- [ ] Tres esquemas MySQL con datos semilla (102 productos, 13 categorías, 6 usuarios con BCrypt).
- [ ] CRUD completo de usuarios, productos, categorías y boletas.
- [ ] Reglas de negocio en el servicio, no en el controlador.
- [ ] Validaciones repetidas en backend.
- [ ] Manejo de errores unificado.
- [ ] Swagger en los tres servicios.
- [ ] Tests JUnit/Mockito verdes.

### Seguridad

- [ ] Login, refresh y logout funcionando.
- [ ] BCrypt en todas las contraseñas.
- [ ] JWT con expiración y misma clave en los tres servicios.
- [ ] 401 sin token y 403 por rol demostrados.
- [ ] CORS limitado al origen del frontend.
- [ ] Sin secretos en el repositorio.
- [ ] Registro fuerza rol Cliente.

### Frontend

- [ ] `localStorage` solo para refresh token, preferencias no sensibles, `GRWU_Cart`, `grwu_blogs` y `grwu_contactos`; sin datos de negocio.
- [ ] Axios con rutas relativas y proxy.
- [ ] Sesión sobrevive a F5.
- [ ] Guards y menú por rol.
- [ ] Vendedor solo ve productos y órdenes en lectura.
- [ ] Cliente redirigido de `/admin`.
- [ ] Checkout exige Cliente.
- [ ] `qty`/`cantidad` adaptado; `AdminBoleta` muestra bien.
- [ ] `/recuperar-clave` eliminado (ruta, enlace, página, tests, RF-18).
- [ ] `npm run test:coverage` verde.
- [ ] `npm run build` sin errores.

### Documentos

- [ ] ERS V3 sin RF-18, con modelo y arquitectura actualizados.
- [ ] Anexo 2 con endpoints, capturas y explicaciones.
- [ ] Anexo 3 con las columnas exactas y los tres servicios.
- [ ] Anexo 4 con secciones e imágenes numeradas, borde negro y notas.
- [ ] Swagger verificado y enlazado.
- [ ] Informe de pruebas actualizado.
- [ ] Presentación de 15 minutos ensayada.
- [ ] Dos comprimidos (`grwu-react/` y `backend/`) y enlaces públicos.

### Defensa

- [ ] Cada integrante puede explicar backend, API, integración, JWT, sesión y restricciones.
- [ ] Cada integrante puede mostrar su parte en GitHub.
- [ ] Demo con los tres roles probada el día anterior.
- [ ] Plan de contingencia si falla internet o MySQL (capturas, logs, Swagger local).

---

## 17. Riesgos y trampas

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Intentar todo y no terminar | Indicadores incompletos | Verticales por persona; priorizar CRUD + JWT + compra |
| Indicadores "NO APLICA" | Caída directa a 60 % | Completar IE3.2.1, IE3.3.1, IE3.3.2 e IE3.3.5 sí o sí |
| Demo con backend caído | Mala impresión y nota oral | Ensayo, seed, scripts de arranque, capturas de respaldo |
| CORS / proxy mal configurado | El frontend no conecta | Proxy de Vite y origen permitido; probar temprano |
| `JWT_SECRET` distinto entre servicios | 401 inesperados | Una sola variable compartida en `.env` |
| Esquemas MySQL mezclados | Acoplamiento y confusión | Un esquema por servicio; sin FK cruzadas |
| `localStorage` residual | Indicador de integración bajo | Dejar solo refresh token, preferencias, `GRWU_Cart`, `grwu_blogs` y `grwu_contactos`; borrar `grwu_usuarios`, `grwu_productos`, `grwu_categorias` y `grwu_ordenes` |
| Blogs/Contactos consumen tiempo | Menos tiempo para lo evaluado | Quedan fuera del backend; no tocarlos salvo que sobre tiempo |
| Dos repositorios exigidos | Entregable incompleto | Confirmar con el docente; contingencia de repo espejo |
| Código de IA no entendido | 60 % de la nota en riesgo | Explicar cada cambio; no commitear lo que no se puede defender |
| Modificar después del corte | Entrega inconsistente | Congelar, tag y presentar desde el tag |

---

## 18. Preguntas de defensa oral

> Estas son las preguntas más probables. Cada respuesta debe poder darse en 30–60 segundos, con un ejemplo del proyecto.

**1. ¿Por qué usaron microservicios y no un monolito?**
Porque la PAUTA pide separar backend, API y seguridad, y el equipo necesitaba dividir el trabajo en tres verticales. Cada servicio tiene su base, su Swagger y su dueño. Un monolito habría sido más simple, pero menos defendible como trabajo en equipo y más difícil de explicar por partes.

**2. ¿Por qué no usaron un API Gateway?**
Porque agrega una pieza que no se evalúa y que en el tiempo disponible nos quitaría tiempo. El proxy de Vite cumple el rol de enrutar en desarrollo. En producción, un gateway sería la mejora natural, junto con rate limiting y un punto único de autenticación.

**3. ¿Cómo viaja una request desde React hasta MySQL?**
El componente llama a un servicio de `grwu-react/src/services/`, Axios agrega el Bearer y envía a `/api/v1/...`; el proxy de Vite lo deriva al puerto del servicio; el controlador valida el DTO, el servicio aplica la regla de negocio, el repositorio JPA consulta MySQL y la respuesta vuelve por el mismo camino. En el frontend, el adaptador la transforma a la forma que usa la vista.

**4. ¿Cómo se valida el JWT en tres servicios distintos?**
Los tres comparten el mismo `JWT_SECRET` y el mismo emisor. Cada uno tiene un filtro que verifica firma y expiración localmente. No hace falta llamar a `ms-usuarios` en cada request, lo que evita un cuello de botella y un punto único de falla.

**5. ¿Por qué el access token está en memoria y el refresh en `localStorage`?**
Porque el access es de corta duración y no queremos que un XSS lo encuentre persistido. El refresh necesita sobrevivir a la recarga; se mitiga con expiración, rotación y logout. En producción usaríamos cookie `HttpOnly`, `Secure` y `SameSite`.

**6. ¿Qué pasa si el access token expira mientras el usuario compra?**
El interceptor recibe 401, hace **un solo** refresh, reintenta la request original y el usuario no pierde la compra. Si el refresh también falla, se cierra la sesión y se redirige a `/login`.

**7. ¿Cómo se restaura la sesión al recargar la página?**
`SesionContext` lee el refresh de `localStorage`, llama a `/auth/refresh`, guarda el access nuevo en memoria y pide `/usuarios/me`. Mientras eso ocurre, `cargandoSesion` evita que los guards redirijan antes de tiempo.

**8. ¿Cuál es la diferencia entre 401 y 403?**
401 es "no sé quién eres": falta token, es inválido o expiró. 403 es "sé quién eres, pero no tienes permiso": un Cliente intentando `POST /productos`, por ejemplo. Ambos se prueban con captura.

**9. ¿Cómo evitan que un Cliente se haga Administrador?**
El registro público fuerza `tipoUsuario = Cliente` en el backend, aunque el body diga otra cosa. El cambio de rol solo lo puede hacer un Administrador autenticado. Además, el frontend no muestra la opción, pero la seguridad real está en el backend.

**10. ¿Cómo evitan que el cliente manipule el precio o el total?**
El backend ignora los precios y totales del request. Busca cada producto en la base, usa su precio, recalcula subtotal, envío y total, y guarda esos valores. Aunque alguien edite la request en DevTools o Postman, el total no cambia.

**11. ¿Cómo mantienen consistencia de stock entre servicios?**
`ms-boletas` valida stock leyendo `ms-catalogo`, procesa el pago y, **solo si se aprueba**, llama al endpoint interno que hace `UPDATE ... WHERE stock >= cantidad`. Si afecta 0 filas, responde 409, repone lo ya descontado y deja la boleta `rechazada` con motivo «Stock agotado». Si el pago se rechaza, el stock nunca se toca. No hay transacción distribuida; hay compensación cuando el descuento parcial falla.

**12. ¿Por qué no hay clave foránea entre `BOLETA.usuario_run` y `USUARIO.run`?**
Porque están en esquemas y servicios distintos. Una FK física acoplaría las bases y rompería la independencia. La integridad se valida en la capa de servicio y el JWT garantiza el usuario autenticado. El detalle de boleta guarda un snapshot del producto para que el historial no cambie.

**13. ¿Qué pasa si el pago se rechaza?**
La boleta queda `rechazada` con un motivo, el stock no se descuenta y el Cliente ve la pantalla de error. Desde ahí puede reintentar; el endpoint valida que sea el dueño y que la boleta esté rechazada, revalida stock y vuelve a llamar a la pasarela.

**14. ¿La pasarela es real?**
No, es simulada y lo declaramos en Swagger, README y manual. Rechaza montos sobre $100.000 y un porcentaje configurable al azar. Simula la lógica de un banco para poder demostrar los flujos de aprobación y rechazo sin depender de un servicio externo.

**15. ¿Cómo migraron los datos de la EV2?**
Los 102 productos y 13 categorías se exportaron desde los módulos de datos a la semilla de `ms-catalogo`, preservando IDs y slugs. Los 6 usuarios se cargaron con BCrypt. Las boletas de demo no se migraron: la tabla arranca vacía porque no son datos reales.

**16. ¿Por qué eliminaron "recuperar contraseña"?**
Porque no está en el alcance de la EV3, no aporta a ningún indicador y mantenía 8 tests y un requerimiento que distraían. La decisión fue liberar tiempo para JWT, roles y boletas. Se puede mencionar como trabajo futuro.

**17. ¿Cómo demuestran que el Vendedor solo ve productos y órdenes?**
Hay tres capas: el menú de `AdminLayout` filtra los enlaces, los guards bloquean la URL directa y el backend responde 403 si intenta una acción no permitida. Lo probamos con los tres usuarios y con Postman.

**18. ¿Qué mejorarían con más tiempo?**
Cookie `HttpOnly` para el refresh, API Gateway, pruebas de integración con Testcontainers, CI/CD, observabilidad, paginación real y recuperación de contraseña con correo.

**19. ¿Cómo se relaciona el modelo con la Figura 1 de la PAUTA?**
Mantenemos las cinco tablas: USUARIO, BOLETA, DETALLE_BOLETA, PRODUCTO y CATEGORIA. Agregamos columnas de apoyo (activo, snapshot de producto y dirección) pero no tablas fuera del modelo. Las relaciones son las mismas: usuario → boletas → detalles ← productos ← categoría.

**20. ¿Qué pasa si se cae `ms-catalogo`?**
El catálogo no carga y el Checkout no puede validar productos; `ms-boletas` responde con un error controlado (503/500) en vez de crear una boleta inconsistente. Los otros servicios siguen funcionando. Es una consecuencia de microservicios que asumimos y podemos explicar.

---

## 19. Glosario

| Término | Significado en este proyecto |
|---|---|
| **API REST** | Interfaz HTTP con recursos y verbos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| **Axios** | Cliente HTTP del frontend; reemplaza `fetch` y centraliza tokens/errores |
| **BCrypt** | Algoritmo de hash de contraseñas; nunca se guarda la clave real |
| **Boleta** | Orden de compra persistida; cabecera `BOLETA` + líneas `DETALLE_BOLETA` |
| **CORS** | Regla del navegador que permite o bloquea requests entre orígenes |
| **DTO** | Objeto de transferencia de datos; separa la entidad JPA de la API |
| **Guard** | Componente de React que protege una ruta según sesión/rol |
| **JPA** | API de persistencia de Java; en este proyecto con Hibernate |
| **JWT** | Token firmado con claims; se usa para autenticar sin sesión de servidor |
| **Microservicio** | Servicio independiente con su base y su despliegue |
| **Monorepo** | Un solo repositorio con frontend y backend |
| **PR** | Pull request; revisión antes de integrar a `main` |
| **Proxy** | Redirección de Vite desde `/api/v1/...` al puerto del servicio |
| **Refresh token** | Token de larga duración para obtener un access nuevo |
| **Seed** | Datos iniciales que se cargan en la base |
| **Swagger / OpenAPI** | Documentación interactiva de la API |
| **Tag** | Etiqueta de Git que marca la versión entregada |

---

## Anexo A — Inventario del frontend actual

### A.1 Carpetas

```text
grwu-react/src/
├── assets/          # imágenes de Vite/React
├── components/      # Layout, AdminLayout, ProductCard, BlogCard, formularios, tablas, gráficos
├── context/         # CarritoContext, carritoReducer, SesionContext
├── data/            # storage, usuarios, productos, categorias, ordenes, carrito, blogs, contactos, regiones
├── demo/            # componentes de demo (DemoInicio, DemoNavbar, DemoPendiente, productosDemo)
├── pages/           # tienda
│   └── admin/       # panel
├── services/        # pago.js (pasarela simulada)
├── styles/          # CSS por área
├── tests/           # 23 archivos .spec (168 pruebas reportadas en EV2)
└── utils/           # validaciones, formularios, formatos, reportes, confeti
```

### A.2 Páginas de tienda

`Home`, `Productos`, `DetalleProducto`, `Categorias`, `Categoria`, `Ofertas`, `Carrito`, `Checkout`, `PagoCorrecto`, `PagoError`, `Registro`, `Login`, `RecuperarClave` (se elimina), `Nosotros`, `Blogs`, `BlogDetalle`, `Contacto`.

### A.3 Páginas de admin

`AdminDashboard`, `AdminOrdenes`, `AdminBoleta`, `AdminProductos`, `AdminProductoNuevo`, `AdminProductoEditar`, `AdminProductosCriticos`, `AdminCategorias`, `AdminCategoriaNueva`, `AdminCategoriaEditar`, `AdminUsuarios`, `AdminUsuarioNuevo`, `AdminUsuarioEditar`, `AdminHistorialCompras`, `AdminReportes`, `AdminPerfil`, `AdminBlogs`, `AdminContactos`.

### A.4 Servicios y utilidades actuales

- `services/pago.js`: pasarela simulada (se mueve al backend).
- `utils/validaciones.js`: RUN, correo, contraseña, teléfono.
- `utils/formularios.js`: validación de login, registro, checkout.
- `utils/validacionesAdmin.js`: validaciones de productos, categorías y usuarios.
- `utils/reportes.js`: cálculos de ventas y top de productos.
- `utils/formatos.js`: CLP, fechas.
- `utils/confeti.js`: efecto de compra exitosa.

### A.5 Tests actuales (23 archivos)

`adminProductoNuevo`, `adminReportesHistorial`, `adminUsuarios`, `CampoFormulario`, `carritoData`, `carritoReducer`, `categoriasData`, `confeti`, `Contacto`, `detalleProducto`, `flujo-compra`, `formularios`, `Login`, `ordenesData`, `pago`, `productos`, `productosData`, `RecuperarClave` (se elimina), `Registro`, `reportes`, `usuariosData`, `validaciones`, `validacionesAdmin`.

---

**Fin del documento.** Si algo de este contexto cambia, se actualiza aquí y se avisa al equipo antes de tocar código. La fuente final siempre son las PAUTAS oficiales de la Evaluación Parcial 3.
