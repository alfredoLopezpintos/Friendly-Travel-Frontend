import React, { useState } from "react";
import { URLS } from "../utils/urls";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormHelperText
} from "@material-ui/core";
import { getToken } from "./service/AuthService";
import { toast } from "react-toastify";
import ModalInfo from '../components/ModalInfo';
import {
    isValidEmail
  } from "../utils/ValidationFunctions";

export default function ModalChangePass() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
        e.preventDefault();

        if (!(email.trim() === "")) {

            if(isValidEmail(email)) {
                setIsSubmitting(true);
                const requestBody = {
                    email
                };
    
                try {
                    const responseAddVehicle = await axios.post(
                        URLS.POST_REQUEST_FORGOT_PASS_URL,
                        JSON.stringify(requestBody),
                        requestConfig
                    );
                    setErrorMessage(false)
                    if(responseAddVehicle.data.message === 'Si su email se encuentra registrado, recibirá un correo con las instrucciones para recuperar la cuenta.') {
                        setSuccess(true);
                        setResult(responseAddVehicle.data.message);
                    }
                    setIsSubmitting(false);
                    setIsFormSubmitted(true);
                } catch (error) {
                    setErrorMessage(true)
                    setResult(error.response.data.message);
                    setSuccess(true);           
                    setIsSubmitting(false);
                }
            } else {
                toast.error("El formato del correo electrónico no es válido");
            }
        } else {
            toast.error("Correo electrónico no puede estar vacío");
        }
    };

    const isEmailEmpty = isFormSubmitted && email === '';

    return (
        <>
            {(success === true) ? (<ModalInfo setSuccess={setSuccess} handlePrevModalClose={handleClose} message={result} errorMessage={errorMessage} />) : 
                (
                <div>
                    {/* <button onClick={handleClickOpen}>
                        Reestablece tu contraseña
                    </button> */}
                    <h5 onClick={handleClickOpen} style={{ "text-align": "right", "color": "#172A3A", "cursor": "pointer" }}>¿Olvidaste tu contraseña?</h5>
                    <Dialog open={displayModal} onClose={handleClose} data-testid="form">
                        <form onSubmit={handleSubmit}>
                            <DialogTitle style={{"userSelect": "none"}}>Solicitud de cambio de contraseña</DialogTitle>
                            <DialogContent>
                                <Grid container direction="column" alignItems="stretch" spacing={1}>
                                    <Grid item>
                                        <TextField
                                            data-testid="camporequerido"
                                            label="Correo electrónico"
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
                    </Dialog>
                </div>)}
        </>
    )
}
