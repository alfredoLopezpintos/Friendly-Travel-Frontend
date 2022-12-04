import React from "react";
import "./RegistrarUsuario.css";
import "./RegistrarUsuario.css";
import { useForm } from "react-hook-form";
import configData from "../../configData.json";
import axios from "axios";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { isNumber, transformDate2 } from "../Utilities";
import es from "date-fns/locale/es";
import { getUser } from "../service/AuthService";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from "../Utilities";
import YearPicker from "react-year-picker";
registerLocale("es", es);

export default function RegistrarVehiculo() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  let checkBox = false;
  const history = useHistory();

  const handleCheckBoxChange = event => {
    if (event.target.checked) {
      checkBox = true;
    } else {
      checkBox = false;
    }
  };

  function formValidate(data) {
    if (
      data.email === "" ||
      data.name === "" ||
      data.surname === "" ||
      data.birthDate === "" ||
      data.documentId === "" ||
      data.phoneNumber === ""
    ) {
      alert("Debe llenar todos los campos para poder crear el usuario.");
      return false;
    } else if (!moment(data.birthDate, "DD-MM-YYYY").isValid()) {
      alert("Fecha inválida.");
      return false;
    } else if (moment().diff(data.birthDate, "years") <= 18) {
      alert("El usuario debe ser mayor de edad.");
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email)) {
      alert("El formato del correo electrónico no es válido.");
      return false;
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim.test(
        data.phoneNumber
      )
    ) {
      alert("El formato del teléfono no es válido.");
      return false;
    } else if (
      !isNumber(data.documentId) ||
      data.documentId.length > 8 ||
      data.documentId.length < 8
    ) {
      alert("La cédula de identidad no es válida.");
      return false;
    } else {
      return true;
    }
  }

  async function fetchViajes(data, e) {
    data.birthDate = transformDate2(data.birthDate);
    data.user = getUser();

    // A MANO POR AHORA
    //data.vehicle = "GAB1234";
    if(checkBox) {
      if (formValidate(data)) {
        const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/vehicles";
  
        try {
          await trackPromise(axios.post(viajesGetEndpoint, data));
          redirect();
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      alert("Debe estar de acuerdo con la política de uso de FriendlyTravel" + 
      " para poder registrarse.");
    }
  }

  async function redirect2(data, e) {
    history.push("/success");
  }
  return (
    <div className="form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <h1> Registrar vehiculo </h1>
          <input {...register("manufacturer")} placeholder="Fabricante" />
          <input {...register("model")} placeholder="Modelo" />
          <input {...register("airbag")} placeholder="Bolsa de Aire" />
          <div>
            <label> Año: </label>
            <YearPicker {...register("year")} />
          </div>
          <input
            {...register("airCond")}
            placeholder="Aire Acondicionado"
          />
          <input
            {...register("plate")}
            placeholder="Placa"
          />   
        </div>
        <div className="form__field">
          <input type="submit" value="Aceptar" />
        </div>
        <LoadingIndicator />
      </form>
    </div>
  );
}