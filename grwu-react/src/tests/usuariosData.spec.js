import {
  listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario,
  autenticar, CLAVE_USUARIOS, USUARIOS_SEMILLA
} from "../data/usuariosData.js";
import { borrar } from "../data/storage.js";

const nuevoUsuario = {
  run: "19011022K", nombre: "Ana", apellidos: "Pérez", correo: "ana.perez@gmail.com",
  clave: "abcd", region: "Región del Biobío", comuna: "Concepción"
};

describe("usuariosData", () => {
  beforeEach(() => borrar(CLAVE_USUARIOS));

  it("siembra los usuarios de ejemplo la primera vez", () => {
    expect(listarUsuarios().length).toBe(USUARIOS_SEMILLA.length);
  });

  it("nunca devuelve la clave en los listados", () => {
    expect(listarUsuarios().every((u) => !("clave" in u))).toBe(true);
  });

  it("crearUsuario agrega el usuario como Cliente por defecto", () => {
    const u = crearUsuario(nuevoUsuario);
    expect(u.tipoUsuario).toBe("Cliente");
    expect(obtenerUsuario("19011022K").nombre).toBe("Ana");
  });

  it("crearUsuario rechaza un RUN repetido", () => {
    crearUsuario(nuevoUsuario);
    expect(() => crearUsuario({ ...nuevoUsuario, correo: "otro@gmail.com" })).toThrowError("Ya existe un usuario con ese RUN.");
  });

  it("crearUsuario rechaza un correo repetido", () => {
    crearUsuario(nuevoUsuario);
    expect(() => crearUsuario({ ...nuevoUsuario, run: "123456785" })).toThrowError("Ya existe un usuario con ese correo.");
  });

  it("actualizarUsuario cambia datos pero no el RUN", () => {
    crearUsuario(nuevoUsuario);
    const u = actualizarUsuario("19011022K", { nombre: "Anita", run: "999" });
    expect(u.nombre).toBe("Anita");
    expect(u.run).toBe("19011022K");
  });

  it("actualizarUsuario devuelve null si el usuario no existe", () => {
    expect(actualizarUsuario("123", { nombre: "X" })).toBeNull();
  });

  it("eliminarUsuario borra al usuario y avisa si no existía", () => {
    crearUsuario(nuevoUsuario);
    expect(eliminarUsuario("19011022K")).toBe(true);
    expect(obtenerUsuario("19011022K")).toBeNull();
    expect(eliminarUsuario("19011022K")).toBe(false);
  });

  it("autenticar acepta credenciales correctas sin importar mayúsculas del correo", () => {
    const u = autenticar("CESAR.MUNOZ@gmail.com", "1234");
    expect(u.nombre).toBe("César");
    expect("clave" in u).toBe(false);
  });

  it("autenticar devuelve null con clave incorrecta", () => {
    expect(autenticar("cesar.munoz@gmail.com", "mala")).toBeNull();
  });
});
