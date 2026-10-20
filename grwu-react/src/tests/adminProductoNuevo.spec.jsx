import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminProductoNuevo from '../pages/admin/AdminProductoNuevo';
import { listarProductos } from '../data/productosData';

const renderForm = () =>
  render(
    <MemoryRouter>
      <AdminProductoNuevo />
    </MemoryRouter>
  );

describe('<AdminProductoNuevo />', () => {
  beforeEach(() => localStorage.clear());

  it('muestra errores al enviar vacío', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
  });

  it('crea un producto al enviar datos válidos (evento + mock)', async () => {
    renderForm();
    const antes = listarProductos().length;

    await userEvent.type(screen.getByLabelText('Nombre'), 'Producto Test');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'poleras');
    await userEvent.type(screen.getByLabelText('Precio'), '1500');
    await userEvent.type(screen.getByLabelText('Stock'), '4');
    await userEvent.type(screen.getByLabelText('Ruta de imagen'), 'img/test.png');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(listarProductos().length).toBe(antes + 1);
  });
});