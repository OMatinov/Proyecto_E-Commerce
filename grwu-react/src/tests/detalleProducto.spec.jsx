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
});