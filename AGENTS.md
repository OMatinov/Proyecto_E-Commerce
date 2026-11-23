# AGENTS.md — Instrucciones obligatorias para agentes de IA

> **Proyecto:** GRWU E-Commerce — Evaluación Parcial 3 (DSY1104 Desarrollo FullStack II, Duoc UC).
> **Este archivo** lo leen automáticamente OpenCode, Cursor, Claude Code y agentes similares al abrir el repositorio.
> **Documento hermano:** `CONTEXTO_EQUIPO_EV3.md` contiene el contexto completo, el contrato de API, el reparto de trabajo y las preguntas de defensa. Si algo no está aquí, búscalo allí antes de inventarlo.
> **Jerarquía de verdad:** PAUTAS oficiales de la evaluación > `CONTEXTO_EQUIPO_EV3.md` > este archivo > cualquier sugerencia de una IA.

---

## 0. REGLA OBLIGATORIA ANTES DE EDITAR CUALQUIER ARCHIVO

Antes de crear, modificar o borrar un archivo, el agente debe preguntar **exactamente** esto y esperar respuesta:

> **¿Quién eres: Matías, César o Katerine?**

Reglas de esta pregunta:

1. **No se puede omitir**, aunque la tarea parezca obvia, sea solo documentación o el usuario ya haya hablado antes.
2. **No se edita nada hasta tener la respuesta.** Mientras no responda, el agente solo puede leer, buscar, explicar y proponer.
3. Si la respuesta no es uno de los tres nombres, el agente **no edita archivos**; solo entrega análisis o un parche propuesto en el chat.
4. Con la identidad confirmada, el agente debe limitar las ediciones a la zona de propiedad de esa persona (sección 7).
5. Si el pedido toca archivos de otro integrante, el agente debe advertirlo y pedir confirmación explícita:
   > "Ese archivo pertenece a César. ¿Confirmas que César autorizó este cambio?"
   Sin un "sí" explícito, no se edita.
6. El agente **nunca** hace commits ni configura Git con la identidad de otro integrante.

**Motivo:** el 60 % de la nota de la EV3 es una defensa oral individual. Cada integrante debe poder explicar el código que está en el repositorio. Un agente que edita archivos ajenos rompe la trazabilidad y pone en riesgo la nota de todo el equipo.

---

## 1. Qué es este repositorio

Monorepo del e-commerce **GRWU** (ropa urbana unisex). La EV1 fue HTML/CSS/JS puro; la EV2 migró a React con persistencia en `localStorage`; la **EV3** reemplaza esa persistencia por un backend real con tres microservicios Spring Boot, base de datos MySQL, seguridad con JWT y API REST documentada en Swagger.

**Arquitectura objetivo (decidida, no reabrir):**

```text
Navegador
   │
   ▼
Frontend React + Vite  (http://localhost:5173)
   │  Axios con rutas relativas /api/v1/...
   │  Vite proxy en desarrollo
   ├──────────────► ms-usuarios   :8081  /api/v1/auth, /api/v1/usuarios
   ├──────────────► ms-catalogo   :8082  /api/v1/productos, /api/v1/categorias
   └──────────────► ms-boletas    :8083  /api/v1/boletas (incluye pasarela simulada)
```

- **No hay API Gateway.** El frontend llama directo a cada servicio; en desarrollo lo hace a través del proxy de Vite para evitar CORS.
- **Una base de datos por servicio** (tres esquemas en la misma instancia MySQL 8): `grwu_usuarios`, `grwu_catalogo`, `grwu_boletas`.
- **Blogs y Contactos quedan fuera del backend.** Se mantienen como contenido estático/local del frontend y no se documentan en Swagger. No crearles endpoints ni tablas.

**Estructura del repositorio:** el frontend React vive en `grwu-react/` y el backend en `backend/`, al lado, en la raíz del repo. El frontend **no se mueve**. El agente debe **verificar siempre la estructura real** con `ls` / `Get-ChildItem` antes de asumir rutas. Las rutas del backend se escriben desde la raíz; las del frontend llevan el prefijo `grwu-react/`.

---

## 2. Reglas duras (no negociables)

