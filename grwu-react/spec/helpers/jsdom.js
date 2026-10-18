// Simula un navegador (window, document, localStorage) para probar componentes en Node.
// En Karma esto no hace falta: las pruebas corren en un navegador real.
import "global-jsdom/register";

// Node trae su propio FormData y choca con el de jsdom al enviar formularios; usamos el de jsdom.
globalThis.FormData = window.FormData;
