import React, { useState } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { Button2 } from '../Button2';
import { useHistory } from "react-router-dom";
import DatePickerComponent, { registerLocale } from "react-datepicker";
import configData from '../../configData.json';
import './RegistrarUsuario.css';
import 'react-datepicker/dist/react-datepicker.css';
import es from "date-fns/locale/es";

registerLocale("es", es);

export default function RegistrarUsuario() {

  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchUsuario(data, e);
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

    if(data.birthDate === "" ||
     data.name === "" ||
     data.surname === "" ||
     data.documentId === "" ||
     data.email === "" ||
     data.phoneNumber === ""
     ) {
        alert("Debe llenar todos los campos para poder crear el usuario.")
        return false;
    }else {
      return true;
    }
  }
  
  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth();
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (year + "-" + month + "-" + day);
  }

  async function fetchUsuario(data, e) {
    data.birthDate = transformDate(date);

    console.log(data)

    if(formValidate(data)) {
      const usuariosGetEndpoint = configData.AWS_REST_ENDPOINT + "/users"
    
      try {
        //const response = await axios.get(viajesGetEndpoint);
        const response = await axios.post(usuariosGetEndpoint, data);
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

  const [date, setDate] = useState(new Date()); ;
  const handleChange = date => setDate(date);

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <label> Nuevo Usuario </label>
          <input {...register("email")} placeholder="Email"/>
          <input {...register("name")} placeholder="Nombre"/>
          <input {...register("surname")} placeholder="Apellido"/>
          <DatePickerComponent placeholderText={'Fecha de nacimiento'}
          selected={date} onChange={handleChange} locale="es" />
          <input {...register("documentId")} placeholder="Documento"/>
          <input {...register("phoneNumber")} placeholder="Telefono"/>
          </div>
          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'>CREAR CUENTA</Button2>

      </form>
    </div>
  );
}


