import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import axios from "axios";
import MapView from "./MapView";
import CloseIcon from "@mui/icons-material/Close";
import configData from "../configData.json";
import { Button } from "@rodrisu/friendly-ui/build/button";
import { URLS } from "../utils/urls";
import { getToken, resetUserSession, getUser } from "./service/AuthService";
import { toast } from "react-toastify";
import { blue } from "@mui/material/colors";
import { useHistory } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import "./ModalTravelInfo.css";
import styled from "styled-components";

const MapSection = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function ModalTravelInfo({
  setModal,
  handlePrevModalClose,
  data,
}) {
  const [displayModal2, setDisplayModal2] = useState(true);
  const history = useHistory();
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const handleClose = () => {
    setModal(false);
    handlePrevModalClose();
    setDisplayModal2(false);
  };
  const [libraries] = useState(["places"]);
  const containerStyle = {
    width: "200px",
    height: "200px",
  };

  const center = {
    lat: -32.522779,
    lng: -55.765835,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
    language: "es",
  });

  if (!isLoaded) {
    return <>loading...</>;
  }
  
  function calculateRoute(e) {
    e?.preventDefault();
    if (data.origin === "" || data.destination === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    toast.promise(
      directionsService
        .route({
          origin: data.origin,
          destination: data.destination,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((results) => {
          setDirectionsResponse(results);
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        pending: {
          render() {
            return "Cargando";
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return toast.error("Error");
          },
        },
      }
    );
  }

  return (
    <>
      <Dialog open={displayModal2} onClose={handleClose} data-testid="form">
        <DialogTitle
          style={{ display: "flex", justifyContent: "flex-end", padding: 0 }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" alignItems="stretch" spacing={1}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InfoIcon sx={{ color: "#09BC8A" }} fontSize="large" />
            </div>

            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  padding: "25px 55px 25px",
                  textAlign: "left",
                  userSelect: "none",
                  color: "#172A3A",
                }}
              >
                {"Origen del viaje: " + data.origin}
                <br />
                {"Destino del viaje: " + data.destination}
                <br />
                {"Duración aproximada: " + data.duration}
                <br />
                {"Distancia aproximada: " + data.distance}
                <br />
                {"Cantidad de asientos reservados: " + data.passengersQuantity}
                <br />
                {"Precio: " + data.price}
                <br />
                {"Fecha: " + data.tripDate}
                <br />
                {"Correo del chofer: " +
                  (data.userDriver.email !== undefined
                    ? data.userDriver.email
                    : data.userDriver)}
                <br />
                {"Matrícula del vehículo: " + data.vehicle}
                <br />
              </h2>
            </div>
            <MapSection>
              <MapView
                directionsResponse={directionsResponse}
                style={containerStyle}
              />
            </MapSection>
            <br />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
