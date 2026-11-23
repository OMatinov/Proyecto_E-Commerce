// adminUsuarios.spec.jsx - Vistas admin de usuarios contra ms-usuarios (servicios mockeados con spyOn).
// Listado, nuevo, editar y perfil; más los validadores y el formulario compartido.
import { render, screen, fireEvent, cleanup, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminUsuarios from "../pages/admin/AdminUsuarios.jsx";
import AdminUsuarioNuevo from "../pages/admin/AdminUsuarioNuevo.jsx";
import AdminUsuarioEditar from "../pages/admin/AdminUsuarioEditar.jsx";
import AdminPerfil from "../pages/admin/AdminPerfil.jsx";
import FormularioUsuario from "../components/FormularioUsuario.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import usuariosService from "../services/usuarios.js";
import { limpiarTokens } from "../services/tokenStore.js";
import { validarEdicionUsuario, validarFechaNacimiento, validarPerfil, validarRegistro } from "../utils/formularios.js";
import { ADMIN, CLIENTE, EsperarSesion, VENDEDOR, conSesion, errorApi, errorDeRed } from "./apoyo.jsx";

function montar(rutaInicial) {
  return render(
    <SesionProvider>
      <MemoryRouter initialEntries={[rutaInicial]}>
        <Routes>
          <Route path="/admin/usuarios" element={<EsperarSesion><AdminUsuarios /></EsperarSesion>} />
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioNuevo />} />
          <Route path="/admin/usuarios/:id/editar" element={<AdminUsuarioEditar />} />
          <Route path="/admin/perfil" element={<EsperarSesion><AdminPerfil /></EsperarSesion>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

beforeEach(limpiarTokens);
afterEach(() => { cleanup(); limpiarTokens(); });

describe("Validadores admin de usuarios", () => {
  const base = {
    nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", telefono: "", fechaNacimiento: "1995-03-02",
    region: "Región del Biobío", comuna: "Concepción", clave: "", clave2: ""
  };

  it("validarEdicionUsuario acepta datos válidos sin contraseña (se conserva la actual)", () => {
    expect(validarEdicionUsuario(base)).toEqual({});
  });

  it("validarEdicionUsuario exige que las contraseñas coincidan si se escribe una nueva", () => {
    expect(validarEdicionUsuario({ ...base, clave: "abcd", clave2: "xxxx" }).clave2).toBe("Las contraseñas no coinciden.");
  });

  it("validarEdicionUsuario rechaza correo de otro dominio, campos vacíos y fecha faltante", () => {
    const errores = validarEdicionUsuario({ ...base, nombre: "", correo: "ana@hotmail.com", comuna: "", fechaNacimiento: "" });
    expect(errores.nombre).toBeDefined();
    expect(errores.correo).toBeDefined();
    expect(errores.comuna).toBeDefined();
    expect(errores.fechaNacimiento).toBe("La fecha de nacimiento es obligatoria.");
  });

  it("los apellidos se limitan a 80 caracteres, igual que el backend", () => {
    expect(validarEdicionUsuario({ ...base, apellidos: "a".repeat(80) }).apellidos).toBeUndefined();
    expect(validarEdicionUsuario({ ...base, apellidos: "a".repeat(81) }).apellidos).toMatch(/80/);
  });

  it("validarPerfil valida nombre, apellidos, correo y teléfono opcional", () => {
    expect(validarPerfil({ nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl", telefono: "" })).toEqual({});
    const errores = validarPerfil({ nombre: "", apellidos: "", correo: "mal", telefono: "abc" });
    expect(Object.keys(errores).sort()).toEqual(["apellidos", "correo", "nombre", "telefono"]);
  });

  it("validarFechaNacimiento exige fecha, no futura y posterior a 1900", () => {
    expect(validarFechaNacimiento("").valido).toBeFalse();
    expect(validarFechaNacimiento("2000-01-31").valido).toBeTrue();
    expect(validarFechaNacimiento("2999-01-01").mensaje).toMatch(/futura/);
    expect(validarFechaNacimiento("1850-01-01").valido).toBeFalse();
    expect(validarFechaNacimiento("no-es-fecha").valido).toBeFalse();
  });

  it("validarRegistro también exige la fecha de nacimiento", () => {
    const valido = { run: "190110222", ...base, clave: "abcd", clave2: "abcd" };
    expect(validarRegistro(valido)).toEqual({});
    expect(validarRegistro({ ...valido, fechaNacimiento: "" }).fechaNacimiento).toBeDefined();
  });
});

describe("FormularioUsuario (props y eventos)", () => {
  const valores = {
    run: "190110222", nombre: "", apellidos: "", correo: "", telefono: "", fechaNacimiento: "", direccion: "",
    tipoUsuario: "Cliente", region: "", comuna: "", clave: "", clave2: ""
  };

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

  it("incluye fecha de nacimiento y dirección, que el backend necesita", () => {
    render(<FormularioUsuario valores={valores} errores={{}} onChange={() => {}} />);
    expect(screen.getByLabelText("Fecha de nacimiento").type).toBe("date");
    expect(screen.getByLabelText("Dirección (opcional)")).toBeTruthy();
  });
});

describe("AdminUsuarios (listado)", () => {
  const INACTIVO = { ...CLIENTE, run: "137954567", nombre: "Ignacio", correo: "ignacio@gmail.com", activo: false };

  it("muestra 'Cargando' y luego nombre, tipo y estado de todos los usuarios", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([ADMIN, CLIENTE, INACTIVO]);
    montar("/admin/usuarios");
    expect(await screen.findByText("Javiera Contreras Lara")).toBeTruthy();
    expect(screen.getByText("Ignacio Contreras Lara")).toBeTruthy();
    expect(screen.getAllByText("Cliente").length).toBe(2);
    expect(screen.getByText("Inactivo")).toBeTruthy();
    expect(screen.getAllByText("Activo").length).toBe(2);
  });

  it("avisa cuando no hay usuarios", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([]);
    montar("/admin/usuarios");
    expect(await screen.findByText("No hay usuarios registrados.")).toBeTruthy();
  });

  it("muestra el error del servidor si no se puede cargar la lista (403, caído...)", async () => {
    conSesion(VENDEDOR);
    spyOn(usuariosService, "listar").and.rejectWith(errorApi(403, "No tienes permisos para realizar esta acción."));
    montar("/admin/usuarios");
    expect(await screen.findByText("No tienes permisos para realizar esta acción.")).toBeTruthy();
  });

  it("elimina (desactiva) un usuario cuando se confirma y recarga la lista", async () => {
    conSesion(ADMIN);
    const listar = spyOn(usuariosService, "listar").and.resolveTo([ADMIN, CLIENTE]);
    const eliminar = spyOn(usuariosService, "eliminar").and.resolveTo();
    spyOn(window, "confirm").and.returnValue(true);
    montar("/admin/usuarios");
    const fila = (await screen.findByText("Javiera Contreras Lara")).closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    await waitFor(() => { if (listar.calls.count() < 2) throw new Error("aún no recarga"); });
    expect(eliminar).toHaveBeenCalledWith(CLIENTE.run);
  });

  it("no elimina nada si se cancela la confirmación", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([ADMIN, CLIENTE]);
    const eliminar = spyOn(usuariosService, "eliminar");
    spyOn(window, "confirm").and.returnValue(false);
    montar("/admin/usuarios");
    const fila = (await screen.findByText("Javiera Contreras Lara")).closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    expect(eliminar).not.toHaveBeenCalled();
  });

  it("muestra el error si la eliminación falla en el servidor", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([ADMIN, CLIENTE]);
    spyOn(usuariosService, "eliminar").and.rejectWith(errorApi(409, "No se puede desactivar este usuario."));
    spyOn(window, "confirm").and.returnValue(true);
    montar("/admin/usuarios");
    const fila = (await screen.findByText("Javiera Contreras Lara")).closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("No se puede desactivar este usuario.")).toBeTruthy();
  });

  it("no permite eliminar la cuenta con sesión iniciada ni a un usuario ya inactivo", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([ADMIN, CLIENTE, INACTIVO]);
    montar("/admin/usuarios");
    await screen.findByText("Javiera Contreras Lara");
    const botonDe = (nombre) => within(screen.getByText(nombre).closest("tr")).getByRole("button", { name: "Eliminar" });
    expect(botonDe("Camila Olmedo Pérez").disabled).toBe(true);
    expect(botonDe("Ignacio Contreras Lara").disabled).toBe(true);
    expect(botonDe("Javiera Contreras Lara").disabled).toBe(false);
  });
});

