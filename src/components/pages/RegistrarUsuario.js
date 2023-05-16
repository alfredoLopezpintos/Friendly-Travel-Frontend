import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
import "./RegistrarUsuario.css";
import { registerLocale } from "react-datepicker";
import { transformDate2 } from "../Utilities";
import { Button } from "@material-ui/core";
import { useImageUploader } from "../service/ImageUploader";
import {
  isValidDocument,
  isValidEmail,
  isValidPhoneNumber
} from "../../utils/ValidationFunctions";
import { URLS } from "../../utils/urls";
import { colors } from "@material-ui/core";
registerLocale("es", es);

export default function RegistrarUsuario() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => postData(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const history = useHistory();
  let checkBox = false;
  const { image, onFileChange, removeImage, uploadImage } = useImageUploader();

  function borrarCampos(data) {
    checkBox = false;
  }

  function formValidate(data) {
    if (
      data.email === "" ||
      data.name === "" ||
      data.surname === "" ||
      data.birthDate === "" ||
      data.documentId === "" ||
      data.phoneNumber === "" ||
      !image
    ) {
      toast.error("Debe completar todos los campos");
      return false;
    } else if (!moment(data.birthDate, "DD-MM-YYYY").isValid()) {
      toast.error("Fecha inválida");
      return false;
    } else if (moment().diff(data.birthDate, "years") < 18) {
      console.log(moment().diff(data.birthDate, "years") < 18);
      toast.error("El usuario debe ser mayor de edad");
      return false;
    } else if (!isValidEmail(data.email)) {
      toast.error("El formato del correo electrónico no es válido");
      return false;
    } else if (!isValidPhoneNumber(data.phoneNumber)) {
      toast.error("El formato del teléfono no es válido");
      return false;
    } else if (!isValidDocument(data.documentId)) {
      return false;
    } else if (!checkBox) {
      toast.error(
        "Debe estar de acuerdo con la política de uso de FriendlyTravel" +
        " para poder registrarse."
      );
      return false;
    } else {
      return true;
    }
  }

  function uploadImageAndRegisterUser(data) {
    data.birthDate = transformDate2(data.birthDate);

    return new Promise((resolve, reject) => {
      uploadImage(data.email)
        .then(() => {
          axios
            .post(URLS.POST_USER_URL, {
              ...data
            })
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function postData(data, e) {
    console.log(data);
    if (formValidate(data)) {
      toast.promise(
        uploadImageAndRegisterUser(data),
        {
          pending: {
            render() {
              return "Cargando";
            },
            icon: true,
          },
          error: {
            render({ data }) {
              return (data.response.data.message);
            },
          },
        }
      ).then(() => {
        redirect();
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  const handleCheckBoxChange = (event) => {
    if (event.target.checked) {
      checkBox = true;
    } else {
      checkBox = false;
    }
  };

  async function redirect(data, e) {
    toast.success("Usuario creado correctamente.");
    history.push("/");
    borrarCampos(data);
  }

  return (
    <>
      <div>
        <div className="grid align__item">
          <div className="register">
            <div className="big_logo">
              <img
                src={require("../../assets/images/logo2.png")}
                alt="travel logo"
                width={200}
              ></img>
            </div>
            <br />
            <h2> Registrar usuario </h2>
            <br />
            <form onSubmit={handleSubmit(onSubmit, onError)} className="form" data-testid="form">
              <div>
                <label>Nombre</label>
                <div className="form__field">
                  <input
                    {...register("name")}
                    placeholder="Ingrese su nombre"
                    type="text"
                  />
                </div>

                <label>Apellido</label>
                <div className="form__field">
                  <input
                    {...register("surname")}
                    placeholder="Ingrese su apellido"
                    type="text"
                  />
                </div>

                <label>Email</label>
                <div className="form__field">
                  <input
                    {...register("email")}
                    placeholder="Ingrese su email"
                    type="email"
                  />
                </div>

                <label>Fecha de nacimiento</label>
                <div className="form__field" data-testid="birthDate" >
                  <input
                    {...register("birthDate")}
                    type="date"
                    format="dd-MM-yyyy"
                  />
                </div>

                <label>Cédula de identidad</label>
                <div className="form__field">
                  <input
                    {...register("documentId")}
                    placeholder="Sin puntos ni guiones, ej. 43215678"
                    type="number"
                  />
                </div>

                <label>Teléfono de contacto</label>
                <div className="form__field">
                  <input
                    {...register("phoneNumber")}
                    placeholder="Número de teléfono, ej. 099111333"
                    type="number"
                  />
                </div>
                <label htmlFor="ci-photo">Foto frontal de la C.I.</label>
                {!image ? (
                  <div>
                    <div>
                      <input
                        type="file"
                        id="ci-photo"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={onFileChange}
                      />
                      <label htmlFor="ci-photo">
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth={true}
                          style={{ marginBottom: "10px", boxShadow: "none" }}>
                          Subir foto
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div><img src={image} alt="Uploaded file" className="uploaded-image" /></div>
                    {!image && (
                      <div>
                        <Button
                        variant="outlined"
                        component="span"
                        fullWidth={true}
                        style={{ marginBottom: "10px", boxShadow: "none" }}
                        onClick={removeImage}>Quitar foto</Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="form__field">
                  <label id="checkBox" className="container">
                    Confirmo haber leído y estar de acuerdo con las
                    <a href="/policy"> políticas de uso de FriendlyTravel</a>
                    <input type="checkbox" onChange={handleCheckBoxChange} />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <br />
                <div className="form__field">
                  <input type="submit" value="Aceptar" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}