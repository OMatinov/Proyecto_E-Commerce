import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DetalleProducto from '../pages/DetalleProducto.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { PRODUCTOS_SEMILLA } from '../data/productosData.js';
import { CATEGORIAS_SEMILLA } from '../data/categoriasData.js';

// Las paginas consumen ms-catalogo por Axios. La prueba intercepta api.get y
// responde con las semillas, sin backend ni base de datos.
const error404 = (mensaje) => {
  const error = new Error('404');
  error.response = { status: 404, data: { status: 404, message: mensaje } };
  return error;
};

const responderGet = (url, config) => {
  if (url === '/productos') {
    const params = config?.params ?? {};
    let lista = PRODUCTOS_SEMILLA;
    if (params.categoria) lista = lista.filter((p) => p.categoria === params.categoria);
    if (params.genero) lista = lista.filter((p) => p.genero === params.genero);
    return { data: lista };
  }

  if (url.startsWith('/productos/')) {
    const id = decodeURIComponent(url.split('/')[2]);
    const producto = PRODUCTOS_SEMILLA.find((p) => p.id === id);
    if (!producto) throw error404(`Producto no encontrado: ${id}`);
    return { data: producto };
  }

  if (url.startsWith('/categorias/slug/')) {
    const slug = decodeURIComponent(url.split('/')[3]);
    const categoria = CATEGORIAS_SEMILLA.find((c) => c.slug === slug);
    if (!categoria) throw error404(`Categoria no encontrada: ${slug}`);
    return { data: categoria };
  }

  if (url === '/categorias') return { data: CATEGORIAS_SEMILLA };

  throw new Error(`URL no esperada en la prueba: ${url}`);
};

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

// Botón de apoyo: cambia el :id de la URL sin desmontar <DetalleProducto />.
function IrAlProducto() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate('/productos/p-001')}>ir al producto</button>;
}

describe('<DetalleProducto />', () => {
  beforeEach(() => {
    spyOn(api, 'get').and.callFake((url, config) => {
      try {
        return Promise.resolve(responderGet(url, config));
      } catch (error) {
        return Promise.reject(error);
      }
    });
  });

  it('renderiza el producto cuando existe', async () => {
    renderConId('p-001');
    expect(await screen.findByRole('heading', { name: /Abrigo Largo Paño/i })).toBeTruthy();
  });

  it('renderiza mensaje de error cuando no existe (renderizado condicional)', async () => {
    renderConId('no-existe');

    expect(await screen.findByText(/Producto no encontrado/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Agregar al carrito/i })).toBeNull();
  });

  it('no falla al pasar de un producto inexistente a uno existente (los hooks van antes del return)', async () => {
    // El mismo componente sigue montado al cambiar el :id; si un hook estuviera después del
    // "return" de producto no encontrado, React lanzaría "Rendered more hooks than during the previous render".
    render(
      <MemoryRouter initialEntries={['/productos/no-existe']}>
        <CarritoProvider>
          <IrAlProducto />
          <Routes>
            <Route path="/productos/:id" element={<DetalleProducto />} />
          </Routes>
        </CarritoProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Producto no encontrado/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /ir al producto/i }));

    expect(await screen.findByRole('heading', { name: /Abrigo Largo Paño/i })).toBeTruthy();
  });

  it('usa rutas absolutas para las imágenes (corrige la carga en /productos/:id)', async () => {
    renderConId('p-001');

    const img = await screen.findByRole('img', { name: /Abrigo Largo Paño/i });
    // El dato guarda 'img/mujer/abrigo1.png' (relativa); en una ruta anidada
    // el navegador la resolvería como '/productos/img/...' y nunca cargaría.
    expect(img.getAttribute('src')).toBe('/img/mujer/abrigo1.png');
  });

  it('muestra la galería de imágenes adicionales del producto', async () => {
    renderConId('p-002'); // p-002 tiene imagenes: abrigo2-1, abrigo2-2, abrigo2-3

    await screen.findByRole('heading', { name: /Abrigo Sastronil/i });

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
  beforeEach(() => {
    spyOn(api, 'get').and.callFake((url, config) => {
      try {
        return Promise.resolve(responderGet(url, config));
      } catch (error) {
        return Promise.reject(error);
      }
    });
  });

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
    await screen.findByRole('heading', { name: /Abrigo Largo Paño/i });

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

    await screen.findByRole('heading', { name: /Abrigos/i });

    const domSrcs = Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src'));
    expect(domSrcs.length).toBeGreaterThan(0);
    expect(domSrcs.every((s) => !s || s.startsWith('/') || /^(https?:|data:|blob:)/i.test(s))).toBe(true);
    expect(domSrcs).toContain('/img/mujer/abrigo1.png');
  });

  it('el home enlaza las categorías de género hombre/mujer existentes', async () => {
    const { obtenerCategoriaPorSlug } = await import('../services/categorias.js');
    expect(await obtenerCategoriaPorSlug('hombre')).toBeTruthy();
    expect(await obtenerCategoriaPorSlug('mujer')).toBeTruthy();
  });

  it('la API entrega las categorías de género sin duplicarlas', async () => {
    const { listarCategorias } = await import('../services/categorias.js');
    const categorias = await listarCategorias();
    expect(categorias.filter((c) => c.slug === 'hombre').length).toBe(1);
    expect(categorias.filter((c) => c.slug === 'mujer').length).toBe(1);
  });
});
