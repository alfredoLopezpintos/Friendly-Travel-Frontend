import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import ModalRegistrarVehiculo from '../components/ModalRegistrarVehiculo';

jest.mock("axios");

describe('ModalRegistrarVehiculo component', () => {
    let toggleModalMock;

    beforeEach(() => {
        toggleModalMock = jest.fn();
        render(
            <ModalRegistrarVehiculo displayModal={true} toggleModal={toggleModalMock} />
        );
    });

    afterEach(() => {
        toggleModalMock.mockReset();
    });

    // test("should add a vehicle when submitting a valid form", async () => {
    //     // setting up mock response from server
    //     const vehicle = { id: "1", marca: "Toyota", modelo: "Corolla", anho: "2015" };
    //     axios.post.mockImplementationOnce(() => Promise.resolve({ data: vehicle }));

    //     const marcaInput = screen.getByLabelText("Marca");
    //     fireEvent.change(marcaInput, { target: { value: "Toyota" } });

    //     const modeloInput = screen.getByLabelText("Modelo");
    //     fireEvent.change(modeloInput, { target: { value: "Corolla" } });

    //     const anhoInput = screen.getByLabelText("Año");
    //     fireEvent.change(anhoInput, { target: { value: "2015" } });

    //     const airbagCheckbox = screen.getByLabelText("Airbag");
    //     fireEvent.click(airbagCheckbox);

    //     const aircondCheckbox = screen.getByLabelText("A/C");
    //     fireEvent.click(aircondCheckbox);

    //     const asientosInput = screen.getByLabelText("Asientos");
    //     fireEvent.change(asientosInput, { target: { value: "5" } });

    //     const matriculaInput = screen.getByLabelText("Matrícula");
    //     fireEvent.change(matriculaInput, { target: { value: "ABC123" } });

    //     const uploadFileInput = screen.getByLabelText("Propiedad del vehículo");
    //     fireEvent.change(uploadFileInput, { target: { files: [new File([], "file.png")] } });

    //     const agregarBtn = screen.getByText("Agregar");
    //     fireEvent.click(agregarBtn);

    //     expect(agregarBtn).toBeInTheDocument("Agregando...");

    //     await waitFor(() => {
    //         expect(agregarBtn).toHaveTextContent("Agregar");
    //         expect(screen.queryByText("Vehículo agregado correctamente.")).toBeTruthy();
    //     });
    // });

    // test("should show an error snackbar when there was an error adding the vehicle", async () => {
    //     // setting up mock response from server
    //     axios.post.mockImplementationOnce(() => Promise.reject({ response: { data: { error: "failed request" } } }));

    //     const marcaInput = screen.getByLabelText("Marca");
    //     fireEvent.change(marcaInput, { target: { value: "Toyota" } });

    //     const modeloInput = screen.getByLabelText("Modelo");
    //     fireEvent.change(modeloInput, { target: { value: "Corolla" } });

    //     const anhoInput = screen.getByLabelText("Año");
    //     fireEvent.change(anhoInput, { target: { value: "2015" } });

    //     const airbagCheckbox = screen.getByLabelText("Airbag");
    //     fireEvent.click(airbagCheckbox);

    //     const aircondCheckbox = screen.getByLabelText("A/C");
    //     fireEvent.click(aircondCheckbox);

    //     const asientosInput = screen.getByLabelText("Asientos");
    //     fireEvent.change(asientosInput, { target: { value: "5" } });

    //     const matriculaInput = screen.getByLabelText("Matrícula");
    //     fireEvent.change(matriculaInput, { target: { value: "ABC123" } });

    //     const uploadFileInput = screen.getByLabelText("Propiedad del vehículo");
    //     fireEvent.change(uploadFileInput, { target: { files: [new File([], "file.png")] } });

    //     const agregarBtn = screen.getByText("Agregar");
    //     fireEvent.click(agregarBtn);

    //     expect(agregarBtn).toBeInTheDocument("Agregando...");

    //     await waitFor(() => {
    //         expect(agregarBtn).toHaveTextContent("Agregar");
    //         expect(screen.getByTestId("snackbar")).toBeInTheDocument();
    //     });
    // });

    test('should render successfully', async () => {
        const formElement = screen.getByTestId('form');
        await waitFor(() => expect(formElement).toMatchSnapshot());
    });

    test('should close the modal when cancel button is clicked', async () => {
        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);
        await waitFor(() =>
            expect(toggleModalMock).toHaveBeenCalledTimes(1)
        );
    });

    test('submitting form data with missing fields should display error messages', async () => {

        const submitButton = screen.getByText('Agregar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId('camporequerido')).toBeInTheDocument();
        });

        expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    test('submitting form data with invalid plate should display error message', async () => {

        fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: 'abc-123' } });

        const submitButton = screen.getByText('Agregar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('Ingrese una matrícula válida')).toBeInTheDocument();
        });

        expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    test('should show error message when year is not valid', async () => {
        const inputYear = screen.getByLabelText('Año');
        fireEvent.change(inputYear, { target: { value: '123456' } });
        const addButton = screen.getByText('Agregar');
        fireEvent.submit(addButton);

        await waitFor(() =>
            expect(screen.getByText('Por favor ingrese un año entre 1950 y 2024').toBeInTheDocument)
        );
    });

    test('should show error message when seats is not valid', async () => {
        const inputSeats = screen.getByLabelText('Asientos');
        fireEvent.change(inputSeats, { target: { value: '0' } });
        const addButton = screen.getByText('Agregar');
        fireEvent.submit(addButton);

        await waitFor(() => {
            expect(screen.getByText('El número de asientos debe ser entre 1 y 4')).toBeInTheDocument();
        });
    });

    // test('submitting valid form data should add a new vehicle', async () => {
    //     const mockUploadImage = jest.fn(() => Promise.resolve('imageKey'));
    //     const mockGetToken = jest.fn(() => JSON.stringify('token'));
    //     const mockPost = jest.fn().mockResolvedValue({ data: { message: 'Vehicle added successfully' } });


    //     jest.mock('../components/service/ImageUploader', () => ({
    //       useImageUploader: () => ({
    //         image: 'image',
    //         onFileChange: jest.fn(),
    //         removeImage: jest.fn(),
    //         uploadImage: mockUploadImage,
    //       }),
    //     }));

    //     jest.mock('../components/service/AuthService', () => ({
    //       getToken: mockGetToken,
    //     }));

    //     jest.mock('axios', () => ({
    //         create: () => ({
    //           post: mockPost,
    //         }),
    //       }));

    //     fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    //     fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Corolla' } });
    //     fireEvent.change(screen.getByLabelText('Año'), { target: { value: '2021' } });
    //     fireEvent.click(screen.getByLabelText('Airbag'));
    //     fireEvent.click(screen.getByLabelText('A/C'));
    //     fireEvent.change(screen.getByLabelText('Asientos'), { target: { value: '4' } });
    //     fireEvent.change(screen.getByLabelText('Matrícula'), { target: { value: 'ABC1234' } });

    //     const submitButton = screen.getByText('Agregar');
    //     fireEvent.click(submitButton);

    //     await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    //     expect(axios.post).toHaveBeenCalledWith(
    //       'https://example.com/api/vehicles',
    //       JSON.stringify({
    //         manufacturer: 'Toyota',
    //         model: 'Corolla',
    //         year: '2021',
    //         airBag: true,
    //         airCond: true,
    //         plate: 'ABC1234',
    //         seats: '4',
    //         image: 'image',
    //         imageKey: 'imageKey',
    //       }),
    //       {
    //         headers: {
    //           Authorization: 'token',
    //           'Content-Type': 'application/json',
    //         },
    //       }, { timeout: 5000 }
    //     );

    //     expect(screen.getByTestId('form')).not.toBeInTheDocument();
    //   });


});