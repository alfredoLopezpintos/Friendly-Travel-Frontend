import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import configData from "../../configData.json";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "./RegistrarUsuario.css";
import { registerLocale } from "react-datepicker";
import { isNumber, transformDate2 } from "../Utilities";
import { getUser } from "../service/AuthService";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from "../Utilities"
registerLocale("es", es);;

export default function Register() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();
  let checkBox = false;

  function formValidate(data) {
    if (
      data.email === "" ||
      data.name === "" ||
      data.surname === "" ||
      data.birthDate === "" ||
      data.documentId === "" ||
      data.phoneNumber === ""
    ) {
      toast.error("Debe completar todos los campos");
      return false;
    } else if (!moment(data.birthDate, "DD-MM-YYYY").isValid()) {
      toast.error("Fecha inválida");
      return false;
    } else if (moment().diff(data.birthDate, "years") <= 18) {
      toast.error("El usuario debe ser mayor de edad");
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email)) {
      toast.error("El formato del correo electrónico no es válido");
      return false;
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim.test(
        data.phoneNumber
      )
    ) {
      toast.error("El formato del teléfono no es válido");
      return false;
    } else if (
      !isNumber(data.documentId) ||
      data.documentId.length > 8 ||
      data.documentId.length < 8
    ) {
      toast.error("La cédula de identidad no es válida");
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
    console.log(data);
    if(checkBox) {
      if (formValidate(data)) {
        const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/users";

        try {
          const response = trackPromise(await axios.post(viajesGetEndpoint, data));
          console.log(response);
          redirect();
        } catch (error) {
          console.error(error);
          toast.error("No se pudo crear el usuario");
        }
      }
    } else {
      toast.error("Debe estar de acuerdo con la política de uso de FriendlyTravel" + 
      " para poder registrarse.");
    }
  }

  const handleCheckBoxChange = event => {
    if (event.target.checked) {
      checkBox = true;
    } else {
      checkBox = false;
    }
  };

  async function redirect2(data, e) {
    history.push("/login");
    toast.success("Usuario creado correctamente");
  }

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <i className="fab fa-typo3"></i>
            </div>
            <br />
            <h2> Registrar usuario </h2>
            <br />
            <br />
            <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
              <div>
                <label>Nombre</label>
                <div className="form__field">
                  <input
                    {...register("name")}
                    placeholder="Ingrese su nombre"
                    type="text"
                  />
                </div>

                <label>Apellido</label>
                <div className="form__field">
                  <input
                    {...register("surname")}
                    placeholder="Ingrese su apellido"
                    type="text"
                  />
                </div>

                <label>Email</label>
                <div className="form__field">
                  <input
                    {...register("email")}
                    placeholder="Ingrese su email"
                    type="email"
                  />
                </div>

                <label>Fecha de nacimiento</label>
                <div className="form__field">
                  <input
                    {...register("birthDate")}
                    type="date"
                    format="DD-MM-YYYY"
                  />
                </div>

                <label>Cédula de identidad</label>
                <div className="form__field">
                  <input
                    {...register("documentId")}
                    placeholder="Sin puntos ni guiones, ej. 43215678"
                    type="number"
                  />
                </div>

                <label>Teléfono de contacto</label>
                <div className="form__field">
                  <input
                    {...register("phoneNumber")}
                    placeholder="Número de teléfono, ej. 59899111333"
                    type="number"
                  />
                </div>
                <br />
                <label id="checkBox" className="container">
                  Confirmo haber leído y estar de acuerdo con las
                  <a href="/policy"> políticas de uso de FriendlyTravel</a>
                  <input type="checkbox" onChange={handleCheckBoxChange} />
                  <span class="checkmark"></span>
                </label>
                <div className="form__field">
                  <input type="submit" value="Aceptar" />
                </div>
                <LoadingIndicator />
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
