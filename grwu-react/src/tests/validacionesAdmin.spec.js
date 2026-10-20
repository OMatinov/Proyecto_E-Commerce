import { validarProducto, validarCategoria, slugify } from '../utils/validacionesAdmin.js';

describe('validacionesAdmin', () => {
  it('slugify convierte acentos y espacios', () => {
    expect(slugify('Polerón Oversize')).toBe('poleron-oversize');
    expect(slugify('  Hola  Mundo! ')).toBe('hola-mundo');
  });

  it('validarProducto detecta campos faltantes', () => {
    const errs = validarProducto({});
    expect(errs.nombre).toBeDefined();
    expect(errs.precio).toBeDefined();
    expect(errs.stock).toBeDefined();
    expect(errs.categoria).toBeDefined();
    expect(errs.imagen).toBeDefined();
  });

  it('validarProducto acepta datos válidos', () => {
    const errs = validarProducto({
      nombre: 'Producto', precio: 1000, stock: 5, categoria: 'poleras', imagen: 'x.png',
    });
    expect(Object.keys(errs).length).toBe(0);
  });

  it('validarProducto rechaza oferta fuera de rango', () => {
    expect(validarProducto({ nombre: 'P', precio: 1, stock: 1, categoria: 'c', imagen: 'x', oferta: 150 }).oferta).toBeDefined();
  });

  it('validarCategoria requiere slug con formato correcto', () => {
    expect(validarCategoria({ nombre: 'Test', slug: 'CON ESPACIOS' }).slug).toBeDefined();
    expect(validarCategoria({ nombre: 'Test', slug: 'ok-slug' }).slug).toBeUndefined();
  });
});