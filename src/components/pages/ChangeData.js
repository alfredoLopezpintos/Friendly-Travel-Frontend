import React, { useState } from "react";
import axios from "axios";
import "../Cards.css";
import Footer from "../Footer";
import { useHistory } from "react-router-dom";
import "./ChangeData.css"
import { Button } from "../Button";
import ModalRegistrarVehiculo from '../../components/ModalRegistrarVehiculo';
import ModalInfo from '../../components/ModalInfo';
import {
    isValidEmail
  } from "../../utils/ValidationFunctions";
import { getToken, getUser } from "../service/AuthService";
import { URLS } from "../../utils/urls";


export function ChangeData() {

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);


  const handleClose = () => {
    setDisplayModal(false);
  };

  const requestConfig = {
    headers: {
        Authorization: JSON.parse(getToken()),
        "Content-Type": "application/json",
    },
  };

  async function handleHistory() {
    // history.push("/changePass");
    const email = getUser()

    if (!(email.trim() === "")) {

      if (isValidEmail(email)) {
        setIsSubmitting(true);
        const requestBody = {
          email
        };

        try {
          const responseAddVehicle = await axios.post(
            URLS.POST_REQUEST_FORGOT_PASS_URL,
            JSON.stringify(requestBody),
            requestConfig
          );
          setErrorMessage(false)
          if (responseAddVehicle.data.message === 'Si su email se encuentra registrado, recibirá un correo con las instrucciones para recuperar la cuenta.') {
            setSuccess(true);
            setResult(responseAddVehicle.data.message);
          }
          setIsSubmitting(false);
          setIsFormSubmitted(true);
        } catch (error) {
          setErrorMessage(true)
          setResult(error.response.data.message);
          setSuccess(true);
          setIsSubmitting(false);
        }
      }
    }
  };

  return (
    <>
      {(success === true) ? (<ModalInfo setSuccess={setSuccess} handlePrevModalClose={handleClose} message={result} errorMessage={errorMessage} />) :
        (
          <>
            <div className="cards">
              <div className="cards__container">
                <div className="boxTest">
                  <h1>Opciones</h1>
                  <div className="divider"></div>
                  <h2>Modificar datos</h2>
                  <br />
                  <Button className="btns"
                    buttonStyle="btn--test"
                    buttonSize="btn--large"
                    onClick={handleHistory}>
                    Cambiar contraseña
                  </Button>
                  <br />
                  <ModalRegistrarVehiculo />
                  <div className="divider"></div>
                  <h2>Datos de usuario</h2>
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
    </>
  );
}
