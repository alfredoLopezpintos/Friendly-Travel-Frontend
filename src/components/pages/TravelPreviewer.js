import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import './Login.css';
import axios from "axios";
import Moment from "moment";
import React, { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import configData from "../../configData.json";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../service/AuthService";

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
  background: rgb(199,236,255);
  background: linear-gradient(126deg, rgba(199,236,255,1) 0%, rgba(232,232,232,1) 57%, rgba(255,239,205,1) 100%);
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

function TravelPreviewer() {
  const [libraries] = useState(["places"]);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: "fixed",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyByxrtMSshoEaBd7YBhp87zfGF3ih5fSPE',
    libraries,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

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

  async function fetchViajes(data, e) {
    e?.preventDefault();
    // A MANO POR AHORA
    data.vehicle = "GAB1234";
    data.origin = origen;
    data.destination = destino;
    data.tripDate = dateRef.current.value;
    data.availablePlaces = lugaresRef.current.value;
    if (formValidate(data)) {
      data.tripDate = Moment(data.tripDate).format("DD-MM-YYYY");
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips";
      try {
        await axios.post(viajesGetEndpoint, data, {
          headers: {
            Authorization: JSON.parse(getToken()),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        clearRoute();
        redirect();
      } catch  (error) {
        console.error(error);
        toast.error("No se pudo crear el viaje");
      }
    }
  }

  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth();
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return day + "-" + month + "-" + year;
  }

  function formValidate(data, e) {
    e?.preventDefault();
    const dateObj = new Date();
    const today = transformDate(dateObj);

    if (
      data.tripDate === "" ||
      data.origin === "" ||
      data.price === "" ||
      data.destination === "" ||
      data.availablePlaces === ""
    ) {
      toast.error("Debe llenar todos los campos");
      return false;
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

  async function calculateRoute() {
 
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    setOrigen(originRef.current.value);
    setDestino(destiantionRef.current.value);
    setDist("Distancia: " + results.routes[0].legs[0].distance.text);
    setDur("Duración: " + results.routes[0].legs[0].duration.text);
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

  function CalcularContribucion() {
    let precio = 0
    let dist = 0
    let total = 0

    precio = lugaresRef.current.value
    precio++
    dist = parseInt(distance)
    setLugares(lugaresRef.current.value)

    total = (((dist/12))*nafta)/precio
    Math.floor(precio);
    setPrecio(Math.floor(total))
    setSugerido("Sugerido $" + Math.floor(total))
    return total
    };

  return (
    <>
      <MapContainer>
        <Modal>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
            <div>
              <h3>¡Publica tu viaje aquí!</h3>
              <br/>
              <label>Origen</label>
              <Autocomplete
              onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input {...register("origin")} type="text" ref={originRef} />
              </Autocomplete>
              <br/>
              <label>Destino</label>
              <br/>
              <Autocomplete
              onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input
                  {...register("destination")}
                  type="text"
                  ref={destiantionRef}
                />
              </Autocomplete>
              <br/>
              <label>
                Fecha del viaje
                <input
                  {...register("tripDate")}
                  type="date"
                  ref={dateRef}
                  min="01-01-2020"
                />
              </label>
              <br/>
              <br/>
              <label>Lugares disponibles</label>

              <input
                {...register("availablePlaces")}
                type="number"
                min="1"
                max="4"
                id="lugares"
                name="availablePlaces"
                placeholder="¿Cuántos lugares tienes?"
                ref={lugaresRef}
                onChange={CalcularContribucion}
              />
              <br/>
              <br/>
              <label>Precio</label>
              <br></br>

              <input
                {...register("price")}
                type="number"
                min="1"
                max="1000"
                id="precio"
                name="price"
                placeholder="Contribución estimada"
              />
              <span>{sugerido}</span>

              <br></br>
              <br></br>
              <Button>Crear Viaje</Button>
              <br/><br/>
              <span>{dist}</span>
              <br/><br/>
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