1. **No editar código si el usuario solo pide analizar, explicar, documentar o planificar.** Preguntar antes de tocar.
2. **Preguntar la identidad antes de editar** (sección 0).
3. **Respetar la propiedad de archivos** (sección 7). No "arreglar de pasada" código ajeno.
4. **Explicar todo el código generado.** No se acepta un bloque de código sin explicación. Ver sección 10.
5. **Nada simulado en la demo.** La presentación se ejecuta contra backend y base de datos reales. Si algo no funciona, se dice; no se maquilla con datos falsos ni se reemplaza la API por `localStorage`.
6. **No commitear secretos.** `JWT_SECRET`, contraseñas de MySQL y claves de entorno van en `.env` / variables de entorno, nunca en `application.yml` versionado ni en el frontend.
7. **No usar `localStorage` como base de datos.** Solo se permite guardar el refresh token, preferencias no sensibles, el carrito (`GRWU_Cart`), los blogs (`grwu_blogs`) y los contactos (`grwu_contactos`). Usuarios, productos, categorías y boletas viven en MySQL y siempre se leen y escriben por API.
8. **Contrato primero.** Antes de programar un endpoint, debe existir en `CONTEXTO_EQUIPO_EV3.md` o en el Anexo 3. Si hay que cambiarlo, se avisa al equipo y se actualizan los tres consumidores.
9. **No agregar dependencias nuevas sin aprobación explícita** del usuario. Nada de librerías de estado, UI, ORM o testing alternativas "porque son mejores".
10. **No reformatear archivos completos** ni cambiar comillas, puntos y coma o indentación de código ajeno. Cambios mínimos y localizados.
11. **No borrar trabajo no commiteado.** Si hay archivos modificados que el agente no creó, preguntar antes de sobrescribir.
12. **Idioma:** interfaz, mensajes al usuario, nombres de dominio (entidades, DTOs, rutas) y documentación en **español**. Se aceptan términos técnicos en inglés (`service`, `controller`, `repository`, `token`, `endpoint`).
13. **No reintroducir `/recuperar-clave`.** Esa ruta, su enlace, su página, sus 8 tests y el RF-18 se eliminan en la EV3 (decisión D7). Si el usuario pide "recuperar contraseña", advertir que está fuera de alcance y no implementarlo sin cambiar la decisión por escrito.
14. **No crear un API Gateway** ni un módulo agregador. Tres servicios y punto.
15. **No agregar endpoints de Blogs ni Contactos.** Están excluidos del backend.
16. **El backend es la autoridad.** El frontend nunca calcula el total definitivo, ni el envío, ni descuenta stock, ni decide roles. Solo muestra y envía datos.
17. **Roles exactos:** `Administrador`, `Vendedor`, `Cliente` (con mayúscula inicial y sin tildes). No inventar `ADMIN`, `ROLE_ADMIN`, `vendedor`, etc. en el JSON; el mapeo a `ROLE_...` de Spring Security es interno.
18. **IDs y formatos:** respetar `RUN` como identificador de usuario, `p-001` para productos, `c-001` / `c-g-hombre` para categorías y `ORD-20260001` para boletas. No cambiarlos por `Long` autoincremental en la API.
19. **Dinero en pesos chilenos enteros.** Sin decimales, sin `float`/`double`. En Java usar `Integer`/`Long`; en MySQL `INT`/`BIGINT`.
20. **Si una instrucción del usuario contradice este archivo o las PAUTAS, señalarlo antes de actuar.** No obedecer en silencio algo que rompe la entrega.

---

## 3. Stack y estructura objetivo

### 3.1 Backend (por cada microservicio)

- Java 21, Spring Boot 3.x, Maven (usar `mvnw` incluido por Spring Initializr).
- Spring Web, Spring Data JPA, Validation, Spring Security, MySQL Driver, Lombok (opcional pero consistente), springdoc-openapi.
- Capas obligatorias: `controller → service → repository → entity`; DTOs para entrada/salida; `@RestControllerAdvice` para errores.
- Paquetes base:
  - `cl.grwu.usuarios`
  - `cl.grwu.catalogo`
  - `cl.grwu.boletas`
