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
            <ModalRegistrarVehiculo displayModal={false} toggleModal={toggleModalMock} />
        );
    });

    afterEach(() => {
        toggleModalMock.mockReset();
    });

    test('should match snapshot', async () => {
        const openButton = screen.getByText('Agregar Vehículo')     
        fireEvent.click(openButton)

        await waitFor(() => {
            const formElement = screen.getByTestId('form'); 
            expect(formElement).toMatchSnapshot();    
        }) 
      });

    test('should render successfully', async () => {

        const openButton = screen.getByText('Agregar Vehículo')     
        fireEvent.click(openButton)

        await waitFor(() => {
            const formElement = screen.getByTestId('form'); 
            expect(formElement).toBeInTheDocument();    
        })      
    });

    test('submitting form data with missing fields should display error messages', async () => {

        const openButton = screen.getByText('Agregar Vehículo')      
        fireEvent.click(openButton) 

        const submitButton = screen.getByText('Agregar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId('camporequerido')).toBeInTheDocument();
        });
    });

    test('submitting form data with invalid plate should display error message', async () => {

        const openButton = screen.getByText('Agregar Vehículo')      
        fireEvent.click(openButton)

        const plateInput = screen.getByLabelText('Matrícula');
        fireEvent.change(plateInput, { target: { value: 'abc-123' } });

        const submitButton = screen.getByText('Agregar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('Ingrese una matrícula válida')).toBeInTheDocument();
        });
    });

    test('should show error message when year is not valid', async () => {
        const openButton = screen.getByText('Agregar Vehículo')      
        fireEvent.click(openButton) 

        const inputYear = screen.getByLabelText('Año');
        fireEvent.change(inputYear, { target: { value: '123456' } });
        const addButton = screen.getByText('Agregar');
        fireEvent.submit(addButton);

        await waitFor(() =>
            expect(screen.getByText('Por favor ingrese un año entre 1950 y 2024').toBeInTheDocument)
        );
    });

    test('should show error message when seats is not valid', async () => {
        const openButton = screen.getByText('Agregar Vehículo')      
        fireEvent.click(openButton)

        const inputSeats = screen.getByLabelText('Asientos');
        fireEvent.change(inputSeats, { target: { value: '0' } });
        const addButton = screen.getByText('Agregar');
        fireEvent.submit(addButton);

        await waitFor(() => {
            expect(screen.getByText('El número de asientos debe ser entre 1 y 4')).toBeInTheDocument();
        });
   });

});