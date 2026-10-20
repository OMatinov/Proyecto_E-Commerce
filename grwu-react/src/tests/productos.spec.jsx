import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';

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
    localStorage.clear();
  });

  it('renderiza la lista de productos desde la semilla', () => {
    renderPage();
    expect(screen.getByText('Abrigo Largo Paño')).toBeTruthy();
  });

  it('filtra por búsqueda en tiempo real', () => {
    renderPage();

    // ✅ Selector infalible para el input de búsqueda
    const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/Buscar producto/i);
    fireEvent.change(input, { target: { value: 'jeans' } });

    // ✅ Usamos getAllByText porque la base de datos tiene 2 productos con "Jeans"
    expect(screen.getAllByText(/Pantalón Jeans Recto/i).length).toBeGreaterThan(0);

    // ✅ Verificamos que un producto que NO es jeans haya desaparecido
    expect(screen.queryByText('Polera Básica Blanca')).toBeNull();
  });

  it('filtra por categoría', () => {
    renderPage();

    // ✅ Buscamos el select por su role o por su label
    const select = screen.getByRole('combobox', { name: /categoría/i }) || screen.getByLabelText(/Filtrar por categoría/i);

    // ✅ Disparamos el cambio a la categoría 'abrigos' (sabemos que "Abrigo Largo Paño" está en la semilla)
    fireEvent.change(select, { target: { value: 'abrigos' } });

    // ✅ Verificamos que aparezca el producto de esa categoría
    expect(screen.getByText(/Abrigo Largo Paño/i)).toBeTruthy();

    // ✅ Verificamos que un producto de OTRA categoría (ej. pantalones) ya no aparezca
    expect(screen.queryByText(/Pantalón Jeans Recto/i)).toBeNull();
  });

  it('muestra mensaje cuando no hay resultados', () => {
    renderPage();

    // ✅ Mismo selector infalible
    const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/Buscar producto/i);
    fireEvent.change(input, { target: { value: 'zzzz' } });

    expect(screen.getByText(/No se encontraron productos/i)).toBeTruthy();
  });
});