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
    Typography,
    IconButton
} from "@material-ui/core";
import { getToken } from "./service/AuthService";
import { toast, ToastContainer } from "react-toastify";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalInfo() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [timer, setTimer] = useState(null);

    const [displayModal2, setDisplayModal2] = useState(true);
    const handleClickOpen = () => {
        setDisplayModal2(true);
      };

    const handleOpen = () => {
        setTimer(
            setTimeout(() => {
                setDisplayModal2(false);
                console.log("AAA")
            }, 500)
        );
    }
    
    const handleClose2 = () => {
        setDisplayModal2(false);
    };

    return (
        <>
            <Dialog open={displayModal2} onClose={handleClose2} data-testid="form">
                <DialogTitle style={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose2}
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
                            <CheckCircleIcon color="success" fontSize="large" />
                        </div>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {"Si su email se encuentra registrado, recibirá un correo con las instrucciones para recuperar la cuenta."}
                        </h2>
                        {handleOpen}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
