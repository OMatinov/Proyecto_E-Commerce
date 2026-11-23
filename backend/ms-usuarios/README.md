# ms-usuarios (puerto 8081)

Microservicio de **usuarios, autenticación (JWT) y roles** de GRWU. Dueño: César.

## Requisitos
- Java 21
- MySQL 8 en `localhost:3306`
- Maven (o el wrapper `./mvnw` si el proyecto lo incluye)

## Base de datos
Esquema propio: `grwu_usuarios` (uno por servicio). Crear el usuario y el esquema una sola vez:

```sql
CREATE DATABASE IF NOT EXISTS grwu_usuarios CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'grwu'@'localhost' IDENTIFIED BY 'cambiar';
GRANT ALL PRIVILEGES ON grwu_usuarios.* TO 'grwu'@'localhost';
```

Hibernate crea la tabla `usuario` al arrancar (`ddl-auto: update`).

## Variables de entorno
| Variable | Por defecto | Uso |
|---|---|---|
| `DB_HOST` / `DB_PORT` | `localhost` / `3306` | Conexión a MySQL |
| `DB_USER` / `DB_PASSWORD` | `grwu` / *(vacía)* | Credenciales de MySQL |
| `SERVER_PORT` | `8081` | Puerto del servicio |
| `JWT_SECRET` | **sin valor por defecto** | Clave para firmar los JWT. Mínimo 32 caracteres y **idéntica en los tres servicios**. Sin ella el servicio no arranca. |
| `JWT_ACCESS_MINUTES` / `JWT_REFRESH_DAYS` | `15` / `7` | Duración de los tokens |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:5173` | Origen del frontend permitido |

Ejemplo (PowerShell): `$env:DB_PASSWORD="cambiar"; $env:JWT_SECRET="cambia-esto-por-un-secreto-largo-1234"; mvn spring-boot:run`

En IntelliJ: Run → Edit Configurations → Environment variables → `DB_PASSWORD=cambiar;JWT_SECRET=cambia-esto-por-un-secreto-largo-1234`

## Comandos
```bash
mvn test                # o ./mvnw test
mvn spring-boot:run     # o ./mvnw spring-boot:run
```
Swagger: http://localhost:8081/swagger-ui/index.html

## Usuarios de prueba (semilla)
Al arrancar con la tabla `usuario` vacía se crean 6 usuarios (los mismos de la EV2). **Todos usan la clave `1234`.**

| Correo | Rol |
|---|---|
| `camila.olmedo@duoc.cl` | Administrador |
| `katerine.soto@profesor.duoc.cl` | Administrador |
| `matias.fuentes@duoc.cl` | Vendedor |
| `cesar.munoz@gmail.com` | Vendedor |
| `javiera.contreras@gmail.com` | Cliente |
| `ignacio.reyes@gmail.com` | Cliente |

## Endpoints (contrato v1.0, secciones 8.3 y 8.4)
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/v1/auth/login` | Público |
| POST | `/api/v1/auth/registro` | Público (siempre crea un Cliente) |
| POST | `/api/v1/auth/refresh` | Público con refresh token (rota el refresh) |
| POST | `/api/v1/auth/logout` | Autenticado |
| GET / POST | `/api/v1/usuarios` | Administrador |
| GET / PUT / DELETE | `/api/v1/usuarios/{run}` | Administrador (DELETE = borrado lógico) |
| GET / PUT | `/api/v1/usuarios/me` | Autenticado |
| PUT | `/api/v1/usuarios/me/clave` | Autenticado |

## Probar con Swagger (http://localhost:8081/swagger-ui/index.html)
1. `POST /auth/login` con `{"correo":"camila.olmedo@duoc.cl","clave":"1234"}` y copiar el `accessToken`.
2. Botón **Authorize** (candado) -> pegar solo el token (sin la palabra Bearer) -> Authorize.
3. Probar `GET /usuarios/me`, `GET /usuarios`, etc. Con el token de un Cliente, `GET /usuarios` responde 403.
