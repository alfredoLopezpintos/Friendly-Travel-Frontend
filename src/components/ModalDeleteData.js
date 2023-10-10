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
import { red } from '@mui/material/colors';
import { useHistory } from "react-router-dom";
import ReportIcon from '@mui/icons-material/Report';

export default function ModalDeleteData({ setModal, handlePrevModalClose }) {
    const [displayModal2, setDisplayModal2] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const history = useHistory();

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

    const handleDelete = async () => {

        const deleteUserEndPoint =
        URLS.DELETE_USER + "/" + getUser().replace(/@/g, '%40');

        toast.promise((axios.delete(deleteUserEndPoint, requestConfig)
            .then((response) => {
                console.log(response)
                toast.success("Datos eliminados con éxito")
                resetUserSession();
                window.location.reload(false);
                history.push("/");
            }
            ).catch((error) => {
                console.error(error);
                toast.error(error.response.data.message)
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
                            <ReportIcon sx={{ color: red[500] }} fontSize="large" />
                        </div>
                        <h2 style={{
                            "padding": "10px",
                            "paddingBottom": "25px",
                            "textAlign": "center",
                            "userSelect": "none"
                        }}>
                            {'¿Desea borrar los datos de usuario?'}
                            <br />
                            {'Esta acción es permanente y no se puede deshacer.'}
                        </h2>
                        <br />
                    </Grid>
                    <DialogActions>
                    <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginRight: '10px' }}>
                            <Button onClick={() => handleClose()} status="green"> Cancelar </Button>
                        </li>
                        <li>
                            <Button onClick={() => handleDelete()} status="warning"> Aceptar </Button>
                        </li>
                    </ul>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
}
