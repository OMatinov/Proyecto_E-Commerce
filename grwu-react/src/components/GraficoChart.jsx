// GraficoChart.jsx - Gráfico de chart.js (barras o torta) para el panel de reportes.
// Autor: César
//
// Crea el gráfico sobre un <canvas> y lo destruye al desmontar o al cambiar los datos.
// Si no hay datos muestra un mensaje en vez de un gráfico vacío.

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const PALETA = ["#0d6efd", "#ff6384", "#ffcd56", "#20c9c9", "#9966ff", "#ff9f40", "#6c757d"];

const colorDe = (i, alfa) => {
  const hex = PALETA[i % PALETA.length];
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
};

export default function GraficoChart({ tipo = "bar", etiquetas, valores, titulo, descripcion, mensajeVacio = "Aún no hay datos para mostrar." }) {
  const canvasRef = useRef(null);
  const hayDatos = valores.length > 0;

  useEffect(() => {
    if (!hayDatos || !canvasRef.current) return undefined;

    const esTorta = tipo === "pie" || tipo === "doughnut";
    let grafico;
    try {
      grafico = new Chart(canvasRef.current, {
        type: tipo,
        data: {
          labels: etiquetas,
          datasets: [{
            label: titulo,
            data: valores,
            backgroundColor: etiquetas.map((_, i) => colorDe(i, 0.55)),
            borderColor: etiquetas.map((_, i) => colorDe(i, 1)),
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: esTorta },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: $${Number(ctx.parsed.y ?? ctx.parsed).toLocaleString("es-CL")}`
              }
            }
          },
          scales: esTorta ? {} : { y: { beginAtZero: true, ticks: { callback: (v) => "$" + Number(v).toLocaleString("es-CL") } } }
        }
      });
    } catch (error) {
      // Un gráfico que falla no debe romper todo el panel de reportes.
      console.error("No se pudo dibujar el gráfico:", error);
      return undefined;
    }

    // En entornos sin canvas (pruebas en Node) chart.js no crea el gráfico; no hay nada que destruir.
    return () => { if (grafico.ctx) grafico.destroy(); };
  }, [tipo, etiquetas, valores, titulo, hayDatos]);

  if (!hayDatos) return <p className="text-muted small mb-0">{mensajeVacio}</p>;

  return (
    <canvas ref={canvasRef} role="img" aria-label={descripcion || titulo}></canvas>
  );
}
