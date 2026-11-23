// servicios.spec.js - auth, usuarios y boletas: URLs, cuerpos y manejo de tokens (api mockeada).
import api from "../services/api.js";
import axios from "axios";
import auth from "../services/auth.js";
import usuarios from "../services/usuarios.js";
import boletas from "../services/boletas.js";
import { getAccessToken, getRefreshToken, guardarTokens, limpiarTokens, setRefreshToken } from "../services/tokenStore.js";
import { CLIENTE } from "./apoyo.jsx";

describe("servicio auth", () => {
  beforeEach(limpiarTokens);
  afterEach(limpiarTokens);

  it("login envía correo y clave, guarda ambos tokens y devuelve el usuario", async () => {
    const post = spyOn(api, "post").and.resolveTo({ data: { accessToken: "a1", refreshToken: "r1", usuario: CLIENTE } });
    const usuario = await auth.login("  ana@gmail.com ", "1234");
    expect(post).toHaveBeenCalledWith("/auth/login", { correo: "ana@gmail.com", clave: "1234" });
    expect(getAccessToken()).toBe("a1");
    expect(getRefreshToken()).toBe("r1");
    expect(usuario).toEqual(CLIENTE);
  });

  it("login con credenciales malas propaga el error y no guarda tokens", async () => {
    spyOn(api, "post").and.rejectWith(new Error("401"));
    await expectAsync(auth.login("a@gmail.com", "x")).toBeRejected();
    expect(getAccessToken()).toBeNull();
  });

  it("registro hace POST /auth/registro y devuelve el usuario creado", async () => {
    const post = spyOn(api, "post").and.resolveTo({ data: CLIENTE });
    expect(await auth.registro({ run: "205558993" })).toEqual(CLIENTE);
    expect(post).toHaveBeenCalledWith("/auth/registro", { run: "205558993" });
  });

  it("restaurar devuelve null (sin llamar al servidor) si no hay refresh token", async () => {
    const post = spyOn(axios, "post");
    expect(await auth.restaurar()).toBeNull();
    expect(post).not.toHaveBeenCalled();
  });

  it("restaurar renueva el access con el refresh y lee /usuarios/me", async () => {
    setRefreshToken("r-guardado");
    spyOn(axios, "post").and.resolveTo({ data: { accessToken: "a2", refreshToken: "r2" } });
    const get = spyOn(api, "get").and.resolveTo({ data: CLIENTE });
    expect(await auth.restaurar()).toEqual(CLIENTE);
    expect(get).toHaveBeenCalledWith("/usuarios/me");
    expect(getAccessToken()).toBe("a2");
  });

  it("logout invalida el refresh en el servidor y limpia los tokens", async () => {
    guardarTokens({ accessToken: "a", refreshToken: "r" });
    const post = spyOn(api, "post").and.resolveTo({});
    await auth.logout();
    expect(post).toHaveBeenCalledWith("/auth/logout", { refreshToken: "r" });
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("logout limpia los tokens aunque el servidor falle", async () => {
    guardarTokens({ accessToken: "a", refreshToken: "r" });
    spyOn(api, "post").and.rejectWith(new Error("caído"));
    await expectAsync(auth.logout()).toBeResolved();
    expect(getRefreshToken()).toBeNull();
  });
});

describe("servicio usuarios", () => {
  it("usa las rutas del contrato y devuelve los datos", async () => {
    const get = spyOn(api, "get").and.resolveTo({ data: [CLIENTE] });
    const post = spyOn(api, "post").and.resolveTo({ data: CLIENTE });
    const put = spyOn(api, "put").and.resolveTo({ data: CLIENTE });
    const del = spyOn(api, "delete").and.resolveTo({});

    expect(await usuarios.listar()).toEqual([CLIENTE]);
    expect(get).toHaveBeenCalledWith("/usuarios");
    await usuarios.obtener("205558993");
    expect(get).toHaveBeenCalledWith("/usuarios/205558993");
    await usuarios.perfil();
    expect(get).toHaveBeenCalledWith("/usuarios/me");
    await usuarios.crear({ run: "1" });
    expect(post).toHaveBeenCalledWith("/usuarios", { run: "1" });
    await usuarios.actualizar("205558993", { nombre: "N" });
    expect(put).toHaveBeenCalledWith("/usuarios/205558993", { nombre: "N" });
    await usuarios.actualizarPerfil({ nombre: "M" });
    expect(put).toHaveBeenCalledWith("/usuarios/me", { nombre: "M" });
    await usuarios.cambiarClave({ claveActual: "a", claveNueva: "b" });
    expect(put).toHaveBeenCalledWith("/usuarios/me/clave", { claveActual: "a", claveNueva: "b" });
    await usuarios.eliminar("205558993");
    expect(del).toHaveBeenCalledWith("/usuarios/205558993");
  });
});

describe("servicio boletas", () => {
  it("usa las rutas del contrato (crear, mías, detalle, historial, reintento)", async () => {
    const get = spyOn(api, "get").and.resolveTo({ data: [] });
    const post = spyOn(api, "post").and.resolveTo({ data: { id: "ORD-1" } });

    expect((await boletas.crear({ items: [] })).id).toBe("ORD-1");
    expect(post).toHaveBeenCalledWith("/boletas", { items: [] });
    await boletas.reintentarPago("ORD-1");
    expect(post).toHaveBeenCalledWith("/boletas/ORD-1/reintentar-pago");
    await boletas.obtener("ORD-1");
    expect(get).toHaveBeenCalledWith("/boletas/ORD-1");
    await boletas.mias();
    expect(get).toHaveBeenCalledWith("/boletas/mias");
    await boletas.listar();
    expect(get).toHaveBeenCalledWith("/boletas");
    await boletas.porUsuario("205558993");
    expect(get).toHaveBeenCalledWith("/boletas", { params: { usuarioRun: "205558993" } });
  });
});
