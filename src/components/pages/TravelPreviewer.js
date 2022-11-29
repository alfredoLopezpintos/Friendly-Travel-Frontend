import { Autocomplete, DirectionsRenderer, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from 'axios';
import Moment from 'moment';
import React, { useRef, useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import configData from '../../configData.json';
import Footer2 from '../Footer2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const nafta = configData.PRECIO_NAFTA;


const MapContainer = styled.div`
  position: relative;
  `;

  const Modal = styled.div`
  position: fixed;
  left: 12%;
  transform: translate(-40%, 20px);
  width: 400px;
  height:650px;
  padding: 40px 80px;
  background-color: white;
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
  padding: 0.25em 1em;

  &:hover {
    background-color: gray;
    color: white;
  }
  `;

  
function TravelPreviewer() {

  const [ libraries ] = useState(['places']);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: 'fixed',

  };
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");  console.log(nafta) 

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
    history.push("/");
    toast.success("Viaje creado correctamente!")
  } 

  const your_token = "eyJraWQiOiJabmpSSllzQ0FyZ0dMRXlWcU1ZdkwwTGdMRjU4NjNwZUtxSlJ4dVhGUGtVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIwZjA3ZjYxYi1iOWYwLTRmMGMtODA4Zi02OTIxMjk2MDlmZmQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfSTExRkNDRjhIIiwiY29nbml0bzp1c2VybmFtZSI6IjBmMDdmNjFiLWI5ZjAtNGYwYy04MDhmLTY5MjEyOTYwOWZmZCIsIm9yaWdpbl9qdGkiOiI5ZmFkMjM0NC0zMzJiLTQ1MjUtYTVjOS03NTk1ZmZiZTFiZWIiLCJhdWQiOiI3OGd1N29pdmgzcnZmZnRlbW5pM2g4YnFwIiwiZXZlbnRfaWQiOiJhZDJiZjU5Ny00M2UwLTQzNTYtOGFjZi1jMzZlNzM0YWQwNGIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY2OTU4NjU3OSwiZXhwIjoxNjY5NTkwMTc5LCJpYXQiOjE2Njk1ODY1NzksImp0aSI6ImFkMzhkMjA0LWQ5Y2YtNDUxZC1iNTA4LTI4N2I1ZDgxYTBjYyIsImVtYWlsIjoiZGllZ28ucm9zYWxlc0Blc3R1ZGlhbnRlcy51dGVjLmVkdS51eSJ9.a2pFuZVewWAyzETXYlcC5NiViEwyqlqNx0sN1f9q0jX21u6mlW6g1wnx1dvRO2SUe3NTcSo38-luYOD_iGQwruastTrXTblThW5D25fT-_GxVb6Okz2tVzlyTezK1lI3XyWgEHlmvTQQQTo_s6L1jA-CaRLx-Q9SMS07XRbHNzSU_G7zyH9x_hLetKxQpfoCU_3f2M7C2OhL3WG1k5zz5aBJbbAKiJ9I9fZBrU1Q_yqmU5WFSqBoWWh3lm0bxfOPIVXaaLGFvPSl1o7DETHE02dmIUTX3dQ3q8SKWl_tGYiJD-uH0F6NfsGanDz0xz3sFxsNaTpFazq9aZzSlRknfg"; //aca va el token cuando se tenga


  async function fetchViajes(data, e) {
    // A MANO POR AHORA
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
        console.log(your_token)
        const response = await axios.post(viajesGetEndpoint, data, {
          headers: {
              'Authorization': your_token,
              'Accept' : 'application/json',
              'Content-Type': 'application/json'
          }
      });
        console.log(response)
        clearRoute()
        redirect();
      } catch(error) {
        console.error(error);
        toast.error('No se pudo crear el viaje', { });
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
        toast.error("Debe llenar todos los campos")
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
    <>
    <MapContainer>
        <Modal>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
          <div>
          <h3>¡Publica tu viaje aquí!</h3>
          <br></br>
          <label>Origen</label>
            <Autocomplete options={{componentRestrictions: { country: "uy" }}}>
              <input {...register("origin")} type="text" ref={originRef} />
            </Autocomplete>
            <label>Destino</label>
            <br></br>
            <Autocomplete options={{componentRestrictions: { country: "uy" }}}>
              <input  {...register("destination")} type="text" ref={destiantionRef} />
            </Autocomplete>  
            <br></br>
            <Button onClick={calculateRoute} value={first} onChange={event => setFirst(event.target.value)}>Ver Ruta</Button>
        <br></br><br></br>
          <label>Fecha del Viaje
            <input {...register("tripDate")} type="date" ref={dateRef} min="01-01-2020"/>
          </label>
          <br></br><br></br>
          <label>Lugares Disponibles</label>
          <br></br>
          <input {...register("availablePlaces")} type="number"min="1" max="4" id="lugares" name="availablePlaces"/>
          
          <br></br>
          <label>Precio</label>
          <br></br>
          
          <input {...register("price")} type="number"min="1" max="1000" id="precio" name="price" /><span>sugerido: {nafta}</span>
         
          <br></br><br></br>
            <Button >Crear Viaje</Button>
            <br></br><br></br>
            <span>Distancia: {distance}</span>
            <br></br>
            <span>Duracion: {duration}</span>
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
    <ToastContainer position="top-center"/>
    <Footer2 />
    </>
  );
}

export default TravelPreviewer;
