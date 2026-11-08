// confeti.spec.js - Pruebas del confeti de la pantalla "Pago correcto" (César).
// Mock: el lanzador se inyecta (spy) para no dibujar nada real en pantalla.
import { lanzarConfeti, COLORES_CONFETI } from "../utils/confeti.js";

describe("lanzarConfeti", () => {
  let matchMediaOriginal;

  beforeEach(() => { matchMediaOriginal = window.matchMedia; });
  afterEach(() => { window.matchMedia = matchMediaOriginal; });

  it("lanza el confeti (explosión central y dos cañones laterales) y devuelve true", () => {
    const lanzador = jasmine.createSpy("lanzador");
    expect(lanzarConfeti(lanzador)).toBeTrue();
    expect(lanzador).toHaveBeenCalledTimes(3);
  });

  it("usa los colores definidos y queda por encima del resto de la página", () => {
    const lanzador = jasmine.createSpy("lanzador");
    lanzarConfeti(lanzador);
    const opciones = lanzador.calls.argsFor(0)[0];
    expect(opciones.colors).toEqual(COLORES_CONFETI);
    expect(opciones.zIndex).toBeGreaterThan(1000);
  });

  it("no lanza nada si la persona pidió menos movimiento (prefers-reduced-motion)", () => {
    window.matchMedia = () => ({ matches: true });
    const lanzador = jasmine.createSpy("lanzador");
    expect(lanzarConfeti(lanzador)).toBeFalse();
    expect(lanzador).not.toHaveBeenCalled();
  });

  it("si el lanzador falla devuelve false en vez de romper la vista", () => {
    const lanzador = jasmine.createSpy("lanzador").and.throwError("sin canvas");
    expect(lanzarConfeti(lanzador)).toBeFalse();
  });
});
