import React from 'react';
import './RegistrarViaje.css';
import { useForm } from "react-hook-form";
import configData from '../../configData.json';
import axios from 'axios';
import { Button2 } from '../Button2';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import moment from 'moment';

export default function RegistrarViaje() {

  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();
  
  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
  
    return !isNaN(str);
  }

  function formValidate(data) {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const today = year + "-" + month + "-" + day;

    if(data.tripDate === "" ||
     data.source === "" ||
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

  async function fetchViajes(data, e) {

    if(formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
      try {
        //const response = await axios.get(viajesGetEndpoint);
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

  async function redirect2(data, e) {
    history.push("/success");
  }

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <label> Nuevo Viaje </label>
          <input {...register("source")} placeholder="Origen"/>
          <input {...register("destination")} placeholder="Destino"/>
          <input {...register("tripDate")} placeholder="Fecha"/>
          <input {...register("availablePlaces")} placeholder="Lugares Disponibles"/>
          <input {...register("price")} placeholder="Precio (En Pesos Uruguayos)"/>
          </div>

          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'> CREAR VIAJE</Button2>
      </form>

    </div>
  );
}


