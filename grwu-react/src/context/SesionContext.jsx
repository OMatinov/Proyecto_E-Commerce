// SesionContext.jsx - Sesión del usuario (reemplaza usuario-sesion.js + login.js + header.js).
// Autor: César
//
// Uso:  const { usuario, iniciarSesion, cerrarSesion, registrar, esAdmin } = useSesion();
// Guarda solo el RUN de la sesión activa en "GRWU_Sesion"; los datos viven en usuariosData.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { leer, guardar, borrar } from "../data/storage.js";
import { autenticar, crearUsuario, actualizarUsuario, obtenerUsuario } from "../data/usuariosData.js";

export const CLAVE_SESION = "GRWU_Sesion";

const SesionContext = createContext(null);

function usuarioDeSesionGuardada() {
  const run = leer(CLAVE_SESION, null);
  return run ? obtenerUsuario(run) : null;
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioDeSesionGuardada);

  const iniciarSesion = useCallback((correo, clave) => {
    const encontrado = autenticar(correo, clave);
    if (!encontrado) return { ok: false, mensaje: "Correo o contraseña incorrectos." };
    guardar(CLAVE_SESION, encontrado.run);
    setUsuario(encontrado);
    return { ok: true, mensaje: "", usuario: encontrado };
  }, []);

  const cerrarSesion = useCallback(() => {
    borrar(CLAVE_SESION);
    setUsuario(null);
  }, []);

  // Crea una cuenta de Cliente y deja la sesión iniciada.
  const registrar = useCallback((datos) => {
    try {
      const nuevo = crearUsuario({ ...datos, tipoUsuario: "Cliente" });
      guardar(CLAVE_SESION, nuevo.run);
      setUsuario(nuevo);
      return { ok: true, mensaje: "" };
    } catch (e) {
      return { ok: false, mensaje: e.message };
    }
  }, []);

  const actualizarPerfil = useCallback((cambios) => {
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    try {
      const actualizado = actualizarUsuario(usuario.run, cambios);
      setUsuario(actualizado);
      return { ok: true, mensaje: "" };
    } catch (e) {
      return { ok: false, mensaje: e.message };
    }
  }, [usuario]);

  const valor = useMemo(
    () => ({
      usuario,
      haySesion: usuario !== null,
      esAdmin: usuario?.tipoUsuario === "Administrador",
      esVendedor: usuario?.tipoUsuario === "Vendedor",
      iniciarSesion,
      cerrarSesion,
      registrar,
      actualizarPerfil
    }),
    [usuario, iniciarSesion, cerrarSesion, registrar, actualizarPerfil]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de <SesionProvider>.");
  return ctx;
}
