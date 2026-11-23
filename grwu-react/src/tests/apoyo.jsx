// apoyo.jsx - Utilidades compartidas por las pruebas de EV3 (no es un spec).
// Autor: César
//
// Las pruebas NO usan backend ni MySQL: se mockean los servicios con spyOn (AGENTS.md, sección 5.10).
import { AxiosError } from "axios";
import auth from "../services/auth.js";
import { limpiarTokens, setRefreshToken } from "../services/tokenStore.js";
import { useSesion } from "../context/SesionContext.jsx";

const base = {
  fechaNacimiento: "1990-05-10", direccion: "Calle Falsa 123", telefono: "+56 9 1234 5678", activo: true,
  region: "Región Metropolitana de Santiago", comuna: "Santiago"
};

export const CLIENTE = { ...base, run: "205558993", nombre: "Javiera", apellidos: "Contreras Lara", correo: "javiera.contreras@gmail.com", tipoUsuario: "Cliente" };
export const ADMIN = { ...base, run: "190110222", nombre: "Camila", apellidos: "Olmedo Pérez", correo: "camila.olmedo@duoc.cl", tipoUsuario: "Administrador" };
export const VENDEDOR = { ...base, run: "172076920", nombre: "Matías", apellidos: "Fuentes Rivas", correo: "matias.fuentes@duoc.cl", tipoUsuario: "Vendedor" };

// Simula una sesión guardada: hay refresh token y el servidor devuelve este usuario al restaurar.
export function conSesion(usuario) {
  setRefreshToken("refresh-de-prueba");
  spyOn(auth, "restaurar").and.resolveTo(usuario);
}

export function sinSesion() {
  limpiarTokens();
}

// Error de Axios con la forma que entrega ms-usuarios / ms-boletas.
export function errorApi(status, message, errores) {
  const data = { status, message, ...(errores ? { errores } : {}) };
  return new AxiosError(message, "ERR_BAD_RESPONSE", {}, {}, { status, data, headers: {}, config: {} });
}

// Error sin respuesta (servicio caído).
export const errorDeRed = () => new AxiosError("Network Error", "ERR_NETWORK");

// Imita a los guards: no muestra nada hasta que termina de restaurarse la sesión.
export function EsperarSesion({ children }) {
  const { cargandoSesion } = useSesion();
  return cargandoSesion ? null : children;
}
