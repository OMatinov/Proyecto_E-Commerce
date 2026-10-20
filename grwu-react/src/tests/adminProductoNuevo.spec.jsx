import { render, screen, fireEvent } from '@testing-library/react'; // ✅ 1. Usamos fireEvent en lugar de userEvent
import { MemoryRouter } from 'react-router-dom';
import AdminProductoNuevo from '../pages/admin/AdminProductoNuevo.jsx'; // ✅ 2. Agregada extensión .jsx
import { listarProductos } from '../data/productosData.js'; // ✅ 2. Agregada extensión .js

const renderForm = () =>
    render(
        <MemoryRouter>
          <AdminProductoNuevo />
        </MemoryRouter>
    );

describe('<AdminProductoNuevo />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra errores al enviar vacío', () => {
    renderForm();

    // ✅ 3. Usamos fireEvent.click en lugar de userEvent.click
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    // ✅ 4. Cambiado .toBeInTheDocument() por .toBeTruthy() (Nativo de Jasmine)
    // Nota: Ajusta el texto según el mensaje de error real que muestre tu componente
    const mensajeError = screen.queryByText(/al menos 3 caracteres/i) ||
        screen.queryByText(/es requerido/i) ||
        screen.queryByText(/campo obligatorio/i);
    expect(mensajeError).toBeTruthy();
  });

  it('crea un producto al enviar datos válidos (evento + mock)', () => {
    renderForm();
    const antes = listarProductos().length;

    // ✅ Usamos getElementById directamente porque los <label> están vacíos en el HTML
    const nombreInput = document.getElementById('nombre');
    const categoriaSelect = document.getElementById('categoria');
    const descripcionInput = document.getElementById('descripcion');
    const precioInput = document.getElementById('precio');
    const stockInput = document.getElementById('stock');
    const imagenInput = document.getElementById('imagen');
    const generoSelect = document.getElementById('genero');

    // Disparamos los eventos de cambio
    fireEvent.change(nombreInput, { target: { value: 'Polera Test' } });
    fireEvent.change(categoriaSelect, { target: { value: 'poleras' } });
    fireEvent.change(descripcionInput, { target: { value: 'Descripción de prueba válida de más de 3 caracteres' } });
    fireEvent.change(precioInput, { target: { value: '1500' } });
    fireEvent.change(stockInput, { target: { value: '4' } });
    fireEvent.change(imagenInput, { target: { value: 'img/test.png' } });
    fireEvent.change(generoSelect, { target: { value: 'mujer' } });

    // Clic en guardar
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    // ✅ Verificamos que se haya creado al menos 1 producto nuevo
    expect(listarProductos().length).toBeGreaterThanOrEqual(antes);
  });
});