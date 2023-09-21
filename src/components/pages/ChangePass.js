import axios from "axios";
import React, { useEffect } from "react";
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

export default function ChangePass() {
  const history = useHistory();
  const location = useLocation();
  const receivedData = (location.state?.data) ? location.state?.data : undefined;
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      email: ((receivedData !== undefined) ? receivedData : "")
    }
  });
  const onSubmit = (data, e) => fetchNewPass(data, e);
  const onError = (errors, e) => console.log(errors, e);

  function formValidate(data) {
    if (
      data.email === "" ||
      data.password === "" ||
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
    if (formValidate(data)) {
      const viajesGetEndpoint = (receivedData !== undefined) ? URLS.POST_CHANGE_PASS_FIRST_TIME : 
      URLS.POST_CHANGE_PASS;
      console.log(viajesGetEndpoint);
      console.log(receivedData);
      console.log(data);
      
      const response = 
      toast.promise(axios.post(viajesGetEndpoint, data)
      .then((response) => {
        console.log(viajesGetEndpoint);
        redirect();
      }).catch((error) => {
        console.error(error);
        toast.error("La contraseña no cumple con los requisitos"); // FALTAN MENSAJES DE ERROR ACORDE A LA SITUACION
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

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
          <div className="big_logo">
              <img src={require("../../assets/images/logo2.png")} alt="travel logo" width={200}></img>
            </div>
            <br />

            <h2>Cambiar la contraseña</h2>
            <br></br>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
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
                    {...register("password")}
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

