import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { render } from "@testing-library/react";
import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useRef, useState } from "react";
import DatePickerComonent, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { toast, ToastContainer } from "react-toastify";
import "../../App.css";
import { Button } from "../../components/Button";
import configData from "../../configData.json";
import "./ListadoDeViajes.css";

import Moment from "moment";
registerLocale("es", es);

export default function ListadoDeViajes() {
  const [viajes, setViajes] = React.useState([]);
  const { register, handleSubmit } = useForm();
  const [date, setDate] = useState(new Date());
  //const [seat, setSeat] = useState(1);
  const handleDateChange = (date) => setDate(date);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const [libraries] = useState(["places"]);

  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();

  const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
      promiseInProgress && (
        <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThreeDots color="#2BAD60" height="100" width="100" />
        </div>
      )
    );
  };

  function isNumber(str) {
    if (str.trim() === "") {
      return false;
    }

    return !isNaN(str);
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
  });

  if (!isLoaded) {
    return <>loading...</>;
  }

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);
    data.tripDate = dateRef.current.value;
    data.destination = destiantionRef.current.value;
    data.origin = originRef.current.value;
    data.tripDate = Moment(data.tripDate).format("DD-MM-YYYY");

    if (data.tripDate === "" || data.origin === "" || data.destination === "") {
      toast.error(
        "La busqueda debe tener por lo menos origen, destino y fecha"
      );
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

  async function fetchViajes(data, e) {
    data.tripDate = transformDate(date);;

    if (formValidate(data)) {
      //const viajesGetEndPoint = configData.AWS_REST_ENDPOINT + "/trips?origin=minas&destination=artigas&tripDate=2022-12-24"

      const viajesGetEndPoint =
        configData.AWS_REST_ENDPOINT +
        "/trips?origin=" +
        data.origin +
        "&destination=" +
        data.destination +
        "&tripDate=" +
        data.tripDate +
        "&price=" +
        data.price +
        "&availablePlaces=" +
        data.availablePlaces;

      console.log(viajesGetEndPoint);

      try {
        const response = await trackPromise(axios.get(viajesGetEndPoint));
        console.log(response.data);
        if (
          response.data.message ===
          "No hay viajes que cumplan con las condiciones seleccionadas."
        ) {
          setViajes();
          alert("No hay viajes que cumplan con las condiciones seleccionadas.");
        } else {
          setViajes(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    if (/^\d$/.test(dateObj.getUTCDate())) {
      day = "0" + dateObj.getUTCDate();
    }
    return day + "-" + month + "-" + year;
  }

  render();
  return (
    <>
      <main>
        <div>
          <form
            className="form-inline"
            onSubmit={handleSubmit(onSubmit, onError)}
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
        <br />
        <br />
        <ol className="gradient-list">
          <LoadingIndicator />
          {viajes &&
            viajes.map((user) => (
              <li>
                <div className="destination">
                  <div>ORIGEN: {user.origin.toUpperCase()}</div>
                  <div>FECHA: {user.tripDate}</div>
                </div>
                <div className="destination">
                  <div>DESTINO: {user.destination.toUpperCase()}</div>
                  <div>{user.arrival_time}</div>
                </div>
                <div className="social-media-wrap">
                  <div className="rating">
                    <MdOutlineAirlineSeatReclineNormal />
                    {user.availablePlaces}
                  </div>
                  <div className="price">
                    {user.price}
                    <BsCurrencyDollar />
                  </div>
                </div>
              </li>
            ))}
        </ol>
      </main>
      <ToastContainer position="top-center" />
    </>
  );
}
