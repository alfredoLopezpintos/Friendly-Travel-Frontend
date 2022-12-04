import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../service/AuthService";
import configData from "../../configData.json";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Login.css";
import jwt_decode from "jwt-decode";
import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import configData from "../../configData.json";
import { setUserSession } from "../service/AuthService";
import "./Login.css";
const loginAPIUrl = configData.AWS_REST_ENDPOINT + "/login";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
      promiseInProgress && (
        <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThreeDots color="#2BAD60" height="100" width="100" />
        </div>
      )
    );
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Usuario y/o contraseña no pueden estar vacíos");
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        Authorization: "OkhIJdHFMomDeRVUXGfa1EXWiGBAWpdakg7ZRCFf",
      },
    };
    const requestBody = {
      email: email,
      password: password,
    };

    //console.log(axios.post(loginAPIUrl, requestBody))

    trackPromise(
      axios
        .post(loginAPIUrl, requestBody)
        .then((response) => {
          //console.log(response.data)
          //console.log(jwt_decode(response.data.object.idToken))
          if (response.data.message === "NEW_PASSWORD_REQUIRED") {
            history.push("/changePass");
          } else {
            //setUserSession(response.data.email, response.data.token);
            setUserSession(
              jwt_decode(response.data.object.idToken).email,
              response.data.object.idToken
            );
            props.history.push("/");
            window.location.reload(false);
          }
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 403) {
            setErrorMessage(error.response.data.message);
          } else if (error.response.status === 400) {
            toast.error("Usuario y/o contraseña incorrectos");
          } else {
            toast.error(
              "Lo sentimos, el servidor parece encontrarse en mantenimiento. Por favor intentelo de nuevo más tarde"
            );
          }
        })
    );
  };

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <i className="fab fa-typo3"></i>
            </div>
            <br />
            <h2>Iniciar sesión</h2>
            <br />
            <form onSubmit={submitHandler} className="form">
              <div className="form__field">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="info@mailaddress.com"
                />
              </div>

              <div className="form__field">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                />
              </div>
              <div className="form__field">
                <input type="submit" value="Aceptar" />
              </div>
              {errorMessage && <p className="message">{errorMessage}</p>}
              <LoadingIndicator />
              <br />
            </form>
            <p>
              ¿Aún no tienes cuenta? <Link to="/register">Registrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Login;
