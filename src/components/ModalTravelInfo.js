import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    DialogActions,
    IconButton
} from "@material-ui/core";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@rodrisu/friendly-ui/build/button';
import { URLS } from "../utils/urls";
import { getToken, resetUserSession, getUser } from "./service/AuthService";
import { toast } from "react-toastify";
import { blue } from '@mui/material/colors';
import { useHistory } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import './ModalTravelInfo.css'

export default function ModalTravelInfo({ setModal, handlePrevModalClose, data }) {
    const [displayModal2, setDisplayModal2] = useState(true);
    const history = useHistory();

    const handleClose = () => {
        setModal(false);
        handlePrevModalClose()
        setDisplayModal2(false);
    };

    return (
        <>
            <Dialog open={displayModal2} onClose={handleClose} data-testid="form">
                <DialogTitle style={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500]
                        }}
                        >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="column" alignItems="stretch" spacing={1}>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <InfoIcon sx={{ color: blue[500] }} fontSize="large" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none",
                        }}>
                        {'Origen del viaje: ' + data.origin}
                        <br />
                        {'Destino del viaje: ' + data.destination}
                        <br />
                        {'Duración aproximada: ' + data.duration}
                        <br />
                        {'Distancia aproximada: ' + data.distance}
                        <br />
                        {'Cantidad de asientos reservados: ' + data.passengersQuantity}
                        <br />
                        {'Precio: ' + data.price}
                        <br />
                        {'Fecha: ' + data.tripDate}
                        <br />
                        {'Correo del chofer: ' + ((data.userDriver.email != undefined) ? data.userDriver.email : data.userDriver) }
                        <br />
                        {'Matrícula del vehículo: ' + data.vehicle}
                        <br />
                        </h2>
                        </div>
                        <br />
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