describe("AdminUsuarioNuevo", () => {
  function completarValido() {
    escribir("RUN", "205558993");
    escribir("Nombre", "Luz");
    escribir("Apellidos", "Soto Vera");
    escribir("Correo electrónico", "luz.soto@gmail.com");
    escribir("Fecha de nacimiento", "1992-08-14");
    escribir("Tipo de usuario", "Vendedor");
    escribir("Región", "Región del Biobío");
    escribir("Comuna", "Concepción");
    escribir("Contraseña", "abcd");
    escribir("Confirmar contraseña", "abcd");
  }
  const guardar = () => fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

  it("muestra errores por campo y no crea el usuario si el formulario está vacío", () => {
    const crear = spyOn(usuariosService, "crear");
    montar("/admin/usuarios/nuevo");
    guardar();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(4);
    expect(crear).not.toHaveBeenCalled();
  });

  it("crea el usuario con el tipo elegido, sin enviar la confirmación, y vuelve al listado", async () => {
    const crear = spyOn(usuariosService, "crear").and.resolveTo(VENDEDOR);
    spyOn(usuariosService, "listar").and.resolveTo([]);
    conSesion(ADMIN);
    montar("/admin/usuarios/nuevo");
    completarValido();
    guardar();
    expect(await screen.findByText("No hay usuarios registrados.")).toBeTruthy();
    const enviado = crear.calls.argsFor(0)[0];
    expect(enviado.tipoUsuario).toBe("Vendedor");
    expect(enviado.run).toBe("205558993");
    expect(enviado.fechaNacimiento).toBe("1992-08-14");
    expect("clave2" in enviado).toBeFalse();
  });

  it("muestra el error en el campo cuando el RUN ya existe (409)", async () => {
    spyOn(usuariosService, "crear").and.rejectWith(errorApi(409, "Ya existe un usuario con ese RUN."));
    montar("/admin/usuarios/nuevo");
    completarValido();
    guardar();
    expect(await screen.findByText("Ya existe un usuario con ese RUN.")).toBeTruthy();
  });

  it("muestra los errores por campo que devuelve el backend (400)", async () => {
    spyOn(usuariosService, "crear").and.rejectWith(errorApi(400, "Datos inválidos", { direccion: "La dirección no puede superar los 150 caracteres." }));
    montar("/admin/usuarios/nuevo");
    completarValido();
    guardar();
    expect(await screen.findByText(/no puede superar los 150/)).toBeTruthy();
  });

  it("muestra un aviso general si el servicio no responde y deja reintentar", async () => {
    spyOn(usuariosService, "crear").and.rejectWith(errorDeRed());
    montar("/admin/usuarios/nuevo");
    completarValido();
    guardar();
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Guardar" }).disabled).toBe(false);
  });
});

