import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetalleProducto from '../pages/DetalleProducto.jsx'; // ✅ 1. Agregada extensión .jsx
import { CarritoProvider } from '../context/CarritoContext.jsx'; // ✅ 1. Agregada extensión .jsx

const renderConId = (id) =>
    render(
        <MemoryRouter initialEntries={[`/productos/${id}`]}>
          <CarritoProvider>
            <Routes>
              <Route path="/productos/:id" element={<DetalleProducto />} />
            </Routes>
          </CarritoProvider>
        </MemoryRouter>
    );

describe('<DetalleProducto />', () => {
  it('renderiza el producto cuando existe', () => {
    renderConId('p-001');

    // ✅ 2. Cambiado .toBeInTheDocument() por .toBeTruthy() (Nativo de Jasmine)
    // Usar getByRole es la mejor práctica y evita el error de "múltiples elementos"
      expect(screen.getByRole('heading', { name: /Abrigo Largo Paño/i })).toBeTruthy();
  });

  it('renderiza mensaje de error cuando no existe (renderizado condicional)', () => {
    renderConId('no-existe');

    // ✅ 3. Cambiado .toBeInTheDocument() por .toBeTruthy()
    expect(screen.getByText(/Producto no encontrado/i)).toBeTruthy();

    // ✅ 4. Cambiado .not.toBeInTheDocument() por .toBeNull() (Nativo de Jasmine para verificar ausencia)
    expect(screen.queryByRole('button', { name: /Agregar al carrito/i })).toBeNull();
  });

  it('usa rutas absolutas para las imágenes (corrige la carga en /productos/:id)', () => {
    renderConId('p-001');

    const img = screen.getByRole('img', { name: /Abrigo Largo Paño/i });
    // El dato guarda 'img/mujer/abrigo1.png' (relativa); en una ruta anidada
    // el navegador la resolvería como '/productos/img/...' y nunca cargaría.
    expect(img.getAttribute('src')).toBe('/img/mujer/abrigo1.png');
  });

  it('muestra la galería de imágenes adicionales del producto', () => {
    renderConId('p-002'); // p-002 tiene imagenes: abrigo2-1, abrigo2-2, abrigo2-3

    const srcs = screen.getAllByRole('img').map((i) => i.getAttribute('src'));
    expect(srcs).toContain('/img/mujer/abrigo2.png');
    // Los botones de miniatura usan aria-label, por lo que sus <img> internas
    // no exponen rol "img"; se consultan directo en el DOM.
    const domSrcs = Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src'));
    expect(domSrcs).toContain('/img/mujer/abrigo2-1.png');
    expect(domSrcs.filter((s) => s && s.startsWith('/img/')).length).toBeGreaterThanOrEqual(4);
  });
});
describe('regresión: imágenes absolutas en vistas anidadas', () => {
  it('"También te puede gustar" usa rutas absolutas en /productos/:id', async () => {
    render(
      <MemoryRouter initialEntries={['/productos/p-001']}>
        <CarritoProvider>
          <Routes>
            <Route path="/productos/:id" element={<DetalleProducto />} />
          </Routes>
        </CarritoProvider>
      </MemoryRouter>
    );
    // p-001 es abrigo/mujer; los relacionados son otros abrigos (p-002, p-003)
    const domSrcs = Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src'));
    expect(domSrcs).toContain('/img/mujer/abrigo2.png');
    // Ninguna imagen debe quedar con ruta relativa 'img/...' (fallaría en ruta anidada)
    const relativas = domSrcs.filter((s) => s && /^img\//.test(s));
    expect(relativas.length).toBe(0);
  });

  it('la vista de categoría (/categorias/:slug) muestra imágenes absolutas', async () => {
    const Categoria = (await import('../pages/Categoria.jsx')).default;
    render(
      <MemoryRouter initialEntries={['/categorias/abrigos']}>
        <CarritoProvider>
          <Routes>
            <Route path="/categorias/:slug" element={<Categoria />} />
          </Routes>
        </CarritoProvider>
      </MemoryRouter>
    );
    const domSrcs = Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src'));
    expect(domSrcs.length).toBeGreaterThan(0);
    expect(domSrcs.every((s) => !s || s.startsWith('/') || /^(https?:|data:|blob:)/i.test(s))).toBe(true);
    expect(domSrcs).toContain('/img/mujer/abrigo1.png');
  });

  it('el home enlaza las categorías de género hombre/mujer existentes', async () => {
    const { obtenerCategoriaPorSlug } = await import('../data/categoriasData.js');
    expect(obtenerCategoriaPorSlug('hombre')).toBeTruthy();
    expect(obtenerCategoriaPorSlug('mujer')).toBeTruthy();
  });

  it('migración: re-inyecta categorías de género ausentes en localStorage sin duplicar', async () => {
    const { listarCategorias, CATEGORIAS_SEMILLA } = await import('../data/categoriasData.js');
    // Simula el seed antiguo (sin hombre/mujer) persistido en localStorage
    const antiguas = CATEGORIAS_SEMILLA.filter((c) => c.slug !== 'hombre' && c.slug !== 'mujer');
    localStorage.setItem('grwu_categorias', JSON.stringify(antiguas));

    const actualizadas = listarCategorias();
    expect(actualizadas.some((c) => c.slug === 'hombre')).toBe(true);
    expect(actualizadas.some((c) => c.slug === 'mujer')).toBe(true);

    // Segunda lectura: no debe duplicarlas
    const otraVez = listarCategorias();
    expect(otraVez.filter((c) => c.slug === 'hombre').length).toBe(1);
  });
});
