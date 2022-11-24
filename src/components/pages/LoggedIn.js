import React from 'react';
import { getUser, getToken, resetUserSession } from '../service/AuthService';
import jwt_decode from "jwt-decode";

const LoggedIn = (props) => {
  const user = getUser();
  const token = getToken();
  //const name = user !== 'undefined' && user ? user.name : '';

  //console.log(user)
  console.log(jwt_decode(token))

  const logoutHandler = () => {
    resetUserSession();
    props.history.push('/');
  }
  return (
    <div className = "form-box">
    <form >
        
        <div className = "field1">
          <h1> Mi Perfil </h1>
          <div>
            Hola {user}! Te logueaste correctamente!!!! Bienvenido. <br />
            <input type="button" value="Logout" onClick={logoutHandler} />
          </div>
        </div>

        <br />
    </form>

  </div>
  )
}

export default LoggedIn;