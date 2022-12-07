import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useState } from "react";
import DatePickerComponent, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import configData from "../../configData.json";
import { Button } from "../Button";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
registerLocale("es", es);

export default function Register() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();

  function isNumber(str) {
    if (str.trim() === "") {
      return false;
    }

    return !isNaN(str);
  }

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
    } else if (moment().diff(data.birthDate, "years") >= 18) {
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

  function transformDate(dateObj) {
    const fecha = moment(dateObj);
    console.log(fecha.format("DD-MM-YYYY"));
    return fecha.format("DD-MM-YYYY");
    //return (day + "-" + month + "-" + year);
  }

  async function fetchViajes(data, e) {
    data.birthDate = transformDate(data.birthDate);

    // A MANO POR AHORA
    //data.user = "user";
    //data.vehicle = "GAB1234";
    console.log(data);

    if (formValidate(data)) {
      const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/users";

        toast.promise(axios.post(viajesGetEndpoint, data)
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
        redirect();
      }
  }

  async function redirect2(data, e) {
    history.push("/login");
    toast.success("Usuario creado correctamente");
  }

  const [date, setDate] = useState(new Date());
  const handleChange = (date) => setDate(date);

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <img src={require("../../assets/images/logo2.png")} alt="travel logo" width={200}></img>
            </div>
            <br />
            <h2> Registrar usuario </h2>
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
                <Button
                  className="btns"
                  buttonStyle="btn--outline"
                  buttonSize="btn--large"
                >
                  {" "}
                  CREAR USUARIO
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
