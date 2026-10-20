import { render, screen, fireEvent } from '@testing-library/react'; // ✅ 1. Usamos fireEvent en lugar de userEvent
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos.jsx'; // ✅ 2. Agregada extensión .jsx
import { CarritoProvider } from '../context/CarritoContext.jsx'; // ✅ 2. Agregada extensión .jsx

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
    // ✅ 3. Cambiado .toBeInTheDocument() por .toBeTruthy() (Nativo de Jasmine)
    expect(screen.getByText('Polerón Oversize Negra')).toBeTruthy();
  });

  it('filtra por búsqueda en tiempo real', () => {
    renderPage();

    // Nota: Asegúrate de que el texto coincida exactamente con el placeholder o label de tu JSX
    const input = screen.getByRole('searchbox', { name: /buscar/i }) || screen.getByPlaceholderText(/Buscar producto/i);

    // ✅ 4. Usamos fireEvent.change en lugar de userEvent.type (más estable en Karma)
    fireEvent.change(input, { target: { value: 'jeans' } });

    expect(screen.getByText(/Jeans Mom Fit/i)).toBeTruthy();
    // ✅ 5. Cambiado .not.toBeInTheDocument() por .toBeNull()
    expect(screen.queryByText('Polera Básica Blanca')).toBeNull();
  });

  it('filtra por búsqueda en tiempo real', () => {
    renderPage();
    // ✅ 'searchbox' es el role nativo de <input type="search">
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'jeans' } });

    expect(screen.getByText(/Jeans Mom Fit/i)).toBeTruthy();
    expect(screen.queryByText('Polera Básica Blanca')).toBeNull();
  });

  it('muestra mensaje cuando no hay resultados', () => {
    renderPage();
    // ✅ Mismo selector infalible
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'zzzz' } });

    expect(screen.getByText(/No se encontraron productos/i)).toBeTruthy();
  });
});