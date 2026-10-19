import { vi } from 'vitest'; // 1. Importamos vi para los mocks
import { procesarPago, PROBABILIDAD_RECHAZO, LIMITE_MONTO } from "../src/services/pago.js";

describe("procesarPago (con el azar simulado como mock)", () => {
  it("aprueba cuando el azar queda sobre la probabilidad de rechazo", () => {
    // 2. Cambiamos jasmine.createSpy().and.returnValue() por vi.fn().mockReturnValue()
    const azar = vi.fn().mockReturnValue(PROBABILIDAD_RECHAZO + 0.01);

    // 3. Cambiamos .toBeTrue() por .toBe(true)
    expect(procesarPago({ metodoPago: "credito", total: 10000 }, azar).aprobado).toBe(true);
    expect(azar).toHaveBeenCalledTimes(1);
  });

  it("rechaza cuando el azar cae bajo la probabilidad de rechazo", () => {
    const azar = () => 0;
    const r = procesarPago({ metodoPago: "debito", total: 10000 }, azar);

    // 3. Cambiamos .toBeFalse() por .toBe(false)
    expect(r.aprobado).toBe(false);
    expect(r.motivo).toBeTruthy();
  });

  it("rechaza un método de pago inexistente sin consultar el azar", () => {
    const azar = vi.fn(); // Mock simple sin retorno específico
    expect(procesarPago({ metodoPago: "cheque", total: 10000 }, azar).aprobado).toBe(false);
    expect(azar).not.toHaveBeenCalled(); // Esto funciona igual en Vitest
  });

  it("rechaza un monto de 0", () => {
    expect(procesarPago({ metodoPago: "credito", total: 0 }, () => 1).aprobado).toBe(false);
  });

  it("rechaza montos sobre el límite sin consultar el azar", () => {
    const azar = vi.fn();
    const r = procesarPago({ metodoPago: "credito", total: LIMITE_MONTO + 1 }, azar);
    expect(r.aprobado).toBe(false);
    expect(azar).not.toHaveBeenCalled();
  });
});