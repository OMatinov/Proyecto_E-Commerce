import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CampoFormulario from "../components/CampoFormulario.jsx";

describe("CampoFormulario", () => {
  afterEach(cleanup);

  it("renderiza la etiqueta asociada a su input", () => {
    render(<CampoFormulario id="correo" etiqueta="Correo electrónico" />);
    expect(screen.getByLabelText("Correo electrónico").tagName).toBe("INPUT");
  });

  it("muestra el mensaje de error solo cuando hay error", () => {
    const { rerender } = render(<CampoFormulario id="x" etiqueta="X" />);
    expect(screen.queryByRole("alert")).toBeNull();

    rerender(<CampoFormulario id="x" etiqueta="X" error="Campo obligatorio" />);
    expect(screen.getByRole("alert").textContent).toBe("Campo obligatorio");
    expect(screen.getByLabelText("X").classList.contains("is-invalid")).toBeTrue();
  });

  it("pasa value, type y placeholder al input", () => {
    render(<CampoFormulario id="clave" etiqueta="Clave" type="password" value="1234" placeholder="••••" onChange={() => {}} />);
    const input = screen.getByLabelText("Clave");
    expect(input.type).toBe("password");
    expect(input.value).toBe("1234");
    expect(input.placeholder).toBe("••••");
  });

  it("renderiza un select con una opción vacía más las opciones recibidas", () => {
    const opciones = [{ valor: "a", texto: "Opción A" }, { valor: "b", texto: "Opción B" }];
    render(<CampoFormulario id="s" etiqueta="Elige" opciones={opciones} placeholderOpcion="-- Elige --" onChange={() => {}} value="" />);
    const select = screen.getByLabelText("Elige");
    expect(select.tagName).toBe("SELECT");
    expect(select.options.length).toBe(3);
    expect(select.options[0].textContent).toBe("-- Elige --");
  });

  it("ejecuta onChange (mock) cuando el usuario escribe", () => {
    // ✅ SINTAXIS CORRECTA DE JASMINE PARA SPYS
    const onChange = jasmine.createSpy("onChange");
    render(<CampoFormulario id="n" etiqueta="Nombre" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});