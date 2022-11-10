import { Autocomplete, DirectionsRenderer, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from 'axios';
import Moment from 'moment';
import React, { useRef, useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import configData from '../../configData.json';
import './TravelPreviewer.css';

const MapContainer = styled.div`
  position: relative;
  `;

  const Modal = styled.div`
  position: fixed;
  left: 20%;
  transform: translate(-50%, 20px);
  width: 300px;
  height:500px;
  padding: 40px 80px;
  background-color: gray;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: 999;
  `;
  
const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid black;
  color: black;
  margin: 0 1em;
  padding: 0.25em 1em;
  `;

function TravelPreviewer() {

  const [ libraries ] = useState(['places']);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "50%",
    height: "650px",
    position: 'fixed',
    left: '50%'
  };
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.GPC_MAPS_API,
    libraries
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  
  const [first, setFirst] = useState('');
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();

  const currentDate = new Date()
  const formatDate = Moment().format('DD-MM-YYYY')
  console.log(currentDate)
  console.log(formatDate)

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
  
    return !isNaN(str);
  }

  async function redirect2(data, e) {
    history.push("/success");
  } 

  
  async function fetchViajes(data, e) {
    // A MANO POR AHORA
    data.user = "user";
    data.vehicle = "GAB1234";
    data.origin = origen;
    data.destination = destino;
    data.tripDate = dateRef.current.value;

    console.log(data)

    if(formValidate(data)) {
      
      data.tripDate = Moment(data.tripDate).format('DD-MM-YYYY')
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
      try {
        console.log(data)
        const response = await axios.post(viajesGetEndpoint, data);
        console.log(response)
        redirect();
      } catch(error) {
        console.error(error);
      }
    }
  }
  
  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth();
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (day + "-" + month + "-" + year);
  }

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);

    if(data.tripDate === "" ||
     data.origin === "" ||
     data.price === "" ||
     data.destination === "" ||
     data.availablePlaces === "") {
        alert("Debe llenar todos los campos para poder crear el viaje.")
        return false;
    }else if (!isNumber(data.price)){
      alert("El precio debe ser un número.")
    }else if (!isNumber(data.availablePlaces)){
      alert("Lugares disponibles debe ser un número.")
    }else if (Moment(data.tripDate) < Moment(today)){
        alert("La fecha del viaje no puede ser anterior al día actual.")
    }else if (!Moment(data.tripDate).isValid()){
      alert("Fecha inválida.")

    }else {
      return true;
    }
  }

  if (!isLoaded) {
    return <>loading...</>;
  }

  async function calculateRoute(e) {
    e.preventDefault();
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      e.preventDefault();
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
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <MapContainer>
        <Modal>
        <form onSubmit={handleSubmit(onSubmit, onError)} className = "form-box">
          <div>
          <label>Origen</label>
            <Autocomplete options={{componentRestrictions: { country: "uy" }}}>
              <input {...register("origin")} type="text" ref={originRef} />
            </Autocomplete>
            <label>Destino</label>
            <Autocomplete options={{componentRestrictions: { country: "uy" }}}>
              <input  {...register("destination")} type="text" ref={destiantionRef} />
            </Autocomplete>  

            <Button onClick={calculateRoute} value={first} onChange={event => setFirst(event.target.value)}>Ver Ruta</Button>

          <label>Fecha del Viaje
            <input {...register("tripDate")} type="date" ref={dateRef} min="01-01-2020"/>
          </label>

          <label>Lugares Disponibles
          <input {...register("availablePlaces")} type="number"min="1" max="4" id="lugares" name="availablePlaces"/>
          </label>

          <label>Precio
          <input {...register("price")} type="number"min="1" max="1000" id="precio" name="price"/>
          </label>

            <Button>Crear Viaje</Button>
            <span>Distancia: {distance}</span>
            <span>Duracion: {duration}</span>
          </div>
          </form>
        </Modal>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          options={{
            zoomControl: false,
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
  );
}

export default TravelPreviewer;
