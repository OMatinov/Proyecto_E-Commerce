// api.spec.js - Interceptores de Axios: token en memoria y UN solo refresh ante 401.
import axios, { AxiosError } from "axios";
import api from "../services/api.js";
import { getAccessToken, getRefreshToken, guardarTokens, limpiarTokens, setAccessToken, setRefreshToken } from "../services/tokenStore.js";

const respuesta = (config, data = {}) => ({ data, status: 200, statusText: "OK", headers: {}, config });
const rechazo = (config, status) =>
  Promise.reject(new AxiosError("fallo", "ERR_BAD_REQUEST", config, {}, { status, data: {}, headers: {}, config }));

describe("api (interceptores)", () => {
  let adapterOriginal;
  let llamadas;

  beforeEach(() => {
    limpiarTokens();
    adapterOriginal = api.defaults.adapter;
    llamadas = [];
    // Evita que el interceptor intente redirigir: ya "estamos" en /login.
    window.history.pushState({}, "", "/login");
  });

  afterEach(() => {
    api.defaults.adapter = adapterOriginal;
    limpiarTokens();
    window.history.pushState({}, "", "/");
  });

  it("agrega Authorization: Bearer con el access token de memoria", async () => {
    setAccessToken("tok-123");
    api.defaults.adapter = (config) => { llamadas.push(config); return Promise.resolve(respuesta(config)); };
    await api.get("/boletas");
    expect(llamadas[0].headers.Authorization).toBe("Bearer tok-123");
  });

  it("no agrega Authorization si no hay sesión", async () => {
    api.defaults.adapter = (config) => { llamadas.push(config); return Promise.resolve(respuesta(config)); };
    await api.get("/productos");
    expect(llamadas[0].headers.Authorization).toBeUndefined();
  });

  it("ante un 401 renueva el token UNA vez y reintenta la petición", async () => {
    guardarTokens({ accessToken: "vencido", refreshToken: "refresh-1" });
    const refresh = spyOn(axios, "post").and.resolveTo({ data: { accessToken: "nuevo", refreshToken: "refresh-2" } });
    api.defaults.adapter = (config) => {
      llamadas.push(config.headers.Authorization);
      return config.headers.Authorization === "Bearer nuevo" ? Promise.resolve(respuesta(config, { ok: true })) : rechazo(config, 401);
    };

    const res = await api.get("/boletas");

    expect(res.data).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(refresh.calls.argsFor(0)).toEqual(["/api/v1/auth/refresh", { refreshToken: "refresh-1" }]);
    expect(llamadas).toEqual(["Bearer vencido", "Bearer nuevo"]);
    expect(getAccessToken()).toBe("nuevo");
    expect(getRefreshToken()).toBe("refresh-2"); // el refresh rota
  });

  it("varias peticiones con 401 a la vez comparten un solo refresh", async () => {
    guardarTokens({ accessToken: "vencido", refreshToken: "refresh-1" });
    const refresh = spyOn(axios, "post").and.resolveTo({ data: { accessToken: "nuevo", refreshToken: "refresh-2" } });
    api.defaults.adapter = (config) =>
      config.headers.Authorization === "Bearer nuevo" ? Promise.resolve(respuesta(config)) : rechazo(config, 401);

    await Promise.all([api.get("/a"), api.get("/b"), api.get("/c")]);

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("si el refresh falla limpia la sesión y rechaza el error original", async () => {
    guardarTokens({ accessToken: "vencido", refreshToken: "refresh-malo" });
    spyOn(axios, "post").and.rejectWith(new Error("refresh inválido"));
    api.defaults.adapter = (config) => rechazo(config, 401);

    await expectAsync(api.get("/boletas")).toBeRejected();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("sin refresh token no intenta renovar y rechaza", async () => {
    const refresh = spyOn(axios, "post");
    api.defaults.adapter = (config) => rechazo(config, 401);
    await expectAsync(api.get("/boletas")).toBeRejected();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("no entra en loop: si el reintento también da 401, rechaza", async () => {
    guardarTokens({ accessToken: "vencido", refreshToken: "refresh-1" });
    const refresh = spyOn(axios, "post").and.resolveTo({ data: { accessToken: "nuevo", refreshToken: "refresh-2" } });
    api.defaults.adapter = (config) => { llamadas.push(1); return rechazo(config, 401); };

    await expectAsync(api.get("/boletas")).toBeRejected();

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(llamadas.length).toBe(2); // original + un único reintento
  });

  it("un 401 de /auth/login (credenciales malas) NO dispara el refresh", async () => {
    setRefreshToken("refresh-1");
    const refresh = spyOn(axios, "post");
    api.defaults.adapter = (config) => rechazo(config, 401);
    await expectAsync(api.post("/auth/login", { correo: "a", clave: "b" })).toBeRejected();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("otros errores (403, 409, 500) pasan sin tocar la sesión", async () => {
    guardarTokens({ accessToken: "a", refreshToken: "r" });
    const refresh = spyOn(axios, "post");
    api.defaults.adapter = (config) => rechazo(config, 409);
    await expectAsync(api.post("/boletas", {})).toBeRejected();
    expect(refresh).not.toHaveBeenCalled();
    expect(getAccessToken()).toBe("a");
  });
});