- Subpaquetes: `config`, `controller`, `dto`, `entity`, `repository`, `service`, `exception`, `security` (solo usuarios y validación JWT en los otros dos).
- Nombres de tablas y columnas en `snake_case`; JSON en `camelCase`.
- Fechas en ISO-8601 UTC con sufijo `Z` (en Java `Instant`, en MySQL `DATETIME(6)`); `YYYY-MM-DD` solo para fecha de nacimiento.

### 3.2 Frontend

- React 19 + Vite 8 + React Router 7 + Bootstrap 5 (lo ya existente).
- **Axios** para todas las llamadas HTTP. No mezclar `fetch` y Axios en el mismo módulo.
- Rutas relativas `/api/v1/...`. Nunca hardcodear `http://localhost:8081` en componentes.
- `grwu-react/src/services/` concentra las llamadas. Los componentes no importan Axios directamente.
- `grwu-react/src/context/SesionContext.jsx` mantiene el estado de autenticación; el access token vive en memoria y el refresh token en `localStorage`.
- Guards de ruta y menú por rol (sección 8).
- Mantener Karma + Jasmine + Testing Library. Comando de verificación: `npm run test:coverage`.

### 3.3 Estructura final esperada

```text
/  (raíz del repo)
├── AGENTS.md
├── CONTEXTO_EQUIPO_EV3.md
├── backend/
│   ├── ms-usuarios/
│   ├── ms-catalogo/
│   └── ms-boletas/
├── docs/                     # ERS, anexos, capturas, presentación
└── grwu-react/               # frontend React (no se mueve)
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── karma.conf.cjs
    ├── index.html
    ├── public/
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

---

## 4. Convenciones de backend

1. **Entidades JPA** con `@Entity`, `@Table(name = "...")`, `@Id` string cuando corresponda (`run`, `p-001`, `c-001`, `ORD-...`). No usar `GenerationType.IDENTITY` para esos IDs; el servicio calcula el siguiente.
2. **Relaciones:** solo dentro del mismo esquema. `Producto → Categoria` es `@ManyToOne` real. `Boleta → DetalleBoleta` es `@OneToMany` con `cascade = ALL`. Entre microservicios **no hay FK física**: `Boleta.usuarioRun` y `DetalleBoleta.productoId` son referencias lógicas.
3. **DTOs:** nunca exponer entidades con `claveHash` ni relaciones cíclicas. Usar `record` o clases con getters/setters, coherente dentro del servicio.
4. **Validación:** `jakarta.validation` (`@NotBlank`, `@Email`, `@Min`, `@Max`, `@Pattern`) + validaciones de negocio en el servicio (RUN módulo 11, dominios de correo, rango de contraseña, stock, montos).
5. **Errores:** formato único:
   ```json
   {
     "timestamp": "2026-11-17T10:30:00Z",
     "status": 409,
     "error": "Conflict",
     "message": "Stock insuficiente para p-010",
     "path": "/api/v1/boletas",
     "errores": { "items[0].cantidad": "Solo quedan 2 unidades" }
   }
   ```
   `errores` es opcional y solo para validación de campos.
6. **Códigos HTTP:** 200 lectura/actualización, 201 creación, 204 borrado/logout, 400 validación, 401 sin token o token inválido/expirado, 403 rol insuficiente, 404 no encontrado, 409 conflicto de negocio (stock, correo duplicado, transición de estado, pago rechazado si se modela como conflicto), 500 error no controlado.
7. **Swagger:** cada servicio expone `springdoc` y anota controladores con `@Tag`, `@Operation`, `@ApiResponse`. Esquema de seguridad `bearerAuth`. Swagger UI en `http://localhost:PORT/swagger-ui/index.html`.
8. **Seguridad:** contraseñas con `BCryptPasswordEncoder`; JWT firmado HS256 con el **mismo secreto** en los tres servicios (`JWT_SECRET`, mínimo 32 caracteres); `issuer = grwu-auth`; claims `sub` (RUN), `rol`, `nombre`; access token 15 minutos; refresh token 7 días. Los servicios 8082/8083 validan la firma localmente, sin llamar a 8081 en cada request.
9. **CORS:** permitir solo `http://localhost:5173` (y el origen que se use en la entrega). No `*` con credenciales.
10. **Pruebas:** JUnit 5 + Mockito para servicios y reglas de negocio; `@WebMvcTest`/MockMvc para controladores; mínimo 8 pruebas significativas por servicio. No tests triviales de getters.
11. **Seed:** cargar los 102 productos, 13 categorías y 6 usuarios iniciales de forma idempotente (`INSERT ... ON DUPLICATE KEY UPDATE` o `CommandLineRunner` que verifica existencia). Los usuarios seed llevan contraseña `1234` **hasheada con BCrypt**, nunca en texto plano.
12. **Configuración:** `application.yml` con variables de entorno y valores por defecto solo para desarrollo local. `ddl-auto=update` en desarrollo; `validate` para la entrega si el esquema ya está estable.

