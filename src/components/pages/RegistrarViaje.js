import React from 'react';
import './RegistrarViaje.css';
import { useForm } from "react-hook-form";
import configData from '../../configData.json';
import axios from 'axios';

export default function RegistrarViaje() {

  const { register, handleSubmit } = useForm();
  //const onSubmit = (data, e) => console.log(data);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  
  async function fetchViajes(data, e) {
    const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips"
    
    try {
      //const response = await axios.get(viajesGetEndpoint);
      const response = await axios.post(viajesGetEndpoint, data);
      console.log(response)
      //setViajes(response.data);
    } catch(error) {
      console.error(error);
    }
  }

  return (

    <div className = "form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
          <label> Agregar Viaje </label>
          <input {...register("source")} placeholder="Nombre del viaje"/>
          <input {...register("destination")} placeholder="Destino"/>
          <input {...register("tripDate")} placeholder="Fecha"/>
          <input {...register("availablePlaces")} placeholder="Lugares Disponibles"/>
          <input {...register("price")} placeholder="Precio"/>
          </div>

          <button type = "submit" id= "submitBtn" className = "submitBtn"> submit</button>
      </form>

    </div>
  );
}


