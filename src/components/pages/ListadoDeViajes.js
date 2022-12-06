import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { render } from "@testing-library/react";
import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useRef, useState } from "react";
import DatePickerComponent, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "../../App.css";
import { transformDate, isNumber } from "../Utilities"
import configData from "../../configData.json";
import "./ListadoDeViajes.css";
import Moment from "moment";
import { getToken } from "../service/AuthService";

registerLocale("es", es);

export default function ListadoDeViajes() {
  const [viajes, setViajes] = React.useState([]);
  const { register, handleSubmit } = useForm();
  const [date, setDate] = useState(new Date());
  const handleContacto = (data) => fetchContacto(data);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const [libraries] = useState(["places"]);
  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyByxrtMSshoEaBd7YBhp87zfGF3ih5fSPE',
    libraries,
  });
  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

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

  async function fetchContacto(data) {
    const viajesGetEndPoint =
        configData.AWS_REST_ENDPOINT +
        "/trips/" + data;
    console.log(viajesGetEndPoint, requestConfig)
    try {
      const response = await axios.get(viajesGetEndPoint, requestConfig);
      console.log(response.data);
      window.location.replace("https://wa.me/"+ response.data.phoneNumber +"?text=Me%20gustaía%20unirme%20a%20tu%20viaje");
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchViajes(data, e) {
    data.tripDate = transformDate(date);;

    if (formValidate(data)) {
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
      try {
        const response = await axios.get(viajesGetEndPoint)
        if (
          response.data.message ===
          "No hay viajes que cumplan con las condiciones seleccionadas."
          ) {
          setViajes();
          toast.error("No hay viajes que cumplan con las condiciones seleccionadas.");
        } else {
          setViajes(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
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
          {viajes &&
            viajes.map((user) => (
              <li>
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
                <div className="destination">
                  <div>ORIGEN: {user.origin.toUpperCase()}</div>
                  <div>FECHA: {user.tripDate}</div>
                </div>
                <div className="destination">
                  <div>DESTINO: {user.destination.toUpperCase()}</div>
                  <div>{user.arrival_time}</div>
                </div>
                {getToken() !== null ? (
                  <div className="contacto">
                    <a onClick={() => handleContacto(user.tripId)}>
                      <IoLogoWhatsapp />
                    </a>
                  </div>
                ):(<br />)}
                
              </li>
            ))}
        </ol>
      </main>
      <ToastContainer position="top-center" />
    </>
  );
}
