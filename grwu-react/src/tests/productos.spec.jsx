import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import api from '../services/api';
import Productos from '../pages/Productos.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { PRODUCTOS_SEMILLA } from '../data/productosData.js';
import { CATEGORIAS_SEMILLA } from '../data/categoriasData.js';

// La pagina ya no lee localStorage: pide los datos a ms-catalogo con Axios.
// Para que la prueba no dependa del backend, se intercepta api.get y se
// responde con las mismas semillas que usa el seed de la base de datos.
const responderGet = (url) => {
  if (url === '/productos') return { data: PRODUCTOS_SEMILLA };
  if (url === '/categorias') return { data: CATEGORIAS_SEMILLA };
  throw new Error(`URL no esperada en la prueba: ${url}`);
};

const renderPage = () =>
    render(
        <MemoryRouter>
          <CarritoProvider>
            <Productos />
          </CarritoProvider>
        </MemoryRouter>
    );

describe('<Productos />', () => {
  beforeEach(() => {
    spyOn(api, 'get').and.callFake((url) => Promise.resolve(responderGet(url)));
  });

  it('renderiza la lista de productos que entrega la API', async () => {
    renderPage();
    expect(await screen.findByText('Abrigo Largo Paño')).toBeTruthy();
  });

  it('filtra por búsqueda en tiempo real', async () => {
    renderPage();
    await screen.findByText('Abrigo Largo Paño');

    const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/Buscar producto/i);
    fireEvent.change(input, { target: { value: 'jeans' } });

    expect(screen.getAllByText(/Pantalón Jeans Recto/i).length).toBeGreaterThan(0);
    expect(screen.queryByText('Polera Básica Blanca')).toBeNull();
  });

  it('filtra por categoría', async () => {
    renderPage();
    await screen.findByText('Abrigo Largo Paño');

    const select = screen.getByRole('combobox', { name: /categoría/i }) || screen.getByLabelText(/Filtrar por categoría/i);
    fireEvent.change(select, { target: { value: 'abrigos' } });

    expect(screen.getByText(/Abrigo Largo Paño/i)).toBeTruthy();
    expect(screen.queryByText(/Pantalón Jeans Recto/i)).toBeNull();
  });

  it('muestra mensaje cuando no hay resultados', async () => {
    renderPage();
    await screen.findByText('Abrigo Largo Paño');

    const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/Buscar producto/i);
    fireEvent.change(input, { target: { value: 'zzzz' } });

    expect(screen.getByText(/No se encontraron productos/i)).toBeTruthy();
  });

  it('muestra el error del backend si la API no responde', async () => {
    api.get.and.callFake(() =>
      Promise.reject({ mensaje: 'No se pudo conectar con el servidor.', status: 0, errores: {} })
    );

    renderPage();

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText(/No se pudo conectar con el servidor/i)).toBeTruthy();
  });
});
