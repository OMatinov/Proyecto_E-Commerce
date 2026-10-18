// DemoPendiente.jsx - Marcador para pantallas que todavía no están hechas.
// TEMPORAL.

export default function DemoPendiente({ titulo, responsable }) {
  return (
    <main className="container py-5 text-center">
      <h1 className="h4">{titulo}</h1>
      <p className="text-muted">En construcción — a cargo de {responsable}.</p>
    </main>
  );
}
