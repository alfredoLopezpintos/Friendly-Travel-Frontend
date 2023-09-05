import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./Login.css";
import axios from "axios";
import Moment from "moment";
import React, { useRef, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import configData from "../../configData.json";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../service/AuthService";
import Select from "react-dropdown-select";
import { getDate } from "./../Utilities"

const nafta = 74.88;

const MapContainer = styled.div`
  position: relative;
`;

const Modal = styled.div`
  position: fixed;
  left: 12%;
  transform: translate(-40%, 20px);
  width: 400px;
  height: 650px;
  padding: 40px 80px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: 999;
  background: rgb(199, 236, 255);
  background: linear-gradient(
    126deg,
    rgba(199, 236, 255, 1) 0%,
    rgba(232, 232, 232, 1) 57%,
    rgba(255, 239, 205, 1) 100%
  );
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid black;
  color: black;
  padding: 0.25em 1em;
  width: 100%;
  &:hover {
    background-color: gray;
    color: white;
  }
`;

const estilos = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};
function TravelPreviewer() {
  const [libraries] = useState(["places"]);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: "fixed",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [vehiculo, setVehiculo] = useState([]);
  const [plate, setPlate] = useState();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");

  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();
  const lugaresRef = useRef();
  const [lugares, setLugares] = useState("");
  const [precio, setPrecio] = useState();
  const [sugerido, setSugerido] = useState("");
  const [dist, setDist] = useState("");
  const [dur, setDur] = useState("");

  function isNumber(str) {
    if (str.trim() === "") {
      return false;
    }

    return !isNaN(str);
  }

  async function redirect2(data, e) {
    history.push("/");
    toast.success("Viaje creado correctamente!");
  }

  async function traerVehiculos(data) {
    const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/vehicles";

    toast.promise(
      axios
        .get(viajesGetEndpoint, {
          headers: {
            Authorization: JSON.parse(getToken()),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.length) {
            setVehiculo(response.data);
          } else {
            toast.warning(
              "No tiene vehículos registrados. Dirigete a tu panel de usuario para agregar uno."
            );
          }
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

  useEffect(() => {
    traerVehiculos();
  }, []);

  async function fetchViajes(data) {
    data.vehicle = plate;
    data.origin = origen;
    data.destination = destino;
    data.tripDate = dateRef.current.value;
    data.availablePlaces = lugaresRef.current.value;
    data.distancia = distance;
    data.duracion = duration;
    console.log(data);
    if (formValidate(data)) {
      data.tripDate = Moment(data.tripDate).format("DD-MM-YYYY");
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips";

      toast.promise(
        axios
          .post(viajesGetEndpoint, data, {
            headers: {
              Authorization: JSON.parse(getToken()),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            clearRoute();
            redirect();
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
  }

  function formValidate(data) {
    const today = getDate();
    if (
      data.tripDate === "" ||
      data.origin === "" ||
      data.price === "" ||
      data.destination === "" ||
      data.availablePlaces === ""
    ) {
      toast.error("Debe llenar todos los campos");
      return false;
    } else if (!data.vehicle) {
      toast.warning("Debe seleccionar un vehículo");
    } else if (!isNumber(data.price)) {
      toast.error("El precio debe ser un número");
    } else if (!isNumber(data.availablePlaces)) {
      toast.error("Lugares disponibles debe ser un número");
    } else if (Moment(data.tripDate) < Moment(today)) {
      toast.error("La fecha del viaje no puede ser anterior al día actual");
    } else if (!Moment(data.tripDate).isValid()) {
      toast.error("Fecha inválida");
    } else {
      return true;
    }
  }

  if (!isLoaded) {
    return <>loading...</>;
  }

  async function calculateRoute(e) {
    e?.preventDefault();
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    toast.promise(
      directionsService
        .route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((results) => {
          e?.preventDefault();
          setDirectionsResponse(results);
          setDistance(results.routes[0].legs[0].distance.text);
          setDuration(results.routes[0].legs[0].duration.text);
          setOrigen(originRef.current.value);
          setDestino(destiantionRef.current.value);
          setDist("Distancia: " + results.routes[0].legs[0].distance.text);
          setDur("Duración: " + results.routes[0].legs[0].duration.text);
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

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setDist("");
    setDur("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  function calcularContribucion() {
    let precio = 0;
    let dist = 0;
    let total = 0;

    precio = lugaresRef.current.value;
    precio++;
    dist = parseInt(distance);
    setLugares(lugaresRef.current.value);

    total = ((dist / 12) * nafta) / precio;
    Math.floor(precio);
    setPrecio(Math.floor(total));
    setSugerido("Sugerido $" + Math.floor(total));
    return total;
  }

  return (
    <>
      <MapContainer>
        <Modal>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
            <div>
              <h3>¡Publica tu viaje aquí!</h3>
              <br />
              <Autocomplete
                onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input
                  {...register("origin")}
                  placeholder="Selecciona origen"
                  type="text"
                  ref={originRef}
                  style={estilos}
                />
              </Autocomplete>
              <br />
              <Autocomplete
                onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input
                  {...register("destination")}
                  placeholder="Selecciona destino"
                  type="text"
                  ref={destiantionRef}
                  style={estilos}
                />
              </Autocomplete>
              <br />
              <label>
                Fecha del viaje
                <input
                  {...register("tripDate")}
                  type="date"
                  ref={dateRef}
                  min="01-01-2020"
                  style={estilos}
                />
              </label>
              <br />
              <br />
              <Select
                options={vehiculo.map((e, i) => ({
                  label: e.plate,
                  value: e.plate,
                }))}
                onChange={(values) => setPlate(values[0].value)}
                noDataRenderer={() => "No tiene vehículos cargados"}
                placeholder="Selecciona vehÍculo"
                closeonselect
                style={estilos}
              />
              <br />
              <input
                {...register("availablePlaces")}
                type="number"
                min="1"
                max="4"
                id="lugares"
                name="availablePlaces"
                placeholder="Plazas disponibles"
                ref={lugaresRef}
                onChange={calcularContribucion}
                style={estilos}
              />
              <br />
              <br />

              <input
                {...register("price")}
                type="number"
                min="1"
                max="1000"
                id="precio"
                name="price"
                placeholder="Costo estimado"
                style={estilos}
              />
              <span>{sugerido}</span>

              <br></br>
              <br></br>
              <Button
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid black`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                }}
              >
                Crear Viaje
              </Button>
              <br />
              <br />
              <span>{dist}</span>
              <br />
              <br />
              <span>{dur}</span>
            </div>
          </form>
        </Modal>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </MapContainer>
      <ToastContainer position="top-center" />
      <Footer />
    </>
  );
}

export default TravelPreviewer;
