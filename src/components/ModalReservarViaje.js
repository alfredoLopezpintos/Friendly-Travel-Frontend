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
import InfoIcon from '@mui/icons-material/Info';
import { Button } from '@rodrisu/friendly-ui/build/button';
import { URLS } from "../utils/urls";
import { getToken } from "./service/AuthService";
import { toast } from "react-toastify";

export default function ModalReservarViaje({ setModal, handlePrevModalClose, data }) {
    const [displayModal2, setDisplayModal2] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleClose = () => {
        setModal(false);
        handlePrevModalClose()
        setDisplayModal2(false);
    };

    const requestConfig = {
        headers: {
          Authorization: JSON.parse(getToken()),
          "Content-Type": "application/json",
        },
      };

    const handleAccept = () => {
        const appointmentPutEndPoint =
        URLS.PUT_RESERVE_TRAVEL + "/" + data.tripId;

        toast.promise((axios.put(appointmentPutEndPoint, 
            {
            //   "places": JSON.parse(data.availablePlaces)
              "places": JSON.parse(1)
            },
            requestConfig)
            .then((response) => {
                console.log(response)
                toast.success("Viaje Reservado con éxito")
                handleClose()
            }
            ).catch((error) => {
              console.error(error);
              if (error.response.data.message == "No fue posible enviar mail de confirmación, pero la reserva se realizó correctamente") {
                console.log("A" + data.availablePlaces)
              }
              toast.error(error.response.data.message)
              // console.error(error.response.data.message);
            }))
            ,
            {
              pending: {
                render() {
                  return "Cargando"
                },
                icon: true,
              },
              error: {
                render({ data }) {
                  return toast.error('Error')
                }
              }
            });
    }

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
                            <InfoIcon color="primary" fontSize="large" />
                        </div>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {'¿Desea reservar el viaje desde: ' + data.origin.city + ' hasta '+
                            data.destination.city + ' el dia ' + data.tripDate + '?'}
                        </h2>
                        <h3 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {'Cantidad de asientos a reservar: ' + 1}
                        </h3>
                    </Grid>
                    <DialogActions>
                    <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginRight: '10px' }}>
                            <Button onClick={() => handleClose()}> Cancelar </Button>
                        </li>
                        <li>
                            <Button onClick={() => handleAccept()} status="green"> Aceptar </Button>
                        </li>
                    </ul>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
}
