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

  test('renders RegistrarUsuario component', () => {
    const formElement = screen.getByTestId('form');
    expect(formElement).toMatchSnapshot();
  });

  test("form validation fails when fields are empty and shows error message", () => {
    fireEvent.submit(screen.getByTestId('form'));
    (() =>
      expect(getByText("Debe completar todos los campos")).toBeInTheDocument()
    );
  });

  test("form validation fails when birthdate is invalid and shows error message", () => {
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    fireEvent.change(inputElement, { target: { value: '32-07-1992' } });
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("Fecha inválida")).toBeInTheDocument()
    );
  });

  test("form validation fails when user is under 18 and shows error message", () => {
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    fireEvent.change(inputElement, { target: { value: '31-07-2022' } });
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("El usuario debe ser mayor de edad")).toBeInTheDocument()
    );
  });

  test("form validation fails when email format is invalid and shows error message", () => {
    const emailField = screen.getByPlaceholderText("Ingrese su email");
    fireEvent.change(emailField, { target: { value: "email@invalid" } });
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("El formato del correo electrónico no es válido")).toBeInTheDocument()
    );
  });

  test("form validation fails when phone number format is invalid and shows error message", () => {
    const phoneField = screen.getByPlaceholderText("Número de teléfono, ej. 099111333");
    fireEvent.change(phoneField, { target: { value: "123456789" } });
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("El formato del teléfono no es válido")).toBeInTheDocument()
    );
  });

  test("form validation fails when document ID is invalid and shows error message", () => {
    const documentId = screen.getByPlaceholderText("Sin puntos ni guiones, ej. 43215678");
    fireEvent.change(documentId, { target: { value: "12345678" } });
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("La cédula de identidad es inválida")).toBeInTheDocument()
    );
  });

  test("form validation fails when checkbox is not checked and shows error message", () => {
    fireEvent.submit(screen.getByTestId("form"));
    (() =>
      expect(screen.getByText("Debe estar de acuerdo con la política de uso de FriendlyTravel para poder registrarse.")).toBeInTheDocument()
    );
  });

  test('form validation works - Fill out fields correctly', () => {
    const nameInput = screen.getByPlaceholderText('Ingrese su nombre');
    const surnameInput = screen.getByPlaceholderText('Ingrese su apellido');
    const emailInput = screen.getByPlaceholderText('Ingrese su email');
    const birthdateInput = screen.getByTestId('birthDate');
    const inputElement = birthdateInput.querySelector('input')
    const documentIdInput = screen.getByPlaceholderText('Sin puntos ni guiones, ej. 43215678');
    const phoneNumberInput = screen.getByPlaceholderText('Número de teléfono, ej. 099111333');
    const checkboxElement = screen.getByLabelText('Confirmo haber leído y estar de acuerdo con las políticas de uso de FriendlyTravel');
    const imageField = screen.getByLabelText("Foto frontal de la C.I.");
    const formElement = screen.getByTestId('form');

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(surnameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@mail.com' } });
    fireEvent.change(inputElement, { target: { value: '11-11-2000' } });
    fireEvent.change(documentIdInput, { target: { value: '12345678' } });
    fireEvent.change(phoneNumberInput, { target: { value: '099111333' } });
    fireEvent.change(inputElement, { target: { value: '25-07-1992' } });
    Object.defineProperty(imageField, "files", {
      value: [
        new File(["(⌐□_□)"], "test.png", {
          type: "image/png",
        }),
      ],
    });
    fireEvent.change(imageField);
    fireEvent.click(checkboxElement);
    fireEvent.submit(formElement);
    (() =>
      expect(axios.post).toHaveBeenCalled()
    );
  });
});
