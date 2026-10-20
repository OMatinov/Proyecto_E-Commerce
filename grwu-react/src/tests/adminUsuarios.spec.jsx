// adminUsuarios.spec.jsx - Pruebas de las vistas admin de usuarios y perfil (César).
// Cubre: validadores, componente FormularioUsuario (props/eventos), AdminUsuarios,
// AdminUsuarioNuevo, AdminUsuarioEditar y AdminPerfil.
// Mocks: window.confirm (spyOn) y sesión simulada guardando el RUN en localStorage.
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminUsuarios from "../pages/admin/AdminUsuarios.jsx";
import AdminUsuarioNuevo from "../pages/admin/AdminUsuarioNuevo.jsx";
import AdminUsuarioEditar from "../pages/admin/AdminUsuarioEditar.jsx";
import AdminPerfil from "../pages/admin/AdminPerfil.jsx";
import FormularioUsuario from "../components/FormularioUsuario.jsx";
import { SesionProvider, CLAVE_SESION } from "../context/SesionContext.jsx";
import { CLAVE_USUARIOS, listarUsuarios, obtenerUsuario, autenticar } from "../data/usuariosData.js";
import { validarEdicionUsuario, validarPerfil } from "../utils/formularios.js";
import { borrar, guardar } from "../data/storage.js";

const RUN_ADMIN = "190110222";   // Camila, Administrador (semilla)

function reiniciar(conSesion = true) {
  borrar(CLAVE_USUARIOS);
  borrar(CLAVE_SESION);
  if (conSesion) guardar(CLAVE_SESION, RUN_ADMIN);
}

function montar(ruta, rutaInicial) {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={[rutaInicial ?? ruta]}>
        <Routes>
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioNuevo />} />
          <Route path="/admin/usuarios/:id/editar" element={<AdminUsuarioEditar />} />
          <Route path="/admin/perfil" element={<AdminPerfil />} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

const escribir = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe("Validadores admin de usuarios", () => {
  const base = { nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", telefono: "", region: "Región del Biobío", comuna: "Concepción", clave: "", clave2: "" };

  it("validarEdicionUsuario acepta datos válidos sin contraseña (se conserva la actual)", () => {
    expect(validarEdicionUsuario(base)).toEqual({});
  });

  it("validarEdicionUsuario exige que las contraseñas coincidan si se escribe una nueva", () => {
    const errores = validarEdicionUsuario({ ...base, clave: "abcd", clave2: "xxxx" });
    expect(errores.clave2).toBe("Las contraseñas no coinciden.");
  });

  it("validarEdicionUsuario rechaza correo de otro dominio y campos vacíos", () => {
    const errores = validarEdicionUsuario({ ...base, nombre: "", correo: "ana@hotmail.com", comuna: "" });
    expect(errores.nombre).toBeDefined();
    expect(errores.correo).toBeDefined();
    expect(errores.comuna).toBeDefined();
  });

  it("validarPerfil valida nombre, apellidos, correo y teléfono opcional", () => {
    expect(validarPerfil({ nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl", telefono: "" })).toEqual({});
    const errores = validarPerfil({ nombre: "", apellidos: "", correo: "mal", telefono: "abc" });
    expect(Object.keys(errores).sort()).toEqual(["apellidos", "correo", "nombre", "telefono"]);
  });
});

describe("FormularioUsuario (props y eventos)", () => {
  afterEach(cleanup);
  const valores = { run: "190110222", nombre: "", apellidos: "", correo: "", telefono: "", tipoUsuario: "Cliente", region: "", comuna: "", clave: "", clave2: "" };

  it("muestra el error recibido por props en el campo correspondiente", () => {
    render(<FormularioUsuario valores={valores} errores={{ nombre: "El nombre es obligatorio." }} onChange={() => {}} />);
    expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
  });

  it("deshabilita el RUN cuando runEditable es false", () => {
    render(<FormularioUsuario valores={valores} errores={{}} onChange={() => {}} runEditable={false} />);
    expect(screen.getByLabelText("RUN").disabled).toBe(true);
  });

  it("llama a onChange al escribir (callback espiado)", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<FormularioUsuario valores={valores} errores={{}} onChange={onChange} />);
    escribir("Nombre", "Luz");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ofrece los tres tipos de usuario y la comuna depende de la región", () => {
    render(<FormularioUsuario valores={valores} errores={{}} onChange={() => {}} />);
    const tipos = Array.from(screen.getByLabelText("Tipo de usuario").options).map((o) => o.value);
    expect(tipos).toEqual(["Cliente", "Vendedor", "Administrador"]);
    expect(screen.getByLabelText("Comuna").disabled).toBe(true);
  });
});

describe("AdminUsuarios (listado)", () => {
  beforeEach(() => reiniciar());
  afterEach(() => { cleanup(); borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });

  it("muestra nombre y tipo de todos los usuarios", () => {
    montar("/admin/usuarios");
    expect(screen.getAllByRole("row").length).toBe(listarUsuarios().length + 1);
    expect(screen.getByText("Camila Olmedo Pérez")).toBeTruthy();
    expect(screen.getAllByText("Administrador").length).toBe(2);
  });

  it("elimina un usuario cuando se confirma (window.confirm simulado)", () => {
    spyOn(window, "confirm").and.returnValue(true);
    montar("/admin/usuarios");
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[5]); // Ignacio (Cliente)
    expect(obtenerUsuario("137954567")).toBeNull();
  });

  it("no elimina nada si se cancela la confirmación", () => {
    spyOn(window, "confirm").and.returnValue(false);
    montar("/admin/usuarios");
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[5]);
    expect(listarUsuarios().length).toBe(6);
  });

  it("no permite eliminar la cuenta con sesión iniciada", () => {
    montar("/admin/usuarios");
    expect(screen.getAllByRole("button", { name: "Eliminar" })[0].disabled).toBe(true);
  });
});

