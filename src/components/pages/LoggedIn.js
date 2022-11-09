import React from 'react';
import { getUser, resetUserSession } from '../service/AuthService';

const LoggedIn = (props) => {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  console.log(user)

  const logoutHandler = () => {
    resetUserSession();
    props.history.push('login');
  }
  return (
    <div className = "form-box">
    <form >
        
        <div className = "field1">
          <h1> Mi Perfil </h1>
          <label> Fecha de nacimiento: </label>
          <div>
            Hello {name}! You have been loggined in!!!! Welcome to the premium content. <br />
            <input type="button" value="Logout" onClick={logoutHandler} />
          </div>
        </div>

        <br />
    </form>

  </div>
  )
}

export default LoggedIn;