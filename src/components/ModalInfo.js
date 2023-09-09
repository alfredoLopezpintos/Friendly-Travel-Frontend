import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton
} from "@material-ui/core";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';

export default function ModalInfo({ setSuccess, handlePrevModalClose, message, errorMessage }) {
    const [displayModal2, setDisplayModal2] = useState(true);
    
    const handleClose = () => {
        setSuccess(false);
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
                            {(!errorMessage) ? (<CheckCircleIcon color="success" fontSize="large" />) : (<ErrorIcon color="error" fontSize="large" />)}
                        </div>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {(message === 'Attempt limit exceeded, please try after some time.') ? ('Limite de intentos excedido. Por favor intenta de nuevo más tarde.') : (message)}
                        </h2>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
