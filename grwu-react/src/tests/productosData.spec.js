import {
  listarProductos, obtenerProducto, crearProducto,
  actualizarProducto, eliminarProducto,
  listarOfertas, listarProductosCriticos, listarPorCategoria,
} from '../data/productosData';

describe('productosData', () => {
  beforeEach(() => localStorage.clear());

  it('listarProductos devuelve la semilla cuando no hay datos', () => {
    expect(listarProductos().length).toBeGreaterThan(0);
  });

  it('crearProducto agrega un producto con id generado', () => {
    const nuevo = crearProducto({
      nombre: 'Test', precio: 1000, stock: 3, categoria: 'poleras', imagen: 'x.png',
    });
    expect(nuevo.id).toBeDefined();
    expect(listarProductos().some((p) => p.id === nuevo.id)).toBe(true);
  });

  it('obtenerProducto retorna null si no existe', () => {
    expect(obtenerProducto('inexistente')).toBeNull();
  });

  it('actualizarProducto modifica solo los campos indicados', () => {
    const p = listarProductos()[0];
    const actualizado = actualizarProducto(p.id, { precio: 9999 });
    expect(actualizado.precio).toBe(9999);
    expect(actualizado.nombre).toBe(p.nombre);
  });

  it('eliminarProducto quita el producto de la lista', () => {
    const p = listarProductos()[0];
    eliminarProducto(p.id);
    expect(obtenerProducto(p.id)).toBeNull();
  });

  it('listarOfertas solo devuelve productos con oferta > 0', () => {
    const ofertas = listarOfertas();
    expect(ofertas.every((p) => p.oferta > 0)).toBe(true);
  });

  it('listarProductosCriticos filtra por umbral de stock', () => {
    const criticos = listarProductosCriticos(5);
    expect(criticos.every((p) => p.stock <= 5)).toBe(true);
  });

  it('listarPorCategoria filtra correctamente', () => {
    const polerones = listarPorCategoria('polerones');
    expect(polerones.every((p) => p.categoria === 'polerones')).toBe(true);
  });
});