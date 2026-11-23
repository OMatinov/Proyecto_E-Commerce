// SesionContext.jsx - Sesión del usuario contra ms-usuarios (EV3).
// Autor: César
//
// - El access token vive en memoria y el refresh token en localStorage (services/tokenStore.js).
// - Al montar, si hay refresh token, se pide un access nuevo y se reconstruye el usuario con /usuarios/me.
//   Mientras tanto cargandoSesion = true (los guards muestran "Cargando sesión...").
// - Las acciones que llaman a la API son async y devuelven { ok, mensaje, ... } (nunca lanzan).
//
// Uso:  const { usuario, haySesion, cargandoSesion, esAdmin, iniciarSesion, cerrarSesion, registrar } = useSesion();

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import auth from "../services/auth.js";
import usuariosService from "../services/usuarios.js";
import { getRefreshToken, limpiarTokens } from "../services/tokenStore.js";
import { normalizarError } from "../services/errores.js";

const SesionContext = createContext(null);

// Campos que el backend exige en PUT /usuarios/me (validación completa, no parcial).
const CAMPOS_PERFIL = ["nombre", "apellidos", "correo", "telefono", "fechaNacimiento", "region", "comuna", "direccion"];

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(() => Boolean(getRefreshToken()));

  // Restaura la sesión al recargar la página.
  useEffect(() => {
    let vigente = true;
    if (!getRefreshToken()) {
      setCargandoSesion(false);
      return undefined;
    }
    auth.restaurar()
      .then((u) => { if (vigente) setUsuario(u); })
      .catch((error) => {
        // Refresh vencido o revocado: la sesión no se puede recuperar. Sin respuesta (backend caído): se conserva el token.
        const status = error?.response?.status;
        if (status === 400 || status === 401 || status === 403) limpiarTokens();
      })
      .finally(() => { if (vigente) setCargandoSesion(false); });
    return () => { vigente = false; };
  }, []);

  const iniciarSesion = useCallback(async (correo, clave) => {
    try {
      const u = await auth.login(correo, clave);
      setUsuario(u);
      return { ok: true, mensaje: "", usuario: u };
    } catch (error) {
      const { mensaje, status } = normalizarError(error);
      return { ok: false, mensaje, status };
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    setUsuario(null);
    await auth.logout();
  }, []);

  // Crea una cuenta de Cliente (el backend fuerza el rol) y deja la sesión iniciada.
  const registrar = useCallback(async (datos) => {
    try {
      await auth.registro(datos);
    } catch (error) {
      const { mensaje, status, errores } = normalizarError(error);
      return { ok: false, mensaje, status, errores };
    }
    return iniciarSesion(datos.correo, datos.clave);
  }, [iniciarSesion]);

  // Vuelve a leer el usuario desde el servidor (p. ej. si un admin se edita a sí mismo).
  const recargarUsuario = useCallback(async () => {
    try {
      const u = await usuariosService.perfil();
      setUsuario(u);
      return { ok: true, mensaje: "" };
    } catch (error) {
      return { ok: false, mensaje: normalizarError(error).mensaje };
    }
  }, []);

  // El backend valida el perfil completo, así que se envían los datos actuales mezclados con los cambios.
  const actualizarPerfil = useCallback(async (cambios) => {
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    const actuales = Object.fromEntries(CAMPOS_PERFIL.map((c) => [c, usuario[c] ?? null]));
    try {
      const actualizado = await usuariosService.actualizarPerfil({ ...actuales, ...cambios });
      setUsuario(actualizado);
      return { ok: true, mensaje: "" };
    } catch (error) {
      const { mensaje, status, errores } = normalizarError(error);
      return { ok: false, mensaje, status, errores };
    }
  }, [usuario]);

  const cambiarClave = useCallback(async (claveActual, claveNueva) => {
    try {
      await usuariosService.cambiarClave({ claveActual, claveNueva });
      return { ok: true, mensaje: "" };
    } catch (error) {
      const { mensaje, status, errores } = normalizarError(error);
      return { ok: false, mensaje, status, errores };
    }
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      haySesion: usuario !== null,
      cargandoSesion,
      esAdmin: usuario?.tipoUsuario === "Administrador",
      esVendedor: usuario?.tipoUsuario === "Vendedor",
      esCliente: usuario?.tipoUsuario === "Cliente",
      iniciarSesion,
      cerrarSesion,
      registrar,
      recargarUsuario,
      actualizarPerfil,
      cambiarClave
    }),
    [usuario, cargandoSesion, iniciarSesion, cerrarSesion, registrar, recargarUsuario, actualizarPerfil, cambiarClave]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de <SesionProvider>.");
  return ctx;
}
