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
import { toast, ToastContainer } from "react-toastify";
import { getToken } from "../service/AuthService";
import { getUser } from "../service/AuthService";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from "../Utilities";
registerLocale("es", es);

export default function RegistrarVehiculo() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  function formValidate(data) {
    if (
      data.manufacturer === "" ||
      data.year === "" ||
      data.model === "" ||
      data.airbag === "" ||
      data.airCond === "" ||
      data.plate === ""
    ) {
      toast.error("Debe llenar todos los campos para poder crear el usuario.");
      return false;
    } else if (data.year > (moment().year())+1) {
      toast.error("El año del auto debe ser como maximo el año siguiente.");
      return false;
    } else if (!isNumber(data.year)) {
      toast.error("El año debe ser un numero");
      return false;
    } else {
      return true;
    }
  }

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

  async function fetchViajes(data, e) {
    if (formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/vehicles";
      console.log(requestConfig)
      console.log(data)

        toast.promise(axios.post(viajesGetEndpoint, data, requestConfig)
        .then((response) => {
          redirect();
        }).catch ((error) => {
          console.error(error);
        })
        ,
        {
          pending: {
            render(){
              return "Cargando"
            },
            icon: true,
          },
          error: {
            render({data}){
              toast.error(data.response.data.message);
            }
          }
        });
      }
  }

  async function redirect2(data, e) {
    history.push("/");
  }

  const handleCheckBoxChange = event => {
    if (event.target.checked) {
      <input value={true} {...register("airCond")} />      
    } else {
      <input value={false} {...register("airCond")} /> 
    }
  };

  const handleCheckBoxChange2 = event => {
    if (event.target.checked) {
      <input value={true} {...register("airbag")} />      
    } else {
      <input value={false} {...register("airbag")} /> 
    }
  };

  return (
    <>
    <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <i className="fab fa-typo3"></i>
            </div>
            <h1> Registrar vehiculo </h1>
            <br />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form">

          <div className="form__field">
            <input type="text" {...register("manufacturer")} placeholder="Fabricante" />
          </div>
          <div className="form__field">
            <input type="text" {...register("model")} placeholder="Modelo" />
          </div>
          <label id="checkBox" className="container">
            Bolsa de Aire
            <input type="checkbox" onChange={() => handleCheckBoxChange2()} 
            {...register("airbag")} />
            <span class="checkmark"></span>
          </label>
          <div className="form__field">
            <input type="text" {...register("year")} placeholder="Año" />
          </div>
          <br />
          <label id="checkBox" className="container">
            Aire Acondicionado
            <input type="checkbox" onChange={() => handleCheckBoxChange()}
            {...register("airCond")} />
            <span class="checkmark"></span>
          </label>
          <div className="form__field">
          <input type="text"
            {...register("plate")}
            placeholder="Placa"
          />
          </div>
          <div className="form__field">
            <input type="submit" value="Aceptar" />
          </div>
        </div>
        </form>
          </div>
        </div>
      </div>
    <ToastContainer position="top-center" />
    </>
  );
}
