// SesionContext.spec.jsx - Sesión contra ms-usuarios: restauración, login, logout, registro y perfil.
import { render, screen, act, waitFor, cleanup } from "@testing-library/react";
import { SesionProvider, useSesion } from "../context/SesionContext.jsx";
import auth from "../services/auth.js";
import usuariosService from "../services/usuarios.js";
import { getRefreshToken, limpiarTokens, setRefreshToken } from "../services/tokenStore.js";
import { ADMIN, CLIENTE, VENDEDOR, conSesion, errorApi, errorDeRed } from "./apoyo.jsx";

let ctx;
function Sonda() {
  ctx = useSesion();
  return (
    <div>
      <span data-testid="estado">{ctx.cargandoSesion ? "cargando" : ctx.haySesion ? ctx.usuario.nombre : "anonimo"}</span>
      <span data-testid="roles">{[ctx.esAdmin && "admin", ctx.esVendedor && "vendedor", ctx.esCliente && "cliente"].filter(Boolean).join(",")}</span>
    </div>
  );
}
const montar = () => render(<SesionProvider><Sonda /></SesionProvider>);
const estado = () => screen.getByTestId("estado").textContent;
// OJO: el expect de Jasmine no lanza, así que no sirve dentro de waitFor; esta espera sí lanza hasta que se cumple.
const hasta = (condicion) => waitFor(() => { if (!condicion()) throw new Error("aún no se cumple"); });

