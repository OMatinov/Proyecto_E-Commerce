import {
  listarCategorias, obtenerCategoriaPorSlug, crearCategoria,
  actualizarCategoria, eliminarCategoria,
} from '../data/categoriasData';

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
    const c = listarCategorias()[0];
    eliminarCategoria(c.id);
    expect(listarCategorias().some((x) => x.id === c.id)).toBe(false);
  });
});