import React, { useState } from "react";
import "./RegistrarViaje.css";
import { useForm } from "react-hook-form";
import configData from "../../configData.json";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { registerLocale } from "react-datepicker";
import { isNumber, transformDate, LoadingIndicator } from "../Utilities";
import { getUser } from "../service/AuthService";
import { trackPromise } from "react-promise-tracker";
import "react-datepicker/dist/react-datepicker.css";

import es from "date-fns/locale/es";
registerLocale("es", es);

export default function RegistrarViaje() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);

    if (
      data.tripDate === "" ||
      data.source === "" ||
      data.price === "" ||
      data.destination === "" ||
      data.availablePlaces === ""
    ) {
      alert("Debe llenar todos los campos para poder crear el viaje.");
      return false;
    } else if (!isNumber(data.price)) {
      alert("El precio debe ser un número.");
    } else if (!isNumber(data.availablePlaces)) {
      alert("Lugares disponibles debe ser un número.");
    } else if (!moment(data.tripDate).isValid()) {
      alert("Fecha inválida.");
    } else if (moment(data.tripDate) < moment(today)) {
      alert("La fecha del viaje no puede ser anterior al día actual.");
    } else {
      return true;
    }
  }

  async function fetchViajes(data, e) {
    //data.tripDate = transformDate(date);
    data.user = getUser();

    // A MANO POR AHORA    
    data.vehicle = "GAB1234";

    if (formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/trips";

      try {
        trackPromise(await axios.post(viajesGetEndpoint, data));
        redirect();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function redirect2(data, e) {
    history.push("/success");
  }

  return (
    <div className="form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="field1">
          <label> Nuevo Viaje </label>
          <input {...register("origin")} placeholder="Origen" />
          <input {...register("destination")} placeholder="Destino" />
          <input {...register("tripDate")} type="date" format="DD-MM-YYYY" placeholder="Fecha" />
          <input
            {...register("availablePlaces")}
            placeholder="Lugares Disponibles"
          />
          <input
            {...register("price")}
            placeholder="Precio (En Pesos Uruguayos)"
          />
        </div>

        <br />

        <div className="form__field">
          <input type="submit" value="Aceptar" />
        </div>
        <LoadingIndicator />
      </form>
    </div>
  );
}
