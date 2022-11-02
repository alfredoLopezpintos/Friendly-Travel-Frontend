/*import React from 'react';
import '../../App.css';

export default function SignUp() {
  return <h1 className='sign-up'>LIKE & SUBSCRIBE</h1>;
}*/

import React, { useState } from "react";
import './RegistrarUsuario.css';
import { useForm } from "react-hook-form";
import configData from '../../configData.json';
import axios from 'axios';
import { Button2 } from '../Button2';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerComponent, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

export default function SignUp() {

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
    data.tripDate = transformDate(date);

    // A MANO POR AHORA
    data.user = "user";
    data.vehicle = "GAB1234";

    console.log(data)

    if(formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
      try {
        const response = await axios.post(viajesGetEndpoint, data);
        console.log(response)
        redirect();
      } catch(error) {
        console.error(error);
        //alert('Error inesperado');
      }
    }
  }

  async function redirect2(data, e) {
    history.push("/success");
  } 

  const [date, setDate] = useState(new Date()); ;
  const handleChange = date => setDate(date);

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <label> Registrar usuario </label>
          <input {...register("email")} placeholder="Email"/>
          <input {...register("name")} placeholder="Nombre"/>
          <input {...register("surname")} placeholder="Apellido"/>
          <DatePickerComponent placeholderText={'Fecha de nacimiento'}
          selected={date} onChange={handleChange} locale="es" />
          <input {...register("documentId")} placeholder="Cédula de identidad"/>
          <input {...register("phoneNumber")} placeholder="Número de teléfono"/>
          </div>

          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'> CREAR VIAJE</Button2>
      </form>

    </div>
  );
}