describe("SesionContext", () => {
  beforeEach(limpiarTokens);
  afterEach(() => { cleanup(); limpiarTokens(); });

  it("sin refresh token no consulta al servidor y queda sin sesión", () => {
    const restaurar = spyOn(auth, "restaurar");
    montar();
    expect(estado()).toBe("anonimo");
    expect(restaurar).not.toHaveBeenCalled();
  });

  it("con refresh token restaura la sesión (cargando -> usuario)", async () => {
    conSesion(CLIENTE);
    montar();
    expect(estado()).toBe("cargando");
    await hasta(() => estado() === "Javiera");
    expect(screen.getByTestId("roles").textContent).toBe("cliente");
  });

  it("si el refresh token ya no sirve (401) limpia los tokens y queda sin sesión", async () => {
    setRefreshToken("vencido");
    spyOn(auth, "restaurar").and.rejectWith(errorApi(401, "Refresh inválido"));
    montar();
    await hasta(() => estado() === "anonimo");
    expect(getRefreshToken()).toBeNull();
  });

  it("si el servidor no responde conserva el refresh token (podrá reintentar)", async () => {
    setRefreshToken("guardado");
    spyOn(auth, "restaurar").and.rejectWith(errorDeRed());
    montar();
    await hasta(() => estado() === "anonimo");
    expect(getRefreshToken()).toBe("guardado");
  });

  it("iniciarSesion correcto deja el usuario y los helpers de rol", async () => {
    spyOn(auth, "login").and.resolveTo(ADMIN);
    montar();
    let res;
    await act(async () => { res = await ctx.iniciarSesion("camila.olmedo@duoc.cl", "1234"); });
    expect(res.ok).toBeTrue();
    expect(res.usuario).toEqual(ADMIN);
    expect(estado()).toBe("Camila");
    expect(screen.getByTestId("roles").textContent).toBe("admin");
  });

  it("el Vendedor se reconoce como vendedor", async () => {
    spyOn(auth, "login").and.resolveTo(VENDEDOR);
    montar();
    await act(async () => { await ctx.iniciarSesion("m@duoc.cl", "1234"); });
    expect(screen.getByTestId("roles").textContent).toBe("vendedor");
  });

  it("iniciarSesion con credenciales malas devuelve el mensaje del backend y no abre sesión", async () => {
    spyOn(auth, "login").and.rejectWith(errorApi(401, "Correo o contraseña incorrectos."));
    montar();
    let res;
    await act(async () => { res = await ctx.iniciarSesion("a@gmail.com", "mala"); });
    expect(res.ok).toBeFalse();
    expect(res.mensaje).toBe("Correo o contraseña incorrectos.");
    expect(res.status).toBe(401);
    expect(estado()).toBe("anonimo");
  });

  it("cerrarSesion vacía el usuario y avisa al servidor", async () => {
    spyOn(auth, "login").and.resolveTo(CLIENTE);
    const logout = spyOn(auth, "logout").and.resolveTo();
    montar();
    await act(async () => { await ctx.iniciarSesion("j@gmail.com", "1234"); });
    await act(async () => { await ctx.cerrarSesion(); });
    expect(estado()).toBe("anonimo");
    expect(logout).toHaveBeenCalled();
  });

  it("registrar crea la cuenta y luego inicia sesión con esas credenciales", async () => {
    const registro = spyOn(auth, "registro").and.resolveTo(CLIENTE);
    const login = spyOn(auth, "login").and.resolveTo(CLIENTE);
    montar();
    let res;
    await act(async () => { res = await ctx.registrar({ run: "205558993", correo: "j@gmail.com", clave: "abcd" }); });
    expect(registro).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith("j@gmail.com", "abcd");
    expect(res.ok).toBeTrue();
    expect(estado()).toBe("Javiera");
  });

  it("registrar con RUN duplicado (409) no inicia sesión y devuelve el error", async () => {
    spyOn(auth, "registro").and.rejectWith(errorApi(409, "Ya existe un usuario con ese RUN."));
    const login = spyOn(auth, "login");
    montar();
    let res;
    await act(async () => { res = await ctx.registrar({ run: "1", correo: "a@gmail.com", clave: "abcd" }); });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(409);
    expect(login).not.toHaveBeenCalled();
  });

  it("registrar con datos inválidos (400) devuelve los errores por campo", async () => {
    spyOn(auth, "registro").and.rejectWith(errorApi(400, "Datos inválidos", { fechaNacimiento: "La fecha de nacimiento es obligatoria." }));
    montar();
    let res;
    await act(async () => { res = await ctx.registrar({ run: "1", correo: "a@gmail.com", clave: "abcd" }); });
    expect(res.errores).toEqual({ fechaNacimiento: "La fecha de nacimiento es obligatoria." });
  });

  it("actualizarPerfil envía el perfil COMPLETO (datos actuales + cambios) y actualiza la sesión", async () => {
    conSesion(CLIENTE);
    const actualizar = spyOn(usuariosService, "actualizarPerfil").and.callFake(async (d) => ({ ...CLIENTE, ...d }));
    montar();
    await hasta(() => estado() === "Javiera");
    let res;
    await act(async () => { res = await ctx.actualizarPerfil({ nombre: "Javi" }); });
    const enviado = actualizar.calls.argsFor(0)[0];
    expect(enviado.nombre).toBe("Javi");
    expect(enviado.fechaNacimiento).toBe(CLIENTE.fechaNacimiento);
    expect(enviado.region).toBe(CLIENTE.region);
    expect(enviado.tipoUsuario).toBeUndefined(); // el perfil nunca cambia el rol
    expect(res.ok).toBeTrue();
    expect(estado()).toBe("Javi");
  });

  it("actualizarPerfil sin sesión devuelve ok = false sin llamar a la API", async () => {
    const actualizar = spyOn(usuariosService, "actualizarPerfil");
    montar();
    let res;
    await act(async () => { res = await ctx.actualizarPerfil({ nombre: "X" }); });
    expect(res.ok).toBeFalse();
    expect(actualizar).not.toHaveBeenCalled();
  });

  it("actualizarPerfil con correo duplicado devuelve el error del backend", async () => {
    conSesion(CLIENTE);
    spyOn(usuariosService, "actualizarPerfil").and.rejectWith(errorApi(409, "Ya existe un usuario con ese correo."));
    montar();
    await hasta(() => estado() === "Javiera");
    let res;
    await act(async () => { res = await ctx.actualizarPerfil({ correo: "otro@gmail.com" }); });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(409);
    expect(estado()).toBe("Javiera");
  });

  it("cambiarClave devuelve ok o el mensaje del backend", async () => {
    const cambiar = spyOn(usuariosService, "cambiarClave").and.resolveTo();
    montar();
    let res;
    await act(async () => { res = await ctx.cambiarClave("vieja", "nueva"); });
    expect(cambiar).toHaveBeenCalledWith({ claveActual: "vieja", claveNueva: "nueva" });
    expect(res.ok).toBeTrue();

    cambiar.and.rejectWith(errorApi(400, "La contraseña actual no es correcta."));
    await act(async () => { res = await ctx.cambiarClave("mala", "nueva"); });
    expect(res.ok).toBeFalse();
    expect(res.mensaje).toBe("La contraseña actual no es correcta.");
  });

  it("recargarUsuario vuelve a leer /usuarios/me", async () => {
    spyOn(auth, "login").and.resolveTo(CLIENTE);
    spyOn(usuariosService, "perfil").and.resolveTo({ ...CLIENTE, nombre: "Renovada" });
    montar();
    await act(async () => { await ctx.iniciarSesion("j@gmail.com", "1234"); });
    await act(async () => { await ctx.recargarUsuario(); });
    expect(estado()).toBe("Renovada");
  });

  it("useSesion fuera del proveedor lanza un error claro", () => {
    spyOn(console, "error"); // React registra el error del render
    expect(() => render(<Sonda />)).toThrowError(/SesionProvider/);
  });
});
