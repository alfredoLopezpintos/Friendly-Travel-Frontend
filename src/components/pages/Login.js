import React, {useState} from 'react';
import axios from 'axios';
import { setUserSession } from '../service/AuthService'
import configData from '../../configData.json';
import { Link } from 'react-router-dom';
import './Login.css'
//const loginAPIUrl = 'https://gzcxszjnze.execute-api.us-east-1.amazonaws.com/prod/login';
const loginAPIUrl = configData.AWS_REST_ENDPOINT + "/login"
//const loginAPIUrl = "https://friendlytravel.auth.us-east-1.amazoncognito.com/login"

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Usuario y contraseña no pueden ser vacios.');
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        'Authorization': 'OkhIJdHFMomDeRVUXGfa1EXWiGBAWpdakg7ZRCFf'
      }
    }
    const requestBody = {
      email: email,
      password: password
    }

    console.log(requestBody)

    axios.post(loginAPIUrl, requestBody).then((response) => {
      setUserSession(response.data.user, response.data.token);
      props.history.push('/loggedIn');
    }).catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } else if(error.response.status === 400) {
        setErrorMessage("Usuario y/o contraseña incorrectos.")
      } else {
        setErrorMessage('Lo sentimos, el servidor parece encontrarse en mantenimiento. Por favor intentelo de nuevo más tarde.');
      }
    })
  }

  return (
    <div>
      <div class="grid align__item">

      <div class="register">

        <svg xmlns="http://www.w3.org/2000/svg" class="site__logo" width="56" height="84" viewBox="77.7 214.9 274.7 412"><defs><linearGradient id="a" x1="0%" y1="0%" y2="0%"><stop offset="0%" stop-color="#8ceabb"/><stop offset="100%" stop-color="#378f7b"/></linearGradient></defs><path fill="url(#a)" d="M215 214.9c-83.6 123.5-137.3 200.8-137.3 275.9 0 75.2 61.4 136.1 137.3 136.1s137.3-60.9 137.3-136.1c0-75.1-53.7-152.4-137.3-275.9z"/></svg>

        <h2>Iniciar sesión</h2>

        <br />

        <form onSubmit={submitHandler} className="form">

          <div class="form__field">
            <input value={email} onChange={event => setEmail(event.target.value)}
            type="email" placeholder="info@mailaddress.com" />
          </div>

          <div class="form__field">
            <input value={password} onChange={event => setPassword(event.target.value)}
            type="password" placeholder="••••••••••••" />
          </div>

          <div class="form__field">
            <input type="submit" value="Aceptar" />
          </div>

          {errorMessage && <p className="message">{errorMessage}</p>}
          <br />
        </form>

        <p>¿No tienes cuenta? <Link to="/register">Registrate</Link></p>

      </div>

      </div>
    </div>
  )
}

export default Login;