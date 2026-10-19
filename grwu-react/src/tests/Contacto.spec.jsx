import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '../pages/Contacto.jsx';

describe('Pruebas en el componente React Contacto', () => {
  
  // PRUEBA 9
  it('9. Debe renderizar el formulario y los campos correctamente', () => {
    render(<Contacto />);
    expect(screen.getByText(/Estamos aquí para ayudarte/i)).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej. Juan Pérez')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Enviar mensaje/i })).toBeTruthy();
  });

  // PRUEBA 10
  it('10. Debe mostrar mensajes de error si se intenta enviar vacío', () => {
    render(<Contacto />);
    
    // Simulamos el clic en enviar sin llenar nada
    const botonEnviar = screen.getByRole('button', { name: /Enviar mensaje/i });
    fireEvent.click(botonEnviar);

    // Verificamos que aparezcan los mensajes de validación
    expect(screen.getByText(/Ingresa tu nombre completo/i)).toBeTruthy();
    expect(screen.getByText(/Ingresa tu correo electrónico/i)).toBeTruthy();
    
    // Usamos getAllByText porque "Selecciona un asunto" aparece 2 veces (en el select y en el error)
    const erroresAsunto = screen.getAllByText(/Selecciona un asunto/i);
    expect(erroresAsunto.length).toBeGreaterThan(0);

    expect(screen.getByText(/Escribe un mensaje antes/i)).toBeTruthy();
  });
});