---

## 5. Convenciones de frontend

1. **Instancia única de Axios** en `grwu-react/src/services/api.js`:
   - `baseURL: "/api/v1"`.
   - Interceptor de request: agrega `Authorization: Bearer <accessToken>` si existe.
   - Interceptor de response: en 401 intenta **un solo** refresh; si falla, cierra sesión y redirige a `/login`. No entrar en loop.
   - Normaliza errores a `{ mensaje, status, errores }` para que la UI no dependa del formato de Axios.
2. **Servicios por dominio:** `auth.js`, `usuarios.js`, `productos.js`, `categorias.js`, `boletas.js`. Nada de URLs sueltas en componentes.
3. **Adaptadores:** `grwu-react/src/services/adapters.js` traduce entre el contrato de la API y las formas que ya usan los componentes. Caso obligatorio: la API usa `cantidad`; el carrito local usa `qty`; el adaptador convierte en el límite del servicio (`qty → cantidad` al enviar, `cantidad` al mostrar). No cambiar el carrito entero solo por el nombre.
4. **Sesión:** el access token **no** se persiste; el refresh token sí. Al recargar, `SesionContext` llama a `/auth/refresh`, obtiene un access nuevo y luego a `/usuarios/me` para reconstruir el usuario. Nunca guardar la contraseña.
5. **Guards:** componente `RutaProtegida` (exige sesión) y `RutaPorRol` (exige uno o más roles). Se aplican en `App.jsx` envolviendo layouts/rutas. El backend igual valida; el guard es UX, no seguridad real.
6. **Menú:** `AdminLayout` arma los enlaces según `usuario.tipoUsuario`. Vendedor solo ve Órdenes y Productos. Cliente no ve el panel. Si un usuario escribe una URL prohibida, se redirige (no se muestra un 403 crudo).
7. **Estados de UI:** toda llamada debe manejar `cargando`, `error` y `vacío`. No dejar pantallas en blanco si el backend está caído.
8. **Formularios:** mantener las validaciones existentes en `grwu-react/src/utils/validaciones.js` como espejo de las del backend; el backend sigue siendo la autoridad.
9. **Estilos:** usar la paleta vigente definida en `grwu-react/src/styles/styles.css`: primario `#4B1D5A`, secundario `#244FA4`, acento `#02756D`, fondo `#F7F7F7`, texto `#333333`; tipografías **Bebas Neue** (títulos) y **Poppins** (cuerpo). Solo se importan `styles.css`, `home.css` y `catalogo.css` en `main.jsx`, y `admin.css` en `AdminLayout.jsx`. El resto de `grwu-react/src/styles` no está en uso: no se importa ni se edita. La paleta crema/vino de la EV1 es solo historia y no se usa. No introducir Tailwind ni otra librería visual.
10. **Pruebas:** mockear `grwu-react/src/services/*` con Jasmine (`spyOn`) en lugar de pegarle al backend real. Los tests deben correr sin MySQL ni servicios levantados.

---

## 6. Contrato resumido (detalle completo en `CONTEXTO_EQUIPO_EV3.md`)

**Puertos y esquemas:**

