import { validarNombre, validarCorreo, validarComentario } from '../utils/ValidacionesContacto.js';
describe('Pruebas de las funciones de Validación de Contacto', () => {
  
  // PRUEBAS DE NOMBRE (3)
  it('1. validarNombre: debe retornar error si está vacío', () => {
    expect(validarNombre('   ')).toBe('Ingresa tu nombre completo.');
  });
  it('2. validarNombre: debe retornar error si supera los 100 caracteres', () => {
    const nombreLargo = 'a'.repeat(101);
    expect(validarNombre(nombreLargo)).toBe('El nombre no puede superar los 100 caracteres.');
  });
  it('3. validarNombre: debe retornar vacío si es válido', () => {
    expect(validarNombre('Katerine Olmedo')).toBe('');
  });

  // PRUEBAS DE CORREO (3)
  it('4. validarCorreo: debe retornar error si el formato es inválido', () => {
    expect(validarCorreo('correo-invalido')).toBe('Ingresa un correo electrónico válido.');
  });
  it('5. validarCorreo: debe retornar error si el dominio no está permitido', () => {
    expect(validarCorreo('test@yahoo.com')).toBe('Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
  });
  it('6. validarCorreo: debe retornar vacío si es un correo @duoc.cl válido', () => {
    expect(validarCorreo('katerine@duoc.cl')).toBe('');
  });

  // PRUEBAS DE MENSAJE (2)
  it('7. validarComentario: debe retornar error si está vacío', () => {
    expect(validarComentario('')).toBe('Escribe un mensaje antes de enviarlo.');
  });
  it('8. validarComentario: debe retornar vacío si tiene texto válido', () => {
    expect(validarComentario('Hola, necesito ayuda con mi pedido.')).toBe('');
  });
});