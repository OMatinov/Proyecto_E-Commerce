// confeti.js - Lluvia de confeti para la pantalla "Pago correcto".
// Autor: César
//
// Usa la librería canvas-confetti. `lanzador` se puede inyectar (igual que `azar` en pago.js)
// para probar sin dibujar nada real en pantalla.
//
// Devuelve true si lanzó el confeti y false si se omitió, para que la vista nunca falle por esto:
//   - la persona pidió menos movimiento en su sistema (prefers-reduced-motion)
//   - el entorno no tiene canvas (jsdom, usado por las pruebas en Node)

import confetti from "canvas-confetti";

export const COLORES_CONFETI = ["#22c07b", "#f9b61c", "#ff4040", "#7c3aed", "#0d6efd"];

function prefiereMenosMovimiento() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function entornoSinCanvas() {
  return typeof navigator === "undefined" || /jsdom/i.test(navigator.userAgent);
}

export function lanzarConfeti(lanzador = confetti) {
  if (lanzador === confetti && entornoSinCanvas()) return false;
  if (prefiereMenosMovimiento()) return false;

  try {
    const base = { colors: COLORES_CONFETI, zIndex: 2000 };
    // Explosión central y dos cañones laterales
    lanzador({ ...base, particleCount: 120, spread: 90, startVelocity: 45, origin: { x: 0.5, y: 0.6 } });
    lanzador({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    lanzador({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    return true;
  } catch {
    return false;
  }
}
