import React from 'react';
import './RegistrarViaje.css';
import { useForm } from "react-hook-form";
import configData from '../../configData.json';
import axios from 'axios';
import { Button2 } from '../Button2';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

export default function RegistrarViaje() {

  const { register, handleSubmit } = useForm();
  //const onSubmit = (data, e) => console.log(data);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();
  
  async function fetchViajes(data, e) {
    const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
    try {
      //const response = await axios.get(viajesGetEndpoint);
      const response = await axios.post(viajesGetEndpoint, data);
      console.log(response)
      redirect();
      //setViajes(response.data);
    } catch(error) {
      console.error(error);
    }
  }

  async function redirect2(data, e) {
    history.push("/success");
  }

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <label> Agregar Viaje </label>
          <input {...register("source")} placeholder="Origen"/>
          <input {...register("destination")} placeholder="Destino"/>
          <input {...register("tripDate")} placeholder="Fecha"/>
          <input {...register("availablePlaces")} placeholder="Lugares Disponibles"/>
          <input {...register("price")} placeholder="Precio"/>
          </div>

          <br />

          <Button2 className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'> CREAR VIAJE</Button2>
      </form>

    </div>
  );
}