describe("AdminUsuarioEditar", () => {
  const guardar = () => fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

  it("precarga los datos del usuario (incluida la fecha) y bloquea el RUN", async () => {
    spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE);
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    await screen.findByText("Editar usuario");
    expect(screen.getByLabelText("RUN").value).toBe(CLIENTE.run);
    expect(screen.getByLabelText("RUN").disabled).toBe(true);
    expect(screen.getByLabelText("Nombre").value).toBe("Javiera");
    expect(screen.getByLabelText("Fecha de nacimiento").value).toBe("1990-05-10");
  });

  it("guarda los cambios sin enviar contraseña si se deja vacía ni el RUN en el cuerpo", async () => {
    spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE);
    const actualizar = spyOn(usuariosService, "actualizar").and.resolveTo(CLIENTE);
    spyOn(usuariosService, "listar").and.resolveTo([]);
    conSesion(ADMIN);
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    await screen.findByText("Editar usuario");
    escribir("Nombre", "Javi");
    guardar();
    expect(await screen.findByText("No hay usuarios registrados.")).toBeTruthy();
    const [run, cuerpo] = actualizar.calls.argsFor(0);
    expect(run).toBe(CLIENTE.run);
    expect(cuerpo.nombre).toBe("Javi");
    expect("clave" in cuerpo).toBeFalse();
    expect("run" in cuerpo).toBeFalse();
    expect(cuerpo.tipoUsuario).toBe("Cliente");
  });

  it("envía la contraseña nueva cuando se escribe una válida", async () => {
    spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE);
    const actualizar = spyOn(usuariosService, "actualizar").and.resolveTo(CLIENTE);
    spyOn(usuariosService, "listar").and.resolveTo([]);
    conSesion(ADMIN);
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    await screen.findByText("Editar usuario");
    escribir("Contraseña (dejar vacía para conservar)", "nueva1");
    escribir("Confirmar contraseña", "nueva1");
    guardar();
    await screen.findByText("No hay usuarios registrados.");
    expect(actualizar.calls.argsFor(0)[1].clave).toBe("nueva1");
  });

  it("no guarda si las contraseñas no coinciden", async () => {
    spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE);
    const actualizar = spyOn(usuariosService, "actualizar");
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    await screen.findByText("Editar usuario");
    escribir("Contraseña (dejar vacía para conservar)", "nueva1");
    escribir("Confirmar contraseña", "otra22");
    guardar();
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(actualizar).not.toHaveBeenCalled();
  });

  it("muestra el error y se queda en la vista si el correo ya pertenece a otro usuario", async () => {
    spyOn(usuariosService, "obtener").and.resolveTo(CLIENTE);
    spyOn(usuariosService, "actualizar").and.rejectWith(errorApi(409, "Ya existe un usuario con ese correo."));
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    await screen.findByText("Editar usuario");
    escribir("Correo electrónico", "otro@gmail.com");
    guardar();
    expect(await screen.findByText("Ya existe un usuario con ese correo.")).toBeTruthy();
    expect(screen.getByText("Editar usuario")).toBeTruthy();
  });

  it("si el admin se edita a sí mismo vuelve a leer su perfil para actualizar la sesión", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "obtener").and.resolveTo(ADMIN);
    spyOn(usuariosService, "actualizar").and.resolveTo(ADMIN);
    spyOn(usuariosService, "listar").and.resolveTo([]);
    const perfil = spyOn(usuariosService, "perfil").and.resolveTo({ ...ADMIN, nombre: "Cami" });
    montar(`/admin/usuarios/${ADMIN.run}/editar`);
    await screen.findByText("Editar usuario");
    // esperar a que se restaure la sesión para que el componente sepa que es él mismo
    await waitFor(() => { if (screen.getByLabelText("Nombre").value !== "Camila") throw new Error("aún no"); });
    await new Promise((r) => setTimeout(r, 20));
    escribir("Nombre", "Cami");
    guardar();
    await screen.findByText("No hay usuarios registrados.");
    expect(perfil).toHaveBeenCalled();
  });

  it("muestra 'Usuario no encontrado' si el RUN no existe (404)", async () => {
    spyOn(usuariosService, "obtener").and.rejectWith(errorApi(404, "Usuario no encontrado."));
    montar("/admin/usuarios/000000000/editar");
    expect(await screen.findByText("Usuario no encontrado")).toBeTruthy();
  });

  it("muestra el error del servidor si la carga falla por otro motivo", async () => {
    spyOn(usuariosService, "obtener").and.rejectWith(errorDeRed());
    montar(`/admin/usuarios/${CLIENTE.run}/editar`);
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });
});

