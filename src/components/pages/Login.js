import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../service/AuthService";
import { useHistory, Link, Redirect } from "react-router-dom";
import "./Login.css";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { URLS } from "../../utils/urls";
import ModalChangePass from '../../components/ModalChangePass';
import { TextField } from '@rodrisu/friendly-ui/build/textField'
import { Button } from '@rodrisu/friendly-ui/build/button';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();
  const expectedResponse = "NEW_PASSWORD_REQUIRED";
  const [endpointResponse, setEndpointResponse] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Usuario y/o contraseña no pueden estar vacíos");
      return;
    }

    setErrorMessage(null);
    const requestBody = {
      email: email,
      password: password,
    };

    toast.promise(
      axios
        .post(URLS.LOGIN_URL, requestBody)
        .then((response) => {
          if (response.data.message === expectedResponse) {
            setEndpointResponse(response.data); // Set endpointResponse to the entire response.data object
            setShouldRedirect(true); // Set shouldRedirect to true
          } else {
            setUserSession(
              jwt_decode(response.data.object.idToken).email,
              response.data.object.idToken,
              response.data.object.avatarUrl
            );
            history.push("/");
            toast.success("Bienvenido", {
              autoClose: 1000,
              onClose: () => {
                window.location.reload(false);
              },
            });
          }
        })
        .catch((error) => {
          if (
            error.response.status === 401 ||
            error.response.status === 403
          ) {
            setErrorMessage(error.response.data.message);
          } else if (error.response.status === 400) {
            toast.error("Usuario y/o contraseña incorrectos");
          } else {
            toast.error(
              "Lo sentimos, el servidor parece encontrarse en mantenimiento. Por favor intentelo de nuevo más tarde"
            );
          }
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
            return toast.error("Error");
          },
        },
      }
    );
  };

  function handleEmailChange(event) {
    setEmail(event.value);
    // setEmail(event.target.value);
    // if (!event.target.validity.valid) {
    //   setErrorMessage("Por favor ingrese un email válido");
    // } else {
    //   setErrorMessage("Error");
    // }
  }

  function handlePassChange(event) {
    setPassword(event.value);
  }

  return (
    <>
      <div>
        <form onSubmit={submitHandler}>
          <div style={{ "padding-top": "50px" }} className="grid align__item">
            <div className="register formNew">
              <h2 style={{ "text-align": "left", "padding-bottom": "50px", "color": "#004346" }} className="">Iniciar sesión</h2>
              <p style={{ "text-align": "left", "color": "#004346" }}>Correo electrónico</p>
              <TextField type="email" className="textField" name="email" placeholder="Escribe aquí tu correo electrónico" onChange={(data) => handleEmailChange(data)} />
              <br />
              <p style={{ "text-align": "left", "color": "#004346" }}>Contraseña</p>
              <TextField type="password" className="textField" name="firstInputSecondRow" placeholder="Escribe aquí tu contraseña" onChange={(data) => handlePassChange(data)} />
              <ModalChangePass />
              <br />
              <Button type="submit" className="submitBtn"> Aceptar </Button>
              <br />
              <br />
              <span style={{ "color": "#777E90" }}>
                ¿Aún no tienes cuenta? <Link className="registerLink" to="/register">Regístrate</Link>
              </span>
              <br />
              <br />
            </div>
          </div>
        </form>
      </div>
      {(shouldRedirect) ? (history.push('/changePass', { data: email })) : (<></>)
        //  && (
        //   <Redirect
        //     to={{
        //       pathname: "/changePass",
        //       state: { endpointResponse },
        //     }}
        //   />
        // )
      }
    </>
  );
};

export default Login;