| Servicio | Puerto | Esquema MySQL | Responsabilidad |
|---|---:|---|---|
| `ms-usuarios` | 8081 | `grwu_usuarios` | Usuarios, login, registro, refresh, roles |
| `ms-catalogo` | 8082 | `grwu_catalogo` | Productos, categorías, stock |
| `ms-boletas` | 8083 | `grwu_boletas` | Boletas, detalles, pagos simulados, estados |

**Rutas base:** `/api/v1/auth`, `/api/v1/usuarios`, `/api/v1/productos`, `/api/v1/categorias`, `/api/v1/boletas`.

**IDs:** `run` (7–9 caracteres, DV incluido), `p-###`, `c-###` / `c-g-hombre` / `c-g-mujer`, `ORD-{año}{secuencia4}` (ej. `ORD-20260001`).

**Enums:** rol `Administrador | Vendedor | Cliente`; estado de boleta `pagada | rechazada | enviada | entregada | cancelada`; despacho `estandar | premium`; pago `credito | debito | transferencia`.

**Reglas de negocio que el backend debe hacer sí o sí:**
- Recalcular subtotal con precios de la BD, envío y total. Ignorar montos enviados por el cliente.
- Envío: gratis si subtotal ≥ `44.990`; estándar `3.990`; premium `5.990`.
- Validar stock y descontarlo solo si el pago se aprueba.
- Pasarela simulada en `ms-boletas`: rechaza total > `100.000`; probabilidad de rechazo configurable (por defecto `0.10`); endpoint de reintento para boletas rechazadas; declarar en Swagger y manual que es simulada.
- Repetir validaciones: RUN módulo 11, correos `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`, contraseña 4–10 caracteres, teléfono, campos obligatorios.

---

## 7. Propiedad de archivos (respetar siempre)

> Las rutas del frontend se escriben desde `grwu-react/`; las del backend, desde la raíz del repo.

| Integrante | Backend | Frontend | Documentos |
|---|---|---|---|
| **Matías** | `backend/ms-catalogo/**` | `grwu-react/src/services/productos.js`, `grwu-react/src/services/categorias.js`, `grwu-react/src/pages/Home.jsx`, `Productos.jsx`, `DetalleProducto.jsx`, `Ofertas.jsx`, `Categorias.jsx`, `Categoria.jsx`, `grwu-react/src/pages/admin/AdminProductos.jsx`, `AdminProductoNuevo.jsx`, `AdminProductoEditar.jsx`, `AdminProductoDetalle.jsx` (nuevo), `AdminProductosCriticos.jsx`, `AdminCategorias.jsx`, `AdminCategoriaNueva.jsx`, `AdminCategoriaEditar.jsx`, `grwu-react/src/components/ProductCard.jsx`, `grwu-react/src/data/productosData.js`, `grwu-react/src/data/categoriasData.js` | ERS V3 (`docs/ERS_GRWU_V3.docx`) |
| **César** | `backend/ms-usuarios/**` | `grwu-react/src/services/auth.js`, `grwu-react/src/services/usuarios.js`, `grwu-react/src/context/SesionContext.jsx`, `grwu-react/src/pages/Login.jsx`, `Registro.jsx`, `Checkout.jsx`, `PagoCorrecto.jsx`, `PagoError.jsx`, `grwu-react/src/pages/admin/AdminUsuarios.jsx`, `AdminUsuarioNuevo.jsx`, `AdminUsuarioEditar.jsx`, `AdminHistorialCompras.jsx`, `grwu-react/src/context/CarritoContext.jsx`, `grwu-react/src/context/carritoReducer.js`, `grwu-react/src/data/carritoData.js`, `grwu-react/src/pages/Carrito.jsx`, `grwu-react/src/data/usuariosData.js` | Anexo 4 (Manual de usuario), informe de testing |
| **Katerine** | `backend/ms-boletas/**` | `vite.config.js`, `grwu-react/src/services/api.js`, `grwu-react/src/services/boletas.js`, `grwu-react/src/services/adapters.js`, `grwu-react/src/components/AdminLayout.jsx`, `grwu-react/src/components/RutaProtegida.jsx` (nuevo), `grwu-react/src/components/RutaPorRol.jsx` (nuevo), `grwu-react/src/App.jsx`, `grwu-react/src/pages/admin/AdminOrdenes.jsx`, `AdminBoleta.jsx`, `AdminDashboard.jsx`, `AdminReportes.jsx`, `grwu-react/src/services/pago.js`, `grwu-react/src/data/ordenesData.js`, `grwu-react/src/pages/admin/AdminBlogs.jsx`, `AdminContactos.jsx`, `grwu-react/src/pages/Blogs.jsx`, `BlogDetalle.jsx`, `Contacto.jsx`, `Nosotros.jsx` | Anexo 2, Anexo 3, Swagger, presentación, orden del repo |

