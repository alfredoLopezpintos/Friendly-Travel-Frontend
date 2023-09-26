import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

export default function ModalReservarViaje({ setModal, handlePrevModalClose, data }) {
    const [displayModal2, setDisplayModal2] = useState(true);
    
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
                            <InfoIcon color="primary" fontSize="large" />
                        </div>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {'¿Desea reservar el viaje desde: ' + data.origin + ' hasta '+
                            data.destination + ' el dia ' + data.tripDate + '?'}
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
                </DialogContent>
            </Dialog>
        </>
    );
}
