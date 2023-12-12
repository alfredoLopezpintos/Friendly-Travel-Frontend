import React, { useState } from "react";
import { URLS } from "../utils/urls";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  FormHelperText,
} from "@material-ui/core";
import {  getUser } from "./service/AuthService";
import { useImageUploader } from "./service/ImageUploader";
import { Button, ButtonStatus } from "@rodrisu/friendly-ui/build/button";
import { toast } from "react-toastify";
import "./pages/ChangeData.css";

export default function ModalFotoPerfil() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { image, onFileChange, removeImage, uploadImage } = useImageUploader();
  const [imageError, setImageError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [displayModal, setDisplayModal] = useState(false);
  const handleClickOpen = () => {
    setDisplayModal(true);
  };

  const clearCacheData = () => {
    caches.keys().then((names) => {
        names.forEach((name) => {
            caches.delete(name);
        });
    });
};

  const handleClose = () => {
    setDisplayModal(false);
    removeImage();
    setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
      if (result === "Foto agregada correctamente.") {
        handleClose();
      }
    };

    if (!image) {
      toast.error("Debe seleccionar una imagen válida");
      setImageError(true);
      setIsSubmitting(false);
      return;
    }

    if (!imageError) {
      setIsSubmitting(true);
      const requestBody = {};

      if (image) {
        requestBody.image = image;

        // console.log(requestBody);
      }

      try {
        await uploadImage(getUser() + "_avatar");

        setSnackbarOpen(true);
        setIsSubmitting(false);
        handleSnackbarClose();
        handleClose();
        toast.success("Foto agregada correctamente",
        {
          autoClose: 3000,
        });
        clearCacheData();
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } catch (error) {
        // console.error(error);
        setResult(error.response.data.message);
        setIsSubmitting(false);
        setSnackbarOpen(true);
      }
    } else {
      setIsSubmitting(false);
      setResult(
        "Por favor complete todos los campos y asegúrese que todos tienen el formato correcto."
      );
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (result === "Foto agregada correctamente.") {
      handleClose();
    }
  };

  return (
    <>
      <Button
        className="btns"
        buttonStyle="btn--test"
        buttonSize="btn--large"
        onClick={handleClickOpen}
      >
        Cambiar foto de perfil
      </Button>
      <Dialog open={displayModal} onClose={handleClose} data-testid="form">
        <form onSubmit={handleSubmit}>
          <DialogTitle style={{"color": "#172A3A"}} >Cambiar foto de perfil</DialogTitle>
          <DialogContent>
            <Grid container direction="column" alignItems="stretch" spacing={1}>
              <Grid item>
                {!image && (
                  <TextField
                    data-testid="upload-file"
                    id="upload-file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    error={imageError}
                    helperText={
                      imageError && (
                        <FormHelperText error={true}>
                          Campo requerido
                        </FormHelperText>
                      )
                    }
                    fullWidth
                  />
                )}
                {image && (
                  <div>
                    <div>
                      <img
                        src={image}
                        alt="Uploaded file"
                        className="uploaded-image"
                      />
                    </div>
                    <Button status={ButtonStatus.WARNING} onClick={removeImage}>
                      Quitar archivo
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              status={ButtonStatus.SECONDARY}
              color="primary"
            >
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Agregando..." : "Agregar"}
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
            style: { backgroundColor: "green" },
          }}
        />
      </Dialog>
    </>
  );
}
