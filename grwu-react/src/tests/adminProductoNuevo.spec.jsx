import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import api from '../services/api';
import AdminProductoNuevo from '../pages/admin/AdminProductoNuevo.jsx';
import { CATEGORIAS_SEMILLA } from '../data/categoriasData.js';

const renderForm = () =>
    render(
        <MemoryRouter>
          <AdminProductoNuevo />
        </MemoryRouter>
    );

describe('<AdminProductoNuevo />', () => {
  beforeEach(() => {
    spyOn(api, 'get').and.callFake((url) => {
      if (url === '/categorias') return Promise.resolve({ data: CATEGORIAS_SEMILLA });
      return Promise.reject(new Error(`URL no esperada en la prueba: ${url}`));
    });
    spyOn(api, 'post').and.callFake((url, cuerpo) =>
      Promise.resolve({ data: { id: 'p-999', ...cuerpo } })
    );
  });

  it('muestra errores al enviar vacío', async () => {
    renderForm();
    // Se espera a que el formulario cargue las categorías de la API.
    await screen.findByRole('option', { name: 'Poleras' });

    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    const mensajeError = screen.queryByText(/al menos 3 caracteres/i) ||
        screen.queryByText(/es requerido/i) ||
        screen.queryByText(/campo obligatorio/i) ||
        screen.queryByText(/Selecciona una categoría/i);
    expect(mensajeError).toBeTruthy();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('crea un producto al enviar datos válidos (POST a la API)', async () => {
    renderForm();
    await screen.findByRole('option', { name: 'Poleras' });

    const nombreInput = document.getElementById('nombre');
    const categoriaSelect = document.getElementById('categoria');
    const descripcionInput = document.getElementById('descripcion');
    const precioInput = document.getElementById('precio');
    const stockInput = document.getElementById('stock');
    const imagenInput = document.getElementById('imagen');
    const generoSelect = document.getElementById('genero');

    fireEvent.change(nombreInput, { target: { value: 'Polera Test' } });
    fireEvent.change(categoriaSelect, { target: { value: 'poleras' } });
    fireEvent.change(descripcionInput, { target: { value: 'Descripción de prueba válida de más de 3 caracteres' } });
    fireEvent.change(precioInput, { target: { value: '1500' } });
    fireEvent.change(stockInput, { target: { value: '4' } });
    fireEvent.change(imagenInput, { target: { value: 'img/test.png' } });
    fireEvent.change(generoSelect, { target: { value: 'mujer' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalled());

    const [url, cuerpo] = api.post.calls.mostRecent().args;
    expect(url).toBe('/productos');
    expect(cuerpo.nombre).toBe('Polera Test');
    expect(cuerpo.categoria).toBe('poleras');
    expect(cuerpo.genero).toBe('mujer');
    expect(cuerpo.precio).toBe(1500);
    expect(cuerpo.stock).toBe(4);
    expect(cuerpo.imagenes).toEqual(['img/test.png']);
  });
});