**Archivos compartidos** (`package.json`, `karma.conf.cjs`, `README.md`, `.gitignore`, `main.jsx`): los aplica **Katerine** como integradora, con revisión de los otros dos. Cualquier cambio ahí se avisa en el canal del equipo.

**Tests:** cada dueño escribe y mantiene los tests de su área. `grwu-react/src/tests/flujo-compra.spec.jsx` es compartido César/Katerine y se coordina antes de tocarlo.

---

## 8. Matriz de acceso (frontend y backend)

| Ruta frontend | Público | Cliente | Vendedor | Administrador |
|---|:---:|:---:|:---:|:---:|
| `/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:slug`, `/ofertas`, `/nosotros`, `/blogs`, `/blogs/:id`, `/contacto` | ✅ | ✅ | ✅ | ✅ |
| `/carrito` | ✅ | ✅ | ✅ | ✅ |
| `/login`, `/registro` | ✅ | — | — | — |
| `/checkout`, `/pago-correcto/:id`, `/pago-error/:id` | ❌ | ✅ | ❌ | ❌ |
| `/admin` (dashboard), `/admin/reportes`, `/admin/usuarios/**`, `/admin/categorias/**`, `/admin/blogs`, `/admin/contactos` | ❌ | ❌ | ❌ | ✅ |
| `/admin/productos`, `/admin/productos/:id` (detalle) | ❌ | ❌ | ✅ solo lectura | ✅ |
| `/admin/ordenes`, `/admin/ordenes/:id` | ❌ | ❌ | ✅ solo lectura | ✅ |

**Comportamiento esperado:** sin sesión → `/login`; sesión con rol insuficiente → redirección a su vista permitida (Cliente a `/`, Vendedor a `/admin/productos`), no un error crudo. El backend responde **401** sin token y **403** con token de rol insuficiente. Ambos casos deben probarse.

---

## 9. Comandos de verificación

**Frontend (`grwu-react/`):**

```bash
cd grwu-react
npm install
npm run dev                 # http://localhost:5173
npm run build
npm run lint
npm run test:coverage       # una sola corrida + cobertura; usar este, no `npm test` (queda observando)
```

**Backend (uno por servicio):**

```bash
cd backend/ms-usuarios && ./mvnw spring-boot:run     # Windows: mvnw.cmd spring-boot:run
cd backend/ms-catalogo && ./mvnw spring-boot:run
cd backend/ms-boletas  && ./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

**Swagger:**

- `http://localhost:8081/swagger-ui/index.html`
- `http://localhost:8082/swagger-ui/index.html`
- `http://localhost:8083/swagger-ui/index.html`

**MySQL:** una instancia en `localhost:3306` con los esquemas `grwu_usuarios`, `grwu_catalogo`, `grwu_boletas`. Credenciales en `.env`; no en el repositorio.

---

## 10. Cómo explicar el código (obligatorio)

Cada vez que el agente genere o modifique código, debe entregar esta explicación **antes o junto con el cambio**, en español y sin omitir archivos:

1. **Qué se cambió:** archivos y funciones tocadas.
2. **Por qué:** qué requisito, decisión o error resuelve; indicador de la rúbrica al que aporta (IE3.x.x) si aplica.
3. **Cómo funciona:** flujo de datos paso a paso (quién llama a quién, qué se envía, qué se recibe, qué se guarda).
4. **Cómo se prueba:** comando, caso manual o test que demuestra que funciona.
5. **Qué debe poder responder el integrante en la defensa:** 2–4 preguntas probables sobre ese cambio.

Formato sugerido:

