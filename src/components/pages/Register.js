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

export default function Register() {

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

    console.log(data.tripDate)
    console.log(moment().diff(data.tripDate, 'years'))

    if(data.email === "" ||
     data.name === "" ||
     data.surname === "" ||
     data.birthDate === "" ||
     data.documentId === "" ||
     data.phoneNumber === "") {
        alert("Debe llenar todos los campos para poder crear el usuario.")
        return false;
    }else if (!moment(data.tripDate).isValid()){
      alert("Fecha inválida.");
      return false;
    }else if (moment().diff(data.tripDate, 'years') <= 18){
      alert("El usuario debe ser mayor de edad.");
      return false;
    }else if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email))) {
      alert("El formato del correo electrónico no es válido.");
      return false;
    }else if (!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi.test(data.phoneNumber))) {
      alert("El formato del teléfono no es válido.");
      return false;
    }else if(!isNumber(data.documentId) || (data.documentId.length > 8) || (data.documentId.length < 8)) {
      alert("La cédula de identidad no es válida.")
      return false;
    }else {
      return true;
    }
  }
  
  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (day + "-" + month + "-" + year);
  }

  async function fetchViajes(data, e) {
    //data.tripDate = transformDate(data.tripDate);

    console.log(data.tripDate)

    // A MANO POR AHORA
    data.user = "user";
    data.vehicle = "GAB1234";

    if(formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/users"
    
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

  const [date, setDate] = useState(new Date());
  const handleChange = date => setDate(date);

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <h1> Registrar usuario </h1>
          <input {...register("name")} placeholder="Nombre"/>
          <input {...register("surname")} placeholder="Apellido"/>
          <input {...register("email")} placeholder="Email"/>
          <div>
            <label> Fecha de nacimiento: </label>
            <input {...register("tripDate")} type="date" format="DD-MM-YYYY" />
          </div>
          <input {...register("documentId")} placeholder="Cédula de identidad sin puntos ni guiones. EJ: (42345678)"/>
          <input {...register("phoneNumber")} placeholder="Número de teléfono. EJ: (+598091123432)"/>
          </div>

          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'> CREAR USUARIO</Button2>
      </form>

    </div>
  );
}