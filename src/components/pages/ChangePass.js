import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import configData from "../../configData.json";
import { Button2 } from "../Button2";
import './Login.css';

export default function ChangePass() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = () => redirect2();
  const history = useHistory();

  function formValidate(data) {
    if (
      data.email === "" ||
      data.password === "" ||
      data.newPassword1 === "" ||
      data.newPassword2 === ""
    ) {
      toast.error("Debe llenar todos los campos");
      return false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email)) {
      toast.error("El formato del correo electrónico no es válido");
      return false;
    } else if (data.newPassword1 !== data.newPassword2) {
      toast.error("Las contraseñas no coinciden");
      return false;
    } else {
      return true;
    }
  }
  
  async function fetchViajes(data, e) {
    // A MANO POR AHORA
    //data.user = "user";
    //data.vehicle = "GAB1234";
    console.log(data);
    
    if (formValidate(data)) {
      const viajesGetEndpoint =
      configData.AWS_REST_ENDPOINT + "/login/new-password";
      
      try {
        const response = await axios.post(viajesGetEndpoint, data);
        console.log(response);
        redirect();
      } catch  (error) {
        console.error(error);
        toast.error("La contraseña no cumple con los requisitos");
      }
    }
  }
  
  async function redirect2(data, e) {
    toast.success("Contraseña modificada correctamente");
    history.push("/login");
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

            <h2>Cambiar la contraseña</h2>
            <br></br>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
              <div className="form">
                <label>Ingrese su email</label>
                <div className="form__field">
                  <input
                    {...register("email")}
                    placeholder="info@mailaddress.com"
                    type="text"
                  />
                </div>

                <label>Contraseña actual</label>
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
                    {...register("newPassword1")}
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>

                <label>Confirme la nueva contraseña</label>
                <div className="form__field">
                  <input
                    {...register("newPassword2")}
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>
              </div>

              <br />

              <Button2
                className="btns"
                buttonStyle="btn--outline"
                buttonSize="btn--large"
              >
                ACEPTAR
              </Button2>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

