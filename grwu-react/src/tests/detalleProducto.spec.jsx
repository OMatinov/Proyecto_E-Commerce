import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetalleProducto from '../pages/DetalleProducto';
import { CarritoProvider } from '../context/CarritoContext';

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
    expect(screen.getByText('Polerón Oversize Negra')).toBeInTheDocument();
  });

  it('renderiza mensaje de error cuando no existe (renderizado condicional)', () => {
    renderConId('no-existe');
    expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Agregar al carrito/i })).not.toBeInTheDocument();
  });
});