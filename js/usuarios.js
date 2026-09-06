// usuarios.js - Arreglo base (semilla) de usuarios.
// Autor: César
//
// admin-datos.js (de Katerine) lo usa para "sembrar" localStorage
// (clave "grwu_usuariosAdmin") la primera vez que se abre el panel admin,
// igual que productos.js hace con el catálogo de Matías.
//
// La estructura de cada usuario respeta el modelo que usan registro.html /
// cuenta.html (run, nombre, correo, telefono, region, comuna, tipoUsuario)
// y agrega los campos que solo pide el formulario del admin
// (apellidos, fechaNacimiento, direccion), para no romper admin-usuarios.js.
//
// tipoUsuario admite: "Administrador", "Vendedor" o "Cliente".

const usuarios = [
  {
    run: "190110222",
    nombre: "Camila",
    apellidos: "Olmedo Pérez",
    correo: "camila.olmedo@duoc.cl",
    fechaNacimiento: "1998-04-12",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    direccion: "Av. Libertador Bernardo O'Higgins 1234",
    telefono: "+56 9 1234 5678"
  },
  {
    run: "172076920",
    nombre: "Matías",
    apellidos: "Fuentes Rivas",
    correo: "matias.fuentes@duoc.cl",
    fechaNacimiento: "1999-09-03",
    tipoUsuario: "Vendedor",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle Álvarez 456",
    telefono: "+56 9 8765 4321"
  },
  {
    run: "888888888",
    nombre: "César",
    apellidos: "Muñoz Díaz",
    correo: "cesar.munoz@gmail.com",
    fechaNacimiento: "1997-01-20",
    tipoUsuario: "Vendedor",
    region: "Región del Biobío",
    comuna: "Concepción",
    direccion: "Los Carrera 789",
    telefono: "+56 9 5555 1122"
  },
  {
    run: "111111111",
    nombre: "Katerine",
    apellidos: "Soto Vega",
    correo: "katerine.soto@profesor.duoc.cl",
    fechaNacimiento: "1995-11-08",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Providencia",
    direccion: "Av. 11 de Septiembre 2100",
    telefono: "+56 9 4444 3322"
  },
  {
    run: "205558993",
    nombre: "Javiera",
    apellidos: "Contreras Lara",
    correo: "javiera.contreras@gmail.com",
    fechaNacimiento: "2000-06-25",
    tipoUsuario: "Cliente",
    region: "Región de la Araucanía",
    comuna: "Temuco",
    direccion: "Manuel Montt 321",
    telefono: "+56 9 3333 7788"
  },
  {
    run: "137954567",
    nombre: "Ignacio",
    apellidos: "Reyes Salinas",
    correo: "ignacio.reyes@gmail.com",
    fechaNacimiento: "2001-02-14",
    tipoUsuario: "Cliente",
    region: "Región del Maule",
    comuna: "Talca",
    direccion: "1 Sur 654",
    telefono: "+56 9 2222 9900"
  }
];
