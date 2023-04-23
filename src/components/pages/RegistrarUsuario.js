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
import {
  isValidDocument,
  isValidEmail,
  isValidPhoneNumber
} from "../../utils/ValidationFunctions";
import { URLS } from "../../utils/urls";
registerLocale("es", es);

export default function RegistrarUsuario() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => postData(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const history = useHistory();
  let checkBox = false;

  const [image, setImage] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const MAX_IMAGE_SIZE = 10000000;

  function onFileChange(e) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createImage(files[0]);
  }

  function createImage(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      if (!imageData.includes("data:image/")) {
        return alert("Tipo de archivo incorrecto, solo se aceptan imágenes");
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        return alert("La imagen es muy grande. Máximo 10 MB");
      }
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function removeImage(e) {
    console.log("Remove clicked");
    setImage("");
  }

  async function uploadImage(email) {
    try {
      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url: URLS.GET_PRESIGNED_URL,
        params: {
          email: email
        }
      });

      // Image to binary
      let binary = atob(image.split(",")[1]);
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: "image/*" });
      console.log("Uploading to: ", response.data.object.uploadUrl);
      const result = await fetch(response.data.object.uploadUrl, {
        method: response.data.object.uploadMethod,
        body: blobData,
      });
      console.log("Result: ", result);
      // Final URL for the user doesn't need the query string params
      setUploadURL(response.data.object.uploadURL);
    } catch (error) {
      // Handle the error
      console.error('Error:', error);
    }
  }

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
                <label for="ci-photo">Foto frontal de la C.I.</label>
                {!image ? (
                  <div>
                    <div className="form__field">
                      <input
                        type="file"
                        onChange={onFileChange}
                        accept="image/*"
                        id="ci-photo" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div><img src={image} alt="Uploaded file" className="uploaded-image" /></div>
                    {!uploadURL && (
                      <div>
                        <button onClick={removeImage}>Quitar archivo</button>
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