// Este archivo es compartido: lo usa el registro/checkout de la tienda (César)

const REGIONES = [
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

// Rellena un <select> de regiones a partir de REGIONES
function poblarSelectRegiones(selectRegion) {
  selectRegion.innerHTML = '<option value="">-- Seleccione la región --</option>';
  REGIONES.forEach((region, index) => {
    const opt = document.createElement("option");
    opt.value = index; // usamos el índice para encontrar sus comunas fácil
    opt.textContent = region.nombre;
    selectRegion.appendChild(opt);
  });
}

// Rellena un <select> de comunas según la región seleccionada (por índice)
function poblarSelectComunas(selectComuna, indiceRegion) {
  selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
  if (indiceRegion === "" || indiceRegion === null || indiceRegion === undefined) return;
  const region = REGIONES[indiceRegion];
  if (!region) return;
  region.comunas.forEach(comuna => {
    const opt = document.createElement("option");
    opt.value = comuna;
    opt.textContent = comuna;
    selectComuna.appendChild(opt);
  });
}

// Conecta un par de selects región/comuna: al cambiar la región, refresca las comunas
function conectarRegionComuna(selectRegion, selectComuna) {
  poblarSelectRegiones(selectRegion);
  poblarSelectComunas(selectComuna, ""); // comuna vacía hasta elegir región

  selectRegion.addEventListener("change", () => {
    poblarSelectComunas(selectComuna, selectRegion.value);
  });
}
