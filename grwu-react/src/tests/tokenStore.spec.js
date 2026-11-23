import {
  getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, guardarTokens, limpiarTokens
} from "../services/tokenStore.js";

describe("tokenStore", () => {
  beforeEach(limpiarTokens);
  afterEach(limpiarTokens);

  it("el access token vive solo en memoria (nunca en localStorage)", () => {
    setAccessToken("access-123");
    expect(getAccessToken()).toBe("access-123");
    expect(Object.keys(localStorage).some((k) => localStorage.getItem(k) === "access-123")).toBeFalse();
  });

  it("el refresh token se persiste en localStorage", () => {
    setRefreshToken("refresh-456");
    expect(getRefreshToken()).toBe("refresh-456");
    expect(localStorage.getItem("GRWU_RefreshToken")).toBe("refresh-456");
  });

  it("guardarTokens guarda ambos y limpiarTokens los borra", () => {
    guardarTokens({ accessToken: "a", refreshToken: "r", otro: "ignorado" });
    expect(getAccessToken()).toBe("a");
    expect(getRefreshToken()).toBe("r");
    limpiarTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("un token vacío borra el refresh guardado", () => {
    setRefreshToken("r");
    setRefreshToken("");
    expect(getRefreshToken()).toBeNull();
  });

  it("no se cae si localStorage no está disponible", () => {
    spyOn(Storage.prototype, "getItem").and.throwError("bloqueado");
    spyOn(Storage.prototype, "setItem").and.throwError("bloqueado");
    expect(getRefreshToken()).toBeNull();
    expect(() => setRefreshToken("x")).not.toThrow();
  });
});
