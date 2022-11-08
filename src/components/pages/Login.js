import React, {useState} from 'react';
import axios from 'axios';
import { setUserSession } from '../service/AuthService'
import configData from '../../configData.json';
import './Login.css'
//const loginAPIUrl = 'https://gzcxszjnze.execute-api.us-east-1.amazonaws.com/prod/login';
const loginAPIUrl = configData.AWS_REST_ENDPOINT + "/login"

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Both username and password are required');
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'OkhIJdHFMomDeRVUXGfa1EXWiGBAWpdakg7ZRCFf'
      }
    }
    const requestBody = {
      email: email,
      password: password
    }

    axios.post(loginAPIUrl, requestBody, requestConfig).then((response) => {
      setUserSession(response.data.user, response.data.token);
      props.history.push('/premium-content');
    }).catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('sorry....the backend server is down. please try again later!!');
      }
    })
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h5>Login</h5>
        Email: <input type="text" value={email} onChange={event => setEmail(event.target.value)} /> <br/>
        password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
        <input type="submit" value="Login" />
      </form>
      {errorMessage && <p className="message">{errorMessage}</p>}
    </div>
  )
}

export default Login;