/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
} from "@material-ui/core";
import MapView from "./MapView";
import CloseIcon from "@mui/icons-material/Close";
import configData from "../configData.json";
import { toast } from "react-toastify";
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
  const [displayModal, setDisplayModal] = useState(true);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const handleClose = () => {
    setModal(false);
    handlePrevModalClose();
    setDisplayModal(false);
  };
  const [libraries] = useState(["places"]);
  const containerStyle = {
    width: "300px",
    height: "265px",
  };

  const { isLoaded: isMapsApiLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
    language: "es",
  });

  const calculateRoute = (travelData) => {
    const directionsService = new google.maps.DirectionsService();
    toast.promise(
      directionsService
        .route({
          origin: travelData.origin,
          destination: travelData.destination,
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
          render() {
            return toast.error("Error");
          },
        },
      }
    );
  };

  useEffect(() => {
    if (isMapsApiLoaded) {
      calculateRoute(data);
    }
  }, [isMapsApiLoaded]);

  return (
    <>
      {!isMapsApiLoaded ? (
        <>Loading...</>
      ) : (
        <Dialog open={displayModal} onClose={handleClose} data-testid="form">
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
            <Grid container direction="column" alignItems="stretch" spacing={1} style={{ "padding": "8px 24px" }}>
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
                <h3
                  style={{
                    textAlign: "left",
                    userSelect: "none",
                    color: "#172A3A",
                    width: "300px",
                  }}
                >
                  <br />
                  {"Origen del viaje: " + data.origin}
                  <br />
                  {"Destino del viaje: " + data.destination}
                  <br />
                  {"Duración aproximada: " + data.duration}
                  <br />
                  {"Distancia aproximada: " + data.distance}
                  <br />
                  {"Cantidad de asientos reservados: " +
                    data.passengersQuantity}
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
                </h3>
                <br />
              </div>
            </Grid>
            <div style={{ textAlign: "center" }}>
              <MapSection style={{"height": "265px"}}>
                <MapView
                  directionsResponse={directionsResponse}
                  style={containerStyle}
                />
              </MapSection>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
