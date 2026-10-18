// pago.js - Simula la pasarela de pago (no hay backend todavía).
// Autor: César
//
// `azar` se inyecta para poder probar sin depender de Math.random (mock en los tests).
// Reglas: método válido, monto > 0, monto <= LIMITE_MONTO y ~10% de rechazos al azar.
// El límite permite provocar la vista "Pago con error" a propósito durante la demo.

export const PROBABILIDAD_RECHAZO = 0.1;
export const LIMITE_MONTO = 100000; // el banco simulado rechaza compras sobre este monto

export const METODOS_PAGO = {
  credito: "Tarjeta de crédito",
  debito: "Tarjeta de débito",
  transferencia: "Transferencia electrónica"
};

export function procesarPago({ metodoPago, total }, azar = Math.random) {
  if (!METODOS_PAGO[metodoPago]) {
    return { aprobado: false, motivo: "Método de pago no válido." };
  }
  if (!(total > 0)) {
    return { aprobado: false, motivo: "El monto a pagar no es válido." };
  }
  if (total > LIMITE_MONTO) {
    return { aprobado: false, motivo: "El monto supera el límite de la tarjeta." };
  }
  if (azar() < PROBABILIDAD_RECHAZO) {
    return { aprobado: false, motivo: "El banco rechazó la transacción." };
  }
  return { aprobado: true, motivo: "" };
}
