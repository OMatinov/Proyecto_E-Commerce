import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos';
import { CarritoProvider } from '../context/CarritoContext';

const renderPage = () =>
  render(
    <MemoryRouter>
      <CarritoProvider>
        <Productos />
      </CarritoProvider>
    </MemoryRouter>
  );

describe('<Productos />', () => {
  beforeEach(() => localStorage.clear());

  it('renderiza la lista de productos desde la semilla', () => {
    renderPage();
    expect(screen.getByText('Polerón Oversize Negra')).toBeInTheDocument();
  });

  it('filtra por búsqueda en tiempo real', async () => {
    renderPage();
    const input = screen.getByLabelText('Buscar producto');
    await userEvent.type(input, 'jeans');
    expect(screen.getByText('Jeans Mom Fit')).toBeInTheDocument();
    expect(screen.queryByText('Polera Básica Blanca')).not.toBeInTheDocument();
  });

  it('filtra por categoría', async () => {
    renderPage();
    await userEvent.selectOptions(screen.getByLabelText('Filtrar por categoría'), 'polerones');
    expect(screen.getByText('Polerón Oversize Negra')).toBeInTheDocument();
    expect(screen.queryByText('Gorro Beanie')).not.toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay resultados', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText('Buscar producto'), 'zzzz');
    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
  });
});