// regiones.js - Regiones y comunas para registro y checkout.
// Autor: César (migrado de js/regiones.js)

export const REGIONES = [
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "San Miguel", "La Florida"]
  },
  {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"]
  },
  {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Chiguayante", "Los Ángeles", "Coronel"]
  },
  {
    nombre: "Región de Ñuble",
    comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes"]
  },
  {
    nombre: "Región de la Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"]
  },
  {
    nombre: "Región de Los Lagos",
    comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro"]
  },
  {
    nombre: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Ovalle"]
  },
  {
    nombre: "Región de O'Higgins",
    comunas: ["Rancagua", "San Fernando", "Machalí"]
  },
  {
    nombre: "Región del Maule",
    comunas: ["Talca", "Curicó", "Linares"]
  }
];

export function comunasDeRegion(nombreRegion) {
  const region = REGIONES.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}
