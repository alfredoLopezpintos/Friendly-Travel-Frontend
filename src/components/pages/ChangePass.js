import React from "react";
import "./RegistrarUsuario.css";
import { useForm } from "react-hook-form";
import configData from "../../configData.json";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function ChangePass() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = () => redirect2();
  const history = useHistory();

  function formValidate(data) {
    if (data.email === "" || data.password === "" || data.newPassword === "") {
      alert("Debe llenar todos los campos para poder crear el usuario.");
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email)) {
      alert("El formato del correo electrónico no es válido.");
      return false;
    } else {
      return true;
    }
  }

  async function fetchViajes(data, e) {
    if (formValidate(data)) {
      const viajesGetEndpoint =
        configData.AWS_REST_ENDPOINT + "/login/new-password";

      try {
        const response = await axios.post(viajesGetEndpoint, data);
        redirect();
      } catch (error) {
        console.error(error);
        //alert('Error inesperado');
      }
    }
  }

  async function redirect2() {
    history.push("/login");
  }

  return (
    <div className="form-box">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <h1> Para continuar debe cambiar su contraseña </h1>
          <input {...register("email")} placeholder="Email" />
          <label> Contraseña Actual: </label>
          <input
            {...register("password")}
            placeholder="••••••••••••"
            type="password"
          />
          <label> Nueva contraseña: </label>
          <input
            {...register("newPassword")}
            placeholder="••••••••••••"
            type="password"
          />
        </div>

        <br />

        <div className="form__field">
          <input type="submit" value="Aceptar" />
        </div>
      </form>
    </div>
  );
}
