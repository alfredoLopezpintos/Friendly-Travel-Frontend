import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import moment from 'moment';
import configData from '../../configData.json';
import { useHistory } from "react-router-dom";
import DatePickerComponent, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import es from "date-fns/locale/es";

import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import styled from "styled-components";
import axios from 'axios';
registerLocale("es", es);

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
    googleMapsApiKey: 'AIzaSyDPAJQ9rD8Qjsz1mzrVF5i0nT_XhhC-F3w',
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
  const [date, setDate] = useState(new Date()); ;
  const handleChange = date => setDate(date);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  const originRef = useRef();
  const destiantionRef = useRef();

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
    data.tripDate = transformDate(date);

    // A MANO POR AHORA
    data.user = "user";
    data.vehicle = "GAB1234";
    data.origin = origen;
    data.destination = destino;

    console.log(data)

    if(formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
      try {
        //const response = await axios.get(viajesGetEndpoint);
        console.log(data)
        const response = await axios.post(viajesGetEndpoint, data);
        console.log(response)
        redirect();
        //setViajes(response.data);
      } catch(error) {
        console.error(error);
        //alert('Error inesperado');
      }
    }
  }

  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (year + "-" + month + "-" + day);
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
    }else if (!moment(data.tripDate).isValid()){
      //console.log(moment(data.tripDate))
      alert("Fecha inválida.")
    }else if (moment(data.tripDate) < moment(today)){
      alert("La fecha del viaje no puede ser anterior al día actual.")
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
          <form onSubmit={handleSubmit(onSubmit, onError)}>
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
            <Button onClick={clearRoute}>Borrar Campos</Button>

          <label>Fecha del Viaje
          <DatePickerComponent placeholderText={'Fecha'} selected={date} onChange={handleChange} locale="es" />
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
