import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
// import "./RegistrarUsuario.css";
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
import { TextField } from '@rodrisu/friendly-ui/build/textField'
registerLocale("es", es);

export default function RegistrarUsuario() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => postData(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);
  const { image, onFileChange, removeImage, uploadImage } = useImageUploader();

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
      // console.log(moment().diff(data.birthDate, "years") < 18);
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
    } else if (!isChecked) {
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
    // console.log(data);
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
    setIsChecked(event.target.checked);
  };

  async function redirect(data, e) {
    toast.success("Usuario creado correctamente");
    history.push("/login");
  }

  return (
    <>
      <div>
        <div style={{ "padding-top": "50px" }} className="grid align__item">
          <div className="register text">
            <h2 style={{ "text-align": "left", "padding-bottom": "50px", "color": "#172A3A" }} className="">Registrarse</h2>
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Nombre</p>
            <TextField type="text" className="textField" name="nombre" placeholder="Escribe aquí tu nombre" onChange={(data) => null} />
            <br />
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Apelldo</p>
            <TextField type="text" className="textField" name="apellido" placeholder="Escribe aquí tu apellido" onChange={(data) => null} />
            <br />
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Correo electrónico</p>
            <TextField type="email" className="textField" name="email" placeholder="Escribe aquí tu correo electrónico" onChange={(data) => null} />
            <br />
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Fecha de nacimiento</p>
            <TextField type="date" className="textField" name="birthdate" placeholder="Selecciona tu fecha de nacimiento" onChange={(data) => null} />
            <br />
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Cédula de identidad</p>
            <TextField type="number" className="textField" name="ci" placeholder="Escribe aquí tu cédula de identidad" onChange={(data) => null} />
            <br />
            <p style={{ "text-align": "left", "color": "#172A3A" }}>Teléfono de contacto</p>
            <TextField type="tel" className="textField" name="phone" placeholder="Escribe aquí tu teléfono" onChange={(data) => null} />
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
                    <div>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth={true}
                        style={{ marginBottom: "10px", boxShadow: "none" }}
                        onClick={removeImage}>Quitar foto</Button>
                    </div>
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