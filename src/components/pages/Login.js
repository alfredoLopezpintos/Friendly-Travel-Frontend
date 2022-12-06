import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../service/AuthService";
import configData from "../../configData.json";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Login.css";
import jwt_decode from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../Footer";
import "./Login.css";
const loginAPIUrl = configData.AWS_REST_ENDPOINT + "/login";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

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
      (axios
        .post(loginAPIUrl, requestBody)
        .then((response) => {
          if (response.data.message === "NEW_PASSWORD_REQUIRED") {
            history.push("/changePass");
          } else {
            setUserSession(
              jwt_decode(response.data.object.idToken).email,
              response.data.object.idToken
            );
            props.history.push("/");
            window.location.reload(false);
            toast.success("Bienvenido")
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
        }))
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
  };

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
          <div className="big_logo">
              <img src={require("../../assets/images/logo2.png")} alt="travel logo" width={200}></img>
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
              <br />
            </form>
            <p>
              ¿Aún no tienes cuenta? <Link to="/register">Registrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
      <Footer />
    </>
  );
};

export default Login;
