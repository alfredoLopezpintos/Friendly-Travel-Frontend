/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Data, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { Button, ButtonStatus } from "@rodrisu/friendly-ui/build/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { getToken } from "../components/service/AuthService";
import { Avatar } from '@rodrisu/friendly-ui/build/avatar';
import { Title } from '@rodrisu/friendly-ui/build/title';
import Rating from "@mui/material/Rating";
import { URLS } from "../utils/urls";
import { Textarea } from '@rodrisu/friendly-ui/build/textarea'

export default function ModalQualify({
  setModal,
  handlePrevModalClose,
  data,
}) {
  const [displayModal, setDisplayModal] = useState(true);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const history = useHistory();
  const [stars, setStarts] = useState(0);
  const [comments, setComments] = useState("");

  const handleClose = () => {
    setModal(false);
    handlePrevModalClose();
    setDisplayModal(false);
  };

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
      "Content-Type": "application/json",
    },
  };

  const fetchReview = () => {
    if (((data.userDriver.email && stars) !== undefined) && (stars !== 0)) {
      const reviewGetEndPoint =
        URLS.USER_HISTORY + "/" +
        data.userDriver.email +
        "/ratings"

      const dataToSend = ((comments.value) !== undefined) ? ((!(comments.value.trim() === "")) ? { score: stars, tripId: data.tripId, review: comments.value } : { score: stars, tripId: data.tripId }) : { score: stars, tripId: data.tripId }

      console.log(dataToSend)

      // if((comments.value) !== undefined) {
      //   console.log(comments)
      //   if(!(comments.value.trim() === "")) {
      //     dataToSend = { score: stars, tripId: data.tripId, review: comments.value }
      //   }
      // } else {
      //   dataToSend = { score: stars, tripId: data.tripId }
      // }

      toast.promise(axios.post(reviewGetEndPoint, dataToSend, requestConfig)
        .then((response) => {
          if (
            response.data.message ===
            "Usuario calificado correctamente."
          ) {
            toast.success("Usuario calificado con éxito");
            handleClose();
          } else {
            toast.error(response);
          }
        }).catch((error) => {
          toast.error(error.response.data.message);
        })
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
              toast.error(data.response.data.message);
            }
          }
        });
    } else if ((stars) === 0) {
      toast.error("Valor de la calificación no puede estar vacío")
    }
  }

  return (
    <>
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
          <DialogContent style={{ "padding": "0px", "overflow": "hidden" }}>
            <Grid container direction="column" alignItems="stretch" spacing={1} style={{ "padding": "8px 24px" }}>
              <br />
              <Title headingLevel={1}>
                Calificar al conductor
              </Title>
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  isBubble
                  image={data.userDriver.avatarUrl}
                />
              </div>
              <br />
              <h2 style={{ "color": "#004346", "text-align": "center" }}>
                {data.userDriver.firstName}
              </h2>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      name="highlight-selected-only"
                      highlightSelectedOnly
                      sx={{
                        "*": {
                          fontSize: "2.5rem"
                        },
                        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                          color: "theme.palette.action.disabled",

                        }
                      }}
                      onChange={(event, newValue) => {
                        if (newValue != null) {
                          setStarts(newValue)
                        }
                      }}
                    />
                  </div>
                  <br />
                  <Textarea
                    name={"Comment"}
                    label={"Comentarios (Opcional)"}
                    onChange={(event) => { setComments(event) }}
                    placeholder="Escribí tu comentario acá"
                  />
                </h3>
                <br />
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    status={ButtonStatus.SECONDARY}
                    color="primary"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={fetchReview} color="primary">
                    {"Aceptar"}
                  </Button>
                </DialogActions>
              </div>
            </Grid>
          </DialogContent>
      </Dialog>
      {/* )} */}
    </>
  );
}