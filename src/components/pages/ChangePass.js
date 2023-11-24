import axios from "axios";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import configData from "../../configData.json";
import './Login.css';
import {
  isValidEmail
} from "../../utils/ValidationFunctions";
import { URLS } from "../../utils/urls";
import { useLocation } from 'react-router-dom';
import { TextField } from '@rodrisu/friendly-ui/build/textField'
import { Button } from '@rodrisu/friendly-ui/build/button';
import { DataArray } from "@mui/icons-material";

export default function ChangePass() {
  const history = useHistory();
  const location = useLocation();
  const receivedData = (location.state?.data) ? location.state?.data : undefined;
  // const { register, handleSubmit, setValue } = useForm({
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      email: ((receivedData !== undefined) ? receivedData : "")
    }
  });
  const onSubmit = (data, e) => fetchNewPass(
    ((receivedData !== undefined) ? { email: email, password: code, newPassword1: password, newPassword2: passwordAgain} : 
      {email: email, code: code, newPassword1: password, newPassword2: passwordAgain})
  , e);
  const onError = (errors, e) => console.log(errors, e);
  // const changePassFirstTime = (receivedData !== undefined) ? register("password") : register("code")
  const changePassFirstTime = (data) => (receivedData !== undefined) ? data.password : data.code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [code, setCode] = useState("");

  function formValidate(data) {
    if (
      data.email === "" ||
      ((changePassFirstTime(data)) === "") ||
      data.newPassword1 === "" ||
      data.newPassword2 === ""
    ) {
      toast.error("Debe llenar todos los campos");
      return false;
      // } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email)) {
    } else if (!isValidEmail(data.email)) {
      toast.error("El formato del correo electrónico no es válido");
      return false;
    } else if (data.newPassword1 !== data.newPassword2) {
      toast.error("Las contraseñas no coinciden");
      return false;
    } else {
      return true;
    }
  }

  async function fetchNewPass(data, e) {
    const dataToSend = (receivedData !== undefined) ? {email: data.email, password: changePassFirstTime(data), newPassword: data.newPassword1} : {email: data.email, code: changePassFirstTime(data), newPassword: data.newPassword1}
    if (formValidate(data)) {
      const changePassPostEndpoint = (receivedData !== undefined) ? URLS.POST_CHANGE_PASS_FIRST_TIME :
        URLS.POST_CHANGE_PASS;

      const response =
        toast.promise(axios.post(changePassPostEndpoint, dataToSend)
          .then(() => {
            redirect();
          }).catch((error) => {
            console.error(error);
            toast.error(error.response.data.message); // FALTAN MENSAJES DE ERROR ACORDE A LA SITUACION
          })
          ,
          {
            pending: {
              render() {
                return "Cargando"
              },
              icon: true,
            },
            error: {
              render({ data }) {
                return toast.error('Error')
              }
            }
          }
        );
    }
  }

  async function redirect(data, e) {
    toast.success("Contraseña modificada correctamente");
    history.push("/login");
  }


  function handleEmailChange(event) {
    setEmail(event.value);
  }

  function handlePassChange(event) {
    setPassword(event.value);
  }

  function handleCodeChange(event) {
    setCode(event.value);
  }
  
  function handlePassChangeAgain(event) {
    setPasswordAgain(event.value);
  }


  return (
    <>
      <div>
        <div style={{ "padding-top": "50px" }} className="grid align__item">
          <div className="register formNew">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
              <br />
              <h2 style={{ "text-align": "left", "padding-bottom": "25px", "color": "#172A3A" }} className="">Cambiar la contraseña</h2>
              <br />
              <p style={{ "text-align": "left", "color": "#172A3A" }}>Correo electrónico</p>
              <TextField type="email" className="textField" name="email" placeholder="Escribe aquí tu correo electrónico" onChange={(data) => handleEmailChange(data)} />
              <br />
              <p style={{ "text-align": "left", "color": "#172A3A" }}>Código recibido por correo</p>
              <TextField type="text" className="textField" name="code" placeholder="Escribe aquí tu código" onChange={(data) => handleCodeChange(data)} />
              <br />
              <p style={{ "text-align": "left", "color": "#172A3A" }}>Nueva contraseña</p>
              <TextField type="password" className="textField" name="newPassword" placeholder="Escribe aquí tu nueva contraseña" onChange={(data) => handlePassChange(data)} />
              <br />
              <p style={{ "text-align": "left", "color": "#172A3A" }}>Confirme la nueva contraseña</p>
              <TextField type="password" className="textField" name="newPasswordAgain" placeholder="Escribe de nuevo tu nueva contraseña" onChange={(data) => handlePassChangeAgain(data)} />
              <br />
              <Button type="submit" className="submitBtn"> Aceptar </Button>
              {/* <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
              <div className="form">
                <label>Ingrese su email</label>
                <div className="form__field">
                  <input
                    {...register("email")}
                    placeholder="info@mailaddress.com"
                    type="email"
                  />
                </div>

                <label>Código recibido por correo</label>
                <div className="form__field">
                  <input
                    {...changePassFirstTime}
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>

                <label>Nueva contraseña</label>
                <div className="form__field">
                  <input
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>

                <label>Confirme la nueva contraseña</label>
                <div className="form__field">
                  <input
                    {...register("newPassword")}
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>
              </div>
              <br />
              <div className="form__field">
                <input type="submit" value="Aceptar" />
              </div>
              {/*               <Button2
                className="btns"
                buttonStyle="btn--outline"
                buttonSize="btn--large"
              >
                ACEPTAR
              </Button2> */}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

