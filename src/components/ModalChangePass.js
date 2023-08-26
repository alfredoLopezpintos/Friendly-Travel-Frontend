import React, { useState, useEffect } from "react";
import { URLS } from "../utils/urls";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Grid,
    Snackbar,
    FormHelperText,
    Typography
} from "@material-ui/core";
import { checkPlate, checkVehicleYear, checkSeats } from "../utils/ValidationFunctions";
import { getToken } from "./service/AuthService";
import { toast, ToastContainer } from "react-toastify";
import ModalInfo from '../components/ModalInfo';
import './ModalChangePass' 
import {
    isValidEmail
  } from "../utils/ValidationFunctions";

export default function ModalChangePass() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const [displayModal, setDisplayModal] = useState(false);
    const handleClickOpen = () => {
        setDisplayModal(true);
      };
    
      const handleClose = () => {
        setDisplayModal(false);
      };

    const requestConfig = {
        headers: {
            Authorization: JSON.parse(getToken()),
            "Content-Type": "application/json",
        },
    };

    const handleSubmit = async (e) => {

        if (email.trim() === "") {
            toast.error("Correo no puede ser vacío");
            return;
          } else if(!isValidEmail(email)) {
            toast.error("El formato del correo electrónico no es válido");
            return;
          }

        e.preventDefault();
        setIsFormSubmitted(true);

        if (email) {
            setIsSubmitting(true);
            const requestBody = {
                email
            };

            try {
                const responseAddVehicle = await axios.post(
                    URLS.POST_REQUEST_CHANGE_PASS_URL,
                    JSON.stringify(requestBody),
                    requestConfig
                );
                // console.log(responseAddVehicle.data.message)
                setErrorMessage(false)
                if(responseAddVehicle.data.message === 'Si su email se encuentra registrado, recibirá un correo con las instrucciones para recuperar la cuenta.') {
                    setSuccess(true);
                    setResult(responseAddVehicle.data.message);
                }
                // setSnackbarOpen(true);
                setIsSubmitting(false);
                setIsFormSubmitted(true);
            } catch (error) {
                setErrorMessage(true)
                // console.log(error.response.data.message)
                setResult(error.response.data.message);
                setSuccess(true);
                // console.error(error);                
                setIsSubmitting(false);
                // setSnackbarOpen(true);
            }
        } else {
            setIsSubmitting(false);
            setResult(
                'Por favor complete todos los campos y asegúrese que todos tienen el formato correcto.'
            );
        }
    };

    const isEmailEmpty = isFormSubmitted && email === '';

    const handleSnackbarClose = () => {
        // setSnackbarOpen(false);
        // if (result === 'Si su email se encuentra registrado, recibirá un correo con las instrucciones para recuperar la cuenta.') {
        //     handleClose();
        // }
    };

    return (
        <>
            {(success === true) ? (<ModalInfo setSuccess={setSuccess} handleClose={handleClose} message={result} errorMessage={errorMessage} />) : 
                (
                <div>
                <button onClick={handleClickOpen}>
                    Reestablece tu contraseña
                </button>
                <Dialog open={displayModal} onClose={handleClose} data-testid="form">
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Solicitud de cambio de contraseña</DialogTitle>
                        <DialogContent>
                            <Grid container direction="column" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <TextField
                                        data-testid="camporequerido"
                                        label="Correo Electrónico"
                                        id="Marca"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        error={isEmailEmpty}
                                        helperText={isEmailEmpty && <FormHelperText>Campo requerido</FormHelperText>}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancelar
                            </Button>
                            <Button type="submit" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Cargando...' : 'Enviar'}
                            </Button>
                        </DialogActions>
                    </form>
                    <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    message={result}
                    contentProps={{
                        style: { backgroundColor: 'green' },
                    }}
                />
                </Dialog>
                </div>)}
        </>
    )
}