describe("AdminPerfil", () => {
  it("precarga los datos del usuario con sesión", async () => {
    conSesion(ADMIN);
    montar("/admin/perfil");
    expect(await screen.findByDisplayValue("Camila")).toBeTruthy();
    expect(screen.getByDisplayValue("camila.olmedo@duoc.cl")).toBeTruthy();
  });

  it("actualiza los datos enviando el perfil completo y muestra el mensaje de éxito", async () => {
    conSesion(ADMIN);
    const actualizar = spyOn(usuariosService, "actualizarPerfil").and.callFake(async (d) => ({ ...ADMIN, ...d }));
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Nombre", "Camila Andrea");
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    expect(await screen.findByText("Datos actualizados correctamente.")).toBeTruthy();
    const enviado = actualizar.calls.argsFor(0)[0];
    expect(enviado.nombre).toBe("Camila Andrea");
    expect(enviado.fechaNacimiento).toBe(ADMIN.fechaNacimiento);
    expect(enviado.region).toBe(ADMIN.region);
  });

  it("no guarda y muestra el error si el nombre está vacío", async () => {
    conSesion(ADMIN);
    const actualizar = spyOn(usuariosService, "actualizarPerfil");
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Nombre", "");
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
    expect(actualizar).not.toHaveBeenCalled();
  });

  it("muestra el error de correo duplicado que devuelve el backend", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "actualizarPerfil").and.rejectWith(errorApi(409, "Ya existe un usuario con ese correo."));
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Correo electrónico", "otro@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    expect(await screen.findByText("Ya existe un usuario con ese correo.")).toBeTruthy();
  });

  it("muestra un aviso general si el servicio no responde", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "actualizarPerfil").and.rejectWith(errorDeRed());
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });

  it("cambia la contraseña con la actual y la nueva, y limpia el formulario", async () => {
    conSesion(ADMIN);
    const cambiar = spyOn(usuariosService, "cambiarClave").and.resolveTo();
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Contraseña actual", "vieja1");
    escribir("Contraseña nueva", "nueva1");
    escribir("Confirmar contraseña nueva", "nueva1");
    fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
    expect(await screen.findByText("Contraseña actualizada correctamente.")).toBeTruthy();
    expect(cambiar).toHaveBeenCalledWith({ claveActual: "vieja1", claveNueva: "nueva1" });
    expect(screen.getByLabelText("Contraseña actual").value).toBe("");
  });

  it("no cambia la contraseña si falta la actual o las nuevas no coinciden", async () => {
    conSesion(ADMIN);
    const cambiar = spyOn(usuariosService, "cambiarClave");
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Contraseña nueva", "nueva1");
    escribir("Confirmar contraseña nueva", "otra22");
    fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
    expect(screen.getByText("Ingresa tu contraseña actual.")).toBeTruthy();
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(cambiar).not.toHaveBeenCalled();
  });

  it("muestra el mensaje del backend si la contraseña actual es incorrecta", async () => {
    conSesion(ADMIN);
    spyOn(usuariosService, "cambiarClave").and.rejectWith(errorApi(400, "La contraseña actual no es correcta."));
    montar("/admin/perfil");
    await screen.findByDisplayValue("Camila");
    escribir("Contraseña actual", "mala11");
    escribir("Contraseña nueva", "nueva1");
    escribir("Confirmar contraseña nueva", "nueva1");
    fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
    expect(await screen.findByText("La contraseña actual no es correcta.")).toBeTruthy();
  });

  it("muestra 'Sin sesión activa' cuando nadie ha iniciado sesión", async () => {
    montar("/admin/perfil");
    expect(await screen.findByText("Sin sesión activa")).toBeTruthy();
  });
});