```text
Archivo: grwu-react/src/services/boletas.js
Qué: agregué crearBoleta() y el adaptador qty→cantidad.
Por qué: el Checkout debe crear la boleta en ms-boletas (IE3.2.2) y el backend exige cantidad.
Cómo: el componente envía items {productoId, cantidad}; Axios agrega el Bearer; el interceptor
      renueva el token si recibe 401; la respuesta se normaliza a la forma que usa la UI.
Prueba: npm run test:coverage (spec de boletas) + compra manual con cliente.
Defensa: ¿por qué el total se recalcula en el backend? ¿qué pasa si el token expira?
```

**Prohibido:** entregar código sin explicación, decir "ya está listo" sin comando de prueba, o afirmar que un test pasa sin haberlo ejecutado.

---

## 11. Verificación antes de cerrar una tarea

El agente debe completar esta lista y reportarla:

- [ ] La identidad fue confirmada y el cambio está dentro de la zona del integrante.
- [ ] No se tocaron archivos ajenos sin autorización.
- [ ] `npm run test:coverage` pasa (o se indica exactamente qué falla y por qué).
- [ ] `npm run build` compila sin errores.
- [ ] Los tests del backend afectados pasan (`./mvnw test`).
- [ ] No hay `console.log` de depuración, credenciales ni URLs absolutas hardcodeadas.
- [ ] `localStorage` solo se usa para refresh token, preferencias no sensibles, carrito (`GRWU_Cart`), blogs (`grwu_blogs`) y contactos (`grwu_contactos`); usuarios, productos, categorías y boletas vienen de la API.
- [ ] Se actualizó el contrato/Anexo 3 si cambió un endpoint o un campo.
- [ ] Se explicó el cambio según la sección 10.
- [ ] Se listan los archivos modificados y el siguiente paso concreto.

---

## 12. Errores frecuentes que el agente debe evitar en este proyecto

1. Asumir que el frontend está en la raíz del repo: vive en `grwu-react/` y no se mueve.
2. Crear un `api-gateway` "para ordenar" las rutas. **No.**
3. Poner `http://localhost:8081` en un componente en vez de usar el proxy/Axios.
4. Guardar el access token en `localStorage` "para que no se pierda". El access va en memoria; el refresh es lo persistente.
5. Dejar `/admin` sin guard porque "el backend ya valida". La rúbrica evalúa ambas capas.
6. Mostrar el menú completo al Vendedor y ocultar solo los botones. Debe desaparecer todo lo no permitido.
7. Calcular el total en el frontend y confiar en él. El backend recalcula.
8. Usar `prod.cantidad` en `AdminBoleta` sin adaptar los ítems que hoy traen `qty`. Ese es un bug real de la EV2 que la decisión D4 corrige.
9. Crear endpoints o tablas para Blogs/Contactos. Están fuera de alcance.
10. Volver a agregar "recuperar contraseña". Fue eliminado a propósito.
11. Poner contraseñas seed en texto plano o en `data.sql` sin BCrypt.
12. Compartir el mismo esquema MySQL para los tres servicios. Cada uno tiene el suyo.
13. Hacer `git push` directo a `main` sin PR. El flujo es rama → PR revisado → merge.
14. Commitear `node_modules/`, `target/`, `dist/`, `coverage/` o `.env`.
15. Simular la demo con datos inventados. Si el backend no responde, se muestra el error real y se explica.

---

## 13. Entrega y congelamiento

- **Una rama por integrante**, PR revisado por otro, merge a `main`.
- **Congelamiento de código** en la fecha/hora que fije el equipo. Después del corte no se hace push; se etiqueta la entrega (`ev3-entrega-1.0`) y se presenta desde ese tag.
- Documentos obligatorios: ERS V3, Anexo 2 (APIs e Integración), Anexo 3 (planilla Excel de APIs), Anexo 4 (Manual de usuario), Swagger de los tres servicios, presentación de 15 minutos.
- Cada integrante debe poder explicar **todo** el flujo (backend, API, integración, JWT, sesión y restricciones), no solo su parte. El 60 % de la nota es individual.

**Si el agente detecta que se está por romper una de estas reglas, debe detenerse y avisar antes de continuar.**
