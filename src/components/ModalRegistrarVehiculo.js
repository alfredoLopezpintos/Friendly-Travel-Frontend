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
import { useImageUploader } from "./service/ImageUploader";
// import { Button as Button2 } from "../components/Button";
import { Button as Button2 }  from '@rodrisu/friendly-ui/build/button';
import "./pages/ChangeData.css"

export default function ModalRegistrarVehiculo() {
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [airBag, setAirBag] = useState(false);
    const [airCond, setAirCond] = useState(false);
    const [seats, setSeats] = useState('');
    const [plate, setPlate] = useState('');
    const [file, setFile] = useState(null);
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
        setIsFormSubmitted(true);

        // Validation logic
        let validYear = false;
        validYear = checkVehicleYear(year).valid;

        let validPlate = false;
        validPlate = checkPlate(plate).valid;

        let validSeats = false;
        validSeats = checkSeats(seats).valid;

        if (!image) {
            setImageError(true);
            setIsSubmitting(false);
            return;
        }

        if (manufacturer && model && validYear && seats && validPlate && validSeats && !imageError) {
            setIsSubmitting(true);
            const requestBody = {
                manufacturer,
                model,
                year,
                airbag: airBag,
                airCond: airCond,
                plate,
                seats,
            };

            if (image) {
                requestBody.image = image;
            }

            try {
                const imageKey = await uploadImage(plate);
                requestBody.imageKey = imageKey;

                //console.log(URLS.POST_VEHICLE_URL)
                //console.log(JSON.stringify(requestBody))
                //console.log(requestConfig)

                const responseAddVehicle = await axios.post(
                    URLS.POST_VEHICLE_URL,
                    JSON.stringify(requestBody),
                    requestConfig
                );
                setResult(responseAddVehicle.data.message);
                setSnackbarOpen(true);
                setIsSubmitting(false);
            } catch (error) {
                console.error(error);
                setResult(error.response.data.message);
                setIsSubmitting(false);
                setSnackbarOpen(true);
            }
        } else {
            setIsSubmitting(false);
            setResult(
                'Por favor complete todos los campos y asegúrese que todos tienen el formato correcto.'
            );
        }
    };

    const isManufacturerEmpty = isFormSubmitted && manufacturer === '';
    const isModelEmpty = isFormSubmitted && model === '';
    const isYearEmpty = isFormSubmitted && year === '';
    const isSeatsEmpty = isFormSubmitted && seats === '';
    const isPlateEmpty = isFormSubmitted && plate === '';
    const isImageEmpty = isFormSubmitted && file === null;

    // Error message for invalid year
    let yearHelperText = '';
    if (isYearEmpty) {
        yearHelperText = 'Campo requerido';
    } else if (year !== '' && !checkVehicleYear(year).valid) {
        yearHelperText = checkVehicleYear(year).message;
    }

    // Error message for invalid license plate
    let plateHelperText = '';
    if (isPlateEmpty) {
        plateHelperText = 'Campo requerido';
    } else if (plate !== '' && !checkPlate(plate).valid) {
        plateHelperText = checkPlate(plate).message;
    }

    // Error message for invalid seats
    let seatsHelperText = '';
    if (isSeatsEmpty) {
        seatsHelperText = 'Campo requerido';
    } else if (seats !== '' && !checkSeats(seats).valid) {
        seatsHelperText = checkSeats(seats).message;
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        if (result === 'Vehículo agregado correctamente.') {
            handleClose();
        }
    };

    return (
        <>
            <Button2 
              className="btns"
              buttonStyle="btn--test"
              buttonSize="btn--large"
              onClick={handleClickOpen}>
              Agregar Vehículo
            </Button2>
            <Dialog open={displayModal} onClose={handleClose} data-testid="form">
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Agregar vehículo</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" alignItems="stretch" spacing={1}>
                            <Grid item>
                                <TextField
                                    data-testid="camporequerido"
                                    label="Marca"
                                    id="Marca"
                                    value={manufacturer}
                                    onChange={(e) => setManufacturer(e.target.value)}
                                    fullWidth
                                    error={isManufacturerEmpty}
                                    helperText={isManufacturerEmpty && <FormHelperText>Campo requerido</FormHelperText>}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Modelo"
                                    id="Modelo"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    fullWidth
                                    error={isModelEmpty}
                                    helperText={isModelEmpty && <FormHelperText>Campo requerido</FormHelperText>}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Año"
                                    id="Año"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    fullWidth
                                    error={(isFormSubmitted && isYearEmpty) || (isFormSubmitted && yearHelperText !== '')}
                                    helperText={yearHelperText}
                                />
                            </Grid>
                            <Grid item>
                                <Grid container direction="row">
                                    <Grid item style={{ marginRight: '20px' }}>
                                        <FormControlLabel
                                            control={<Checkbox value={airBag} onChange={(e) => setAirBag(e.target.checked)} />}
                                            label="Airbag"
                                            id="Airbag"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Checkbox value={airCond} onChange={(e) => setAirCond(e.target.checked)} />}
                                            label="A/C"
                                            id="A/C"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Asientos"
                                    id="Asientos"
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    fullWidth
                                    error={(isFormSubmitted && isSeatsEmpty) || (isFormSubmitted && seatsHelperText !== '')}
                                    helperText={seatsHelperText}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Matrícula"
                                    id="Matrícula"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value)}
                                    fullWidth
                                    error={(isFormSubmitted && isPlateEmpty) || (isFormSubmitted && plateHelperText !== '')}
                                    helperText={plateHelperText}
                                />
                            </Grid>
                            <Grid item>
                                <label htmlFor="upload-file" style={{ display: 'block', marginTop: '15px' }}>
                                    <Typography variant="subtitle2">Propiedad del vehículo</Typography>
                                </label>
                                {!image && (
                                    <TextField
                                        data-testid="upload-file"
                                        id="upload-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        error={imageError}
                                        helperText={imageError && <FormHelperText error={true}>Campo requerido</FormHelperText>}
                                        fullWidth
                                    />
                                )}
                                {image && (
                                    <div>
                                        <div><img src={image} alt="Uploaded file" className="uploaded-image" /></div>
                                        <Button onClick={removeImage}>Quitar archivo</Button>
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button type="submit" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Agregando...' : 'Agregar'}
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
        </>
    );
}
