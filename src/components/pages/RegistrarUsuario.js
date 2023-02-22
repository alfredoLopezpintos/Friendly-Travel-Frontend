import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React from "react";
// import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import configData from "../../configData.json";
// import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
// import "./RegistrarUsuario.css";
import { registerLocale } from "react-datepicker";
import { transformDate2 } from "../Utilities";
import { getUser } from "../service/AuthService";
registerLocale("es", es);

export default function RegistrarUsuario() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => redirect2(data, e);
  const history = useHistory();
  let checkBox = false;

  function borrarCampos(data) {
    checkBox = false;
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
    } else if (moment().diff(data.birthDate, "years") <= 18) {
      console.log(moment().diff(data.birthDate, "years") <= 18);
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
    } else if (validate_ci(data.documentId)) {
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
    if (checkBox) {
      if (formValidate(data)) {
        const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/users";

        toast.promise(
          axios
            .post(viajesGetEndpoint, data)
            .then((response) => {
              redirect();
            })
            .catch((error) => {
              console.error(error);
            }),
          {
            pending: {
              render() {
                return "Cargando";
              },
              icon: true,
            },
            error: {
              render({ data }) {
                toast.error(data.response.data.message);
              },
            },
          }
        );
      }
    } else {
      toast.error(
        "Debe estar de acuerdo con la política de uso de FriendlyTravel" +
          " para poder registrarse."
      );
    }
  }

  const handleCheckBoxChange = (event) => {
    if (event.target.checked) {
      checkBox = true;
    } else {
      checkBox = false;
    }
  };

  function validation_digit(ci) {
    var a = 0;
    var i = 0;
    if (ci.length <= 6) {
      for (i = ci.length; i < 7; i++) {
        ci = "0" + ci;
      }
    }
    for (i = 0; i < 7; i++) {
      a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
      return 0;
    } else {
      return 10 - (a % 10);
    }
  }

  function clean_ci(ci) {
    return ci.replace(/\D/g, "");
  }

  function validate_ci(ci) {
    console.log(ci);
    ci = clean_ci(ci);
    var dig = ci[ci.length - 1];
    ci = ci.replace(/[0-9]$/, "");
    return dig === validation_digit(ci);
  }

  async function redirect2(data, e) {
    toast.success("Usuario creado correctamente.");
    history.push("/");
    borrarCampos(data);
  }

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <img
                src={require("../../assets/images/logo2.png")}
                alt="travel logo"
                width={200}
              ></img>
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
                <div className="form__field">
                  <label id="checkBox" className="container">
                    Confirmo haber leído y estar de acuerdo con las
                    <a href="/policy"> políticas de uso de FriendlyTravel</a>
                    <input type="checkbox" onChange={handleCheckBoxChange} />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <br />
                <div className="form__field">
                  <input type="submit" value="Aceptar" />
                </div>
                {/*   <Button2
                  className="btns"
                  buttonStyle="btn--outline"
                  buttonSize="btn--large"
                >
                  {" "}
                  CREAR USUARIO
                </Button2> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

{
  /* <div className="form-box">
  <form onSubmit={handleSubmit(onSubmit, onError)}>
    <div>
      <h1> Registrar usuario </h1>
      <input {...register("name")} placeholder="Nombre" />
      <input {...register("surname")} placeholder="Apellido" />
      <input {...register("email")} placeholder="Email" />
      <div>
        <label> Fecha de nacimiento: </label>
        <input {...register("birthDate")} type="date" format="DD-MM-YYYY" />
      </div>
      <input
        {...register("documentId")}
        placeholder="Cédula de identidad sin puntos ni guiones. EJ: (42345678)"
      />
      <input
        {...register("phoneNumber")}
        placeholder="Número de teléfono. EJ: (+59891123432)"
      />
      <br />
      <label id="checkBox" className="container">
        Confirmo haber leído y estar de acuerdo con las
        <a href="/policy"> políticas de uso de FriendlyTravel</a>
        <input type="checkbox" onChange={handleCheckBoxChange} />
        <span class="checkmark"></span>
      </label>      
    </div>
    <div className="form__field">
      <input type="submit" value="Aceptar" />
    </div>
    <LoadingIndicator />
  </form>
</div> */
}
