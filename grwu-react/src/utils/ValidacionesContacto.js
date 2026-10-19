export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export function validarNombre(valor) {
  const nombre = valor.trim()
  if (nombre === '') return 'Ingresa tu nombre completo.'
  if (nombre.length > 100) return 'El nombre no puede superar los 100 caracteres.'
  return ''
}

export function validarCorreo(valor) {
  const correo = valor.trim().toLowerCase()
  if (correo === '') return ''
  if (correo.length > 100) return 'El correo no puede superar los 100 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return 'Ingresa un correo electrónico válido.'
  }
  if (!DOMINIOS_PERMITIDOS.includes(correo.split('@')[1])) {
    return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  return ''
}

export function validarComentario(valor) {
  const comentario = valor.trim()
  if (comentario === '') return 'Escribe un mensaje antes de enviarlo.'
  if (comentario.length > 500) return 'El mensaje no puede superar los 500 caracteres.'
  return ''
}