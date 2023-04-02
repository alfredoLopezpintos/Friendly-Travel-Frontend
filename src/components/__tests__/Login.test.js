
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Login from '../pages/Login';

jest.mock('axios');
jest.mock('jwt-decode');
jest.mock('../service/AuthService');

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correctly', () => {
    const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
    expect(container).toMatchSnapshot();
  });

  it("should display error message if email and/or password are empty", async () => {
    const { getByTestId, getByText } = render(<MemoryRouter><Login /></MemoryRouter>);
    const loginForm = getByTestId("login-form");
    fireEvent.submit(loginForm);
    (() =>
      expect(getByText("Usuario y/o contraseña no pueden estar vacíos")).toBeInTheDocument()
    );
  });

  it("should redirect to change password page when API response is NEW_PASSWORD_REQUIRED", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { message: "NEW_PASSWORD_REQUIRED" } })
    );
    const historyMock = { push: jest.fn() };
    const { getByTestId } = render(<MemoryRouter><Login history={historyMock} /></MemoryRouter>);
    const loginForm = getByTestId("login-form");
    fireEvent.submit(loginForm);
    (() => expect(historyMock.push).toHaveBeenCalledWith("/changePass")
    );
  });

  it("should set user session and redirect to home page when API response is SUCCESS", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { message: "SUCCESS", object: { idToken: "abcd" } } })
    );
    const setUserSessionMock = jest.fn();
    const historyMock = { push: jest.fn() };
    const { getByTestId } = render(<MemoryRouter><Login setUserSession={setUserSessionMock} history={historyMock} /></MemoryRouter>);
    const loginForm = getByTestId("login-form");
    fireEvent.submit(loginForm);
    (() => {
      expect(setUserSessionMock).toHaveBeenCalledWith("test@example.com", "abcd");
      expect(historyMock.push).toHaveBeenCalledWith("/");
    });
  });

  it('should show error message for incorrect email and password fields', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 400,
      },
    });

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('info@mailaddress.com'), {
      target: {
        value: 'example@mail.com',
      },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: {
        value: 'password',
      },
    });

    fireEvent.submit(screen.getByTestId('login-form'));
    (() =>
      expect(getByText("Usuario y/o contraseña incorrectos")).toBeInTheDocument()
    );
  });

  it('Displays default error message when an unexpected error occurs', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('info@mailaddress.com'), {
      target: {
        value: 'example@mail.com',
      },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: {
        value: 'password',
      },
    });

    fireEvent.submit(screen.getByTestId('login-form'));
    (() =>
      expect(getByText("Lo sentimos, el servidor parece encontrarse en mantenimiento. Por favor intentelo de nuevo más tarde")).toBeInTheDocument()
    );
  });

  it("should display error message when API response status is 401 or 403", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 403, data: { message: "FORBIDDEN" } } })
    );
    const { getByTestId, getByText } = render(<MemoryRouter><Login /></MemoryRouter>);
    const loginForm = getByTestId("login-form");
    fireEvent.submit(loginForm);
    (() =>
      expect(getByText("FORBIDDEN")).toBeInTheDocument()
    );
  });

  it("should render error message if user enters invalid email address", async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const emailInput = screen.getByTestId("email-input");

    fireEvent.change(screen.getByPlaceholderText('info@mailaddress.com'), {
      target: {
        value: 'invalidEmail',
      },
    });
    fireEvent.blur(emailInput);

    (() => {
      const errorMessage = screen.getByText(
        "Por favor ingrese un email válido"
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
