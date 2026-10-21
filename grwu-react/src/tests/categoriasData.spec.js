import {
  listarCategorias, obtenerCategoriaPorSlug, crearCategoria,
  actualizarCategoria, eliminarCategoria,
} from '../data/categoriasData.js';

describe('categoriasData', () => {
  beforeEach(() => localStorage.clear());

  it('listarCategorias devuelve la semilla', () => {
    expect(listarCategorias().length).toBeGreaterThan(0);
  });

  it('obtenerCategoriaPorSlug retorna la categoría correcta', () => {
    expect(obtenerCategoriaPorSlug('polerones')).toBeTruthy();
    expect(obtenerCategoriaPorSlug('no-existe')).toBeNull();
  });

  it('crearCategoria genera un id único', () => {
    const c = crearCategoria({ slug: 'test', nombre: 'Test', descripcion: '' });
    expect(c.id).toBeTruthy();
  });

  it('actualizarCategoria modifica el nombre', () => {
    const c = listarCategorias()[0];
    const upd = actualizarCategoria(c.id, { nombre: 'Nuevo' });
    expect(upd.nombre).toBe('Nuevo');
  });

  it('eliminarCategoria quita la categoría', () => {
    const categoriaTemporal = crearCategoria({
      slug: 'temp-para-borrar',
      nombre: 'Temporal',
      descripcion: 'Solo para testing'
    });
    expect(listarCategorias().some((x) => x.id === categoriaTemporal.id)).toBe(true);
    eliminarCategoria(categoriaTemporal.id);
    expect(listarCategorias().some((x) => x.id === categoriaTemporal.id)).toBe(false);
  });
});