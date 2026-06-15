import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login/Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login component', () => {
    let mockLogin;

    beforeEach(() => {
        mockLogin = jest.fn().mockResolvedValue(true);
    });

    function renderWithContext(ui) {
        return render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <MemoryRouter>
                    {ui}
                </MemoryRouter>
            </AuthContext.Provider>
        );
    }

    test('muestra error si se intenta enviar sin contraseña', () => {
        const { getByPlaceholderText, getByText } = renderWithContext(<Login />);
        const correoInput = getByPlaceholderText('Ingrese su correo o usuario');
        fireEvent.change(correoInput, { target: { value: 'Admin' } });

        const submitButton = getByText('Acceder');
        fireEvent.click(submitButton);

        expect(getByText('Ingrese su contraseña para continuar.')).toBeInTheDocument();
    });

    test('permite alternar visibilidad de la contraseña', () => {
        const { getByPlaceholderText, getByRole } = renderWithContext(<Login />);
        const passwordInput = getByPlaceholderText('Ingrese su contraseña');
        const toggleButton = getByRole('button', { name: /mostrar contraseña/i });

        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');

        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
    });

    test('llama a la función login con credenciales válidas', async () => {
        const { getByPlaceholderText, getByText } = renderWithContext(<Login />);
        const correoInput = getByPlaceholderText('Ingrese su correo o usuario');
        const passwordInput = getByPlaceholderText('Ingrese su contraseña');

        fireEvent.change(correoInput, { target: { value: 'Admin' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });

        const submitButton = getByText('Acceder');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({ Correo: 'Admin', password: '12345678' });
        });
    });
});
