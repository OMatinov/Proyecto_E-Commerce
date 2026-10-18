import { procesarPago, PROBABILIDAD_RECHAZO, LIMITE_MONTO } from "../src/services/pago.js";

describe("procesarPago (con el azar simulado como mock)", () => {
  it("aprueba cuando el azar queda sobre la probabilidad de rechazo", () => {
    const azar = jasmine.createSpy("azar").and.returnValue(PROBABILIDAD_RECHAZO + 0.01);
    expect(procesarPago({ metodoPago: "credito", total: 10000 }, azar).aprobado).toBeTrue();
    expect(azar).toHaveBeenCalledTimes(1);
  });

  it("rechaza cuando el azar cae bajo la probabilidad de rechazo", () => {
    const azar = () => 0;
    const r = procesarPago({ metodoPago: "debito", total: 10000 }, azar);
    expect(r.aprobado).toBeFalse();
    expect(r.motivo).toBeTruthy();
  });

  it("rechaza un método de pago inexistente sin consultar el azar", () => {
    const azar = jasmine.createSpy("azar");
    expect(procesarPago({ metodoPago: "cheque", total: 10000 }, azar).aprobado).toBeFalse();
    expect(azar).not.toHaveBeenCalled();
  });

  it("rechaza un monto de 0", () => {
    expect(procesarPago({ metodoPago: "credito", total: 0 }, () => 1).aprobado).toBeFalse();
  });

  it("rechaza montos sobre el límite sin consultar el azar", () => {
    const azar = jasmine.createSpy("azar");
    const r = procesarPago({ metodoPago: "credito", total: LIMITE_MONTO + 1 }, azar);
    expect(r.aprobado).toBeFalse();
    expect(azar).not.toHaveBeenCalled();
  });
});