describe("AdminUsuarioNuevo", () => {
  beforeEach(() => reiniciar());
  afterEach(() => { cleanup(); borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });

  function completar(run = "123456785", correo = "nuevo.admin@gmail.com") {
    escribir("RUN", run);
    escribir("Nombre", "Nuevo");
    escribir("Apellidos", "Desde Admin");
    escribir("Correo electrónico", correo);
    escribir("Tipo de usuario", "Vendedor");
    escribir("Región", "Región del Biobío");
    escribir("Comuna", "Concepción");
    escribir("Contraseña", "abcd");
    escribir("Confirmar contraseña", "abcd");
  }
  const guardarForm = () => fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

  it("muestra errores por campo y no crea el usuario si el formulario está vacío", () => {
    montar("/admin/usuarios/nuevo");
    guardarForm();
    expect(screen.getByText("El RUN es obligatorio.")).toBeTruthy();
    expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
    expect(listarUsuarios().length).toBe(6);
  });

  it("crea el usuario con el tipo elegido y vuelve al listado", () => {
    montar("/admin/usuarios/nuevo");
    completar();
    guardarForm();
    const creado = obtenerUsuario("123456785");
    expect(creado.nombre).toBe("Nuevo");
    expect(creado.tipoUsuario).toBe("Vendedor");
    expect(screen.getByRole("heading", { name: "Usuarios" })).toBeTruthy();
  });

  it("muestra el error en el campo cuando el RUN ya existe", () => {
    montar("/admin/usuarios/nuevo");
    completar("190110222", "otro.correo@gmail.com");
    guardarForm();
    expect(screen.getByText("Ya existe un usuario con ese RUN.")).toBeTruthy();
    expect(listarUsuarios().length).toBe(6);
  });
});

describe("AdminUsuarioEditar", () => {
  beforeEach(() => reiniciar());
  afterEach(() => { cleanup(); borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });
  const ruta = "/admin/usuarios/137954567/editar"; // Ignacio (Cliente)
  const guardarCambios = () => fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

  it("precarga los datos del usuario y bloquea el RUN", () => {
    montar("/admin/usuarios/:id/editar", ruta);
    expect(screen.getByLabelText("Nombre").value).toBe("Ignacio");
    expect(screen.getByLabelText("RUN").disabled).toBe(true);
  });

  it("guarda los cambios sin tocar la contraseña si se deja vacía", () => {
    montar("/admin/usuarios/:id/editar", ruta);
    escribir("Nombre", "Nacho");
    escribir("Tipo de usuario", "Vendedor");
    guardarCambios();
    expect(obtenerUsuario("137954567").nombre).toBe("Nacho");
    expect(obtenerUsuario("137954567").tipoUsuario).toBe("Vendedor");
    expect(autenticar("ignacio.reyes@gmail.com", "1234")).not.toBeNull();
  });

  it("cambia la contraseña cuando se escribe una nueva válida", () => {
    montar("/admin/usuarios/:id/editar", ruta);
    escribir("Contraseña (dejar vacía para conservar)", "nueva1");
    escribir("Confirmar contraseña", "nueva1");
    guardarCambios();
    expect(autenticar("ignacio.reyes@gmail.com", "nueva1")).not.toBeNull();
  });

  it("muestra error y no guarda si el correo ya pertenece a otro usuario", () => {
    montar("/admin/usuarios/:id/editar", ruta);
    escribir("Correo electrónico", "javiera.contreras@gmail.com");
    guardarCambios();
    expect(screen.getByText("Ya existe un usuario con ese correo.")).toBeTruthy();
    expect(obtenerUsuario("137954567").correo).toBe("ignacio.reyes@gmail.com");
  });

  it("muestra 'Usuario no encontrado' si el RUN no existe", () => {
    montar("/admin/usuarios/:id/editar", "/admin/usuarios/999999999/editar");
    expect(screen.getByText("Usuario no encontrado")).toBeTruthy();
  });
});

describe("AdminPerfil", () => {
  beforeEach(() => reiniciar());
  afterEach(() => { cleanup(); borrar(CLAVE_USUARIOS); borrar(CLAVE_SESION); });
  const actualizar = () => fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

  it("precarga los datos del usuario con sesión", () => {
    montar("/admin/perfil");
    expect(screen.getByLabelText("Nombre").value).toBe("Camila");
    expect(screen.getByLabelText("Correo electrónico").value).toBe("camila.olmedo@duoc.cl");
  });

  it("actualiza los datos y muestra el mensaje de éxito", () => {
    montar("/admin/perfil");
    escribir("Teléfono (opcional)", "+56 9 1111 2222");
    actualizar();
    expect(screen.getByText("Datos actualizados correctamente.")).toBeTruthy();
    expect(obtenerUsuario(RUN_ADMIN).telefono).toBe("+56 9 1111 2222");
  });

  it("no guarda y muestra el error si el nombre está vacío", () => {
    montar("/admin/perfil");
    escribir("Nombre", "");
    actualizar();
    expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
    expect(obtenerUsuario(RUN_ADMIN).nombre).toBe("Camila");
  });

  it("muestra 'Sin sesión activa' cuando nadie ha iniciado sesión", () => {
    reiniciar(false);
    montar("/admin/perfil");
    expect(screen.getByText("Sin sesión activa")).toBeTruthy();
  });
});
