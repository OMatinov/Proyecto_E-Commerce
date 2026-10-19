export function formatearFecha(fecha) {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? new Date(`${fecha}T00:00:00`) : new Date(fecha)
  return d.toLocaleDateString('es-CL')
}