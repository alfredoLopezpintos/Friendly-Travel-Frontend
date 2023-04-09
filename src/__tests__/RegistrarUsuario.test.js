import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import RegistrarUsuario from '../components/pages/RegistrarUsuario';

jest.mock('axios');

describe('RegistrarUsuario', () => {
  beforeEach(() => {
    render(<MemoryRouter><RegistrarUsuario /></MemoryRouter>);
  });

  it('renders RegistrarUsuario component', () => {
    const formElement = screen.getByTestId('form');
    expect(formElement).toMatchSnapshot();
  });

  it('form validation works - without filling out any fields', () => {
    const nameInput = screen.getByPlaceholderText('Ingrese su nombre');
    const surnameInput = screen.getByPlaceholderText('Ingrese su apellido');
    const emailInput = screen.getByPlaceholderText('Ingrese su email');
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    const documentIdInput = screen.getByPlaceholderText('Sin puntos ni guiones, ej. 43215678');
    const phoneNumberInput = screen.getByPlaceholderText('Número de teléfono, ej. 099111333');
    const checkboxElement = screen.getByLabelText('Confirmo haber leído y estar de acuerdo con las políticas de uso de FriendlyTravel');
    const formElement = screen.getByTestId('form');

    fireEvent.submit(formElement);
    (() =>
      expect(getByText("Debe completar todos los campos")).toBeInTheDocument()
    );
  });

  it('form validation works - Fill out fields incorrectly', () => {
    const nameInput = screen.getByPlaceholderText('Ingrese su nombre');
    const surnameInput = screen.getByPlaceholderText('Ingrese su apellido');
    const emailInput = screen.getByPlaceholderText('Ingrese su email');
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    const documentIdInput = screen.getByPlaceholderText('Sin puntos ni guiones, ej. 43215678');
    const phoneNumberInput = screen.getByPlaceholderText('Número de teléfono, ej. 099111333');
    const checkboxElement = screen.getByLabelText('Confirmo haber leído y estar de acuerdo con las políticas de uso de FriendlyTravel');
    const formElement = screen.getByTestId('form');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(surnameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'invalidEmail.com' } });
    fireEvent.change(inputElement, { target: { value: 'invalidDate' } });
    fireEvent.change(documentIdInput, { target: { value: '123' } });
    fireEvent.change(phoneNumberInput, { target: { value: '123' } });
    fireEvent.click(checkboxElement);
    fireEvent.submit(formElement);
    (() =>
      expect(getByText("El formato del correo electrónico no es válido")).toBeInTheDocument()
    );
    (() =>
      expect(getByText("Fecha inválida")).toBeInTheDocument()
    );
    (() =>
      expect(getByText("Debe estar de acuerdo con las políticas de uso de FriendlyTravel para poder registrarse.")).toBeInTheDocument()
    );
  });

  it('form validation works - Fill out fields correctly', () => {
    const nameInput = screen.getByPlaceholderText('Ingrese su nombre');
    const surnameInput = screen.getByPlaceholderText('Ingrese su apellido');
    const emailInput = screen.getByPlaceholderText('Ingrese su email');
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    const documentIdInput = screen.getByPlaceholderText('Sin puntos ni guiones, ej. 43215678');
    const phoneNumberInput = screen.getByPlaceholderText('Número de teléfono, ej. 099111333');
    const checkboxElement = screen.getByLabelText('Confirmo haber leído y estar de acuerdo con las políticas de uso de FriendlyTravel');
    const formElement = screen.getByTestId('form');

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(surnameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@mail.com' } });
    fireEvent.change(inputElement, { target: { value: '11-11-2000' } });
    fireEvent.change(documentIdInput, { target: { value: '12345678' } });
    fireEvent.change(phoneNumberInput, { target: { value: '099111333' } });
    fireEvent.click(checkboxElement);
    fireEvent.submit(formElement);
    (() =>
      expect(axios.post).toHaveBeenCalled()
    );
  });
});
