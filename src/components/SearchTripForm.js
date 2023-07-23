import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { registerLocale } from "react-datepicker";
import { BsCurrencyDollar } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";
import "./ListadoDeViajes.css";
import { transformDate, isNumber } from "../Utilities";
import { getToken } from "../service/AuthService";
import configData from "../../configData.json";
import { URLS } from "../../utils/urls";
import es from "date-fns/locale/es";
import moment from "moment";

registerLocale("es", es);

export default function SearchTripForm() {
    const history = useHistory();
    const onError = (errors, e) => console.log(errors, e);
    const originRef = useRef();
    const destiantionRef = useRef();
    const dateRef = useRef();
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: configData.MAPS_KEY,
      libraries: ["places"],
    });

    if (!isLoaded) {
        return <>Cargando...</>;
      }
  
    function formValidate(data) {
      const dateObj = new Date();
      const today = transformDate(dateObj);
      data.tripDate = dateRef.current.value;
      data.destination = destiantionRef.current.value;
      data.origin = originRef.current.value;
      data.tripDate = moment(data.tripDate).format("DD-MM-YYYY");
  
      if (data.tripDate === "" || data.origin === "" || data.destination === "") {
        toast.error("La busqueda debe tener por lo menos origen, destino y fecha");
        return false;
      } else if (!isNumber(data.price) && data.price !== "") {
        toast.error("Precio incorrecto");
      } else if (!isNumber(data.availablePlaces) && data.availablePlaces !== "") {
        toast.error("Asientos incorrectos");
      } else if (!moment(data.tripDate, "DD-MM-YYYY").isValid()) {
        toast.error("Fecha inválida");
      } else if (moment(data.tripDate) < moment(today)) {
        toast.error("La fecha del viaje no puede ser anterior al día actual");
      } else {
        return true;
      }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
        const searchParams = new URLSearchParams(formData).toString();
      
        history.push(`/viajes?${searchParams}`);
      };
      
  
    return (
      <>
        <main>
          <div>
            <form
              className="form-inline"
              onSubmit={handleSubmit()}
            >
              <div className="field1">
                <Autocomplete
                  options={{ componentRestrictions: { country: "uy" } }}
                >
                  <div>
                    <label>ORIGEN: </label>
                    <br />
                    <input
                      {...register("origin")}
                      placeholder="Seleccione un origen"
                      ref={originRef}
                    />
                  </div>
                </Autocomplete>
                <Autocomplete
                  options={{ componentRestrictions: { country: "uy" } }}
                >
                  <div>
                    <label>DESTINO: </label>
                    <br />
                    <input
                      {...register("destination")}
                      placeholder="Seleccione un destino"
                      ref={destiantionRef}
                    />
                  </div>
                </Autocomplete>
                <div>
                  <label>FECHA: </label>
                  <br />
                  <input
                    {...register("tripDate")}
                    type="date"
                    ref={dateRef}
                    min="01-01-2020"
                  />
                </div>
                <div>
                  <label>ASIENTOS: </label>
                  <br />
                  <input
                    {...register("availablePlaces")}
                    placeholder="Lugares disponibles"
                    type="number"
                  />
                </div>
                <div>
                  <label>PRECIO: </label>
                  <br />
                  <input
                    {...register("price")}
                    placeholder="En pesos uruguayos"
                    type="number"
                  />
                </div>
                <button className="btn-submit" type="submit">
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </main>
      </>
    );
  }
  