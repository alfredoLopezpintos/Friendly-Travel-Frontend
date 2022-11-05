import React, { useState } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { Button2 } from '../Button2';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import configData from '../../configData.json';
import './Login.css';
import 'react-datepicker/dist/react-datepicker.css';

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
    const today = transformDate(dateObj);

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
  
  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (year + "-" + month + "-" + day);
  }

  async function fetchViajes(data, e) {

    if(formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/users"
    
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
          <label> Login </label>
          <input {...register("usuario")} placeholder="Usuario"/>
          <input {...register("contraseña")} placeholder="Contraseña"/>
          </div>
          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'>Iniciar Sesión</Button2>
      </form>

    </div>
  );
}


