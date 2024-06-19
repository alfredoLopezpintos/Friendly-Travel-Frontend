import React, { useState } from "react";
import { URLS } from "../../utils/urls";
import { checkPlate, checkVehicleYear, checkSeats } from "../../utils/ValidationFunctions";
import "./RegistrarUsuario.css";
import "./RegistrarUsuario.css";
import { useForm } from "react-hook-form";
import configData from "../../configData.json";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { isNumber, transformDate2 } from "../Utilities";
import es from "date-fns/locale/es";
import { toast, ToastContainer } from "react-toastify";
import { getToken } from "../service/AuthService";
import { TextField } from '@rodrisu/friendly-ui/build/textField'
import { Button } from "@material-ui/core";
import { Button as ButtonSbmt } from '@rodrisu/friendly-ui/build/button';
import { useImageUploader } from "../service/ImageUploader";
registerLocale("es", es);

export default function RegistrarVehiculo() {
  const { register, handleSubmit } = useForm();
  const { image, onFileChange, removeImage, uploadImage } = useImageUploader();
  // const onSubmit = () => fetchVehiculo(
  //   { airCond: airCond, airbag: airBag, plate: plate, year: year, seats: seats, model: model, manufacturer: manufacturer }
  // );
  const onSubmit = () => fetchVehiculo();
  // const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const redirect = (data, e) => {
    toast.success('Vehiculo agregado con exito')
    history.push("/");
  }
  const history = useHistory();

  const [plate, setPlateNumber] = useState("");
  const [seats, setSeats] = useState(0);
  const [year, setYear] = useState(0);
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [imageError, setImageError] = useState(false);
  const [airCond, setAirCond] = useState(false);
  const [airBag, setAirBag] = useState(false);

  function formValidate() {
    if (
      manufacturer == undefined ||
      year == undefined ||
      model == undefined ||
      airBag == undefined ||
      airCond == undefined ||
      plate == undefined ||
      seats == undefined
    ) {
      toast.error("Debe llenar todos los campos para poder crear el usuario.");
      return false;
    } else if (year > (moment().year()) + 1) {
      toast.error("El año del auto debe ser como maximo el año siguiente.");
      return false;
    } else if (!isNumber(year)) {
      toast.error("El año debe ser un numero");
      return false;
    } else {
      return true;
    }
  }

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

  async function fetchVehiculo() {
    if (formValidate()) {
      // Validation logic
      let validYear = false;
      validYear = checkVehicleYear(year).valid;

      let validPlate = false;
      validPlate = checkPlate(plate).valid;

      let validSeats = false;
      validSeats = checkSeats(seats).valid;

      if (!image) {
        toast.error('Imagen inválida. Por favor intente con otra imagen')
        // setImageError(true);
        // setIsSubmitting(false);
        return;
      }

      if (manufacturer && model && validYear && seats && validPlate && validSeats && !imageError) {
        // setIsSubmitting(true);
        const requestBody = {
          manufacturer,
          model,
          year,
          airbag: airBag,
          airCond: airCond,
          plate,
          seats,
        };

        if (image) {
          requestBody.image = image;
        }

        // try {
        const imageKey = uploadImage(plate);
        requestBody.imageKey = imageKey;

        //console.log(URLS.POST_VEHICLE_URL)
        //console.log(JSON.stringify(requestBody))
        //console.log(requestConfig)

        // console.log(requestBody)

        toast.promise(axios.post(
          URLS.POST_VEHICLE_URL,
          JSON.stringify(requestBody),
          requestConfig)
          .then((response) => {
            redirect();
            // setResult(responseAddVehicle.data.message);
            // setSnackbarOpen(true);
            // setIsSubmitting(false);
          }).catch((error) => {
            console.error(error);
            // toast.error(
            //   'Por favor complete todos los campos y asegúrese que todos tienen el formato correcto.'
            // );
            // toast.error(error.response.data.message);
          })
          ,
          {
            pending: {
              render() {
                return "Cargando"
              },
              icon: true,
            },
            error: {
              render({ data }) {
                toast.error(data.response.data.message);
              }
            }
          });
      }
      else {
        toast.error("Datos no validos")
      }
    }

    // const viajesGetEndpoint = configData.AWS_REST_ENDPOINT + "/vehicles";
    // // console.log(requestConfig)
    // // console.log(data)

    // toast.promise(axios.post(viajesGetEndpoint, data, requestConfig)
    //   .then((response) => {
    //     redirect();
    //   }).catch((error) => {
    //     console.error(error);
    //   })
    //   ,
    //   {
    //     pending: {
    //       render() {
    //         return "Cargando"
    //       },
    //       icon: true,
    //     },
    //     error: {
    //       render({ data }) {
    //         toast.error(data.response.data.message);
    //       }
    //     }
    //   });
    // }
  }

  const handleCheckBoxChange = event => {
    if (event.target.checked) {
      setAirCond(true)
      // <input value={true} {...register("airCond")} />
    } else {
      setAirCond(false)
      // <input value={false} {...register("airCond")} />
    }
  };

  const handleCheckBoxChange2 = event => {
    if (event.target.checked) {
      setAirBag(true)
      // <input value={true} {...register("airbag")} />
    } else {
      setAirBag(false)
      // <input value={false} {...register("airbag")} />
    }
  };

  function handleManufacturerChange(event) {
    setManufacturer(event.value);
  }
  function handleModelChange(event) {
    setModel(event.value);
  }
  function handleYearChange(event) {
    setYear(event.value);
  }
  function handleSeatsChange(event) {
    setSeats(event.value);
  }
  function handlePlateNumberChange(event) {
    setPlateNumber(event.value);
  }

  return (
    <>
      <div>
        <div style={{ "paddingTop": "50px" }} className="grid align__item">
          <div className="register formNew">
            <form onSubmit={handleSubmit(onSubmit, onError)} data-testid="form">
              <h2 style={{ "textAlign": "left", "paddingBottom": "50px", "color": "#004346" }} className="">Registrar Vehículo</h2>
              <p style={{ "textAlign": "left", "color": "#004346" }}>Fabricante</p>
              <TextField type="text" className="textField" name="fabricante" placeholder="Escribe aquí el fabricante del vehículo" onChange={(data) => handleManufacturerChange(data)} />
              <br />
              <p style={{ "textAlign": "left", "color": "#004346" }}>Modelo</p>
              <TextField type="text" className="textField" name="modelo" placeholder="Escribe aquí el modelo del vehículo" onChange={(data) => handleModelChange(data)} />
              <br />
              <p style={{ "textAlign": "left", "color": "#004346" }}>Año</p>
              <TextField type="year" className="textField" name="anio" placeholder="Escribe aquí el año del vehículo" onChange={(data) => handleYearChange(data)} />
              <br />
              <div className="politicas" style={{ "width": "40%", "display": "flex", "borderRadius": "8px" }}>
                <label id="checkBox" className="container" style={{ "width": "20%", "paddingRight": "20px", "paddingTop": "5px" }}>
                  <p className="">
                    Airbag
                  </p>
                  <input type="checkbox" onChange={handleCheckBoxChange2} />
                  <span className="checkmark"></span>
                </label>
                <label id="checkBox" className="container" style={{ "paddingTop": "5px", "marginLeft": "50px" }}>
                  <p className="">
                    A/C
                  </p>
                  <input type="checkbox" onChange={handleCheckBoxChange} />
                  <span className="checkmark"></span>
                </label>
              </div>
              <br />
              <p style={{ "textAlign": "left", "color": "#004346" }}>Asientos</p>
              <TextField type="number" className="textField" name="seats" placeholder="Escribe aquí el número de asientos del vehículo" onChange={(data) => handleSeatsChange(data)} />
              <br />
              <p style={{ "textAlign": "left", "color": "#004346" }}>Placa</p>
              <TextField type="text" className="textField" name="placa" placeholder="Escribe aquí la placa del vehículo sin puntos ni guiones" onChange={(data) => handlePlateNumberChange(data)} />
              <br />
              <p style={{ "textAlign": "left", "color": "#004346", "paddingBottom": "6px" }}>Foto frontal de la propiedad del vehículo</p>
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
                        className="photoBtn"
                        variant="outlined"
                        component="span"
                        style={{ marginBottom: "6px", boxShadow: "none" }}>
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
                      style={{ marginBottom: "10px", boxShadow: "none" }}
                      onClick={removeImage}>Quitar foto</Button>
                  </div>
                </div>
              )}
              <br />
              <ButtonSbmt type="submit" className="submitBtn"> Aceptar </ButtonSbmt>
              {/* <div>
                <div className="grid align__item">
                  <div className="register">
                    <div className="big_logo">
                      <i className="fab fa-typo3"></i>
                    </div>
                    <h1> Registrar vehiculo </h1>
                    <br />
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                      <div className="form">

                        <div className="form__field">
                          <input type="text" {...register("manufacturer")} placeholder="Fabricante" />
                        </div>
                        <div className="form__field">
                          <input type="text" {...register("model")} placeholder="Modelo" />
                        </div>
                        <label id="checkBox" className="container">
                          Bolsa de Aire
                          <input type="checkbox" onChange={() => handleCheckBoxChange2()}
                            {...register("airbag")} />
                          <span class="checkmark"></span>
                        </label>
                        <div className="form__field">
                          <input type="text" {...register("year")} placeholder="Año" />
                        </div>
                        <br />
                        <label id="checkBox" className="container">
                          Aire Acondicionado
                          <input type="checkbox" onChange={() => handleCheckBoxChange()}
                            {...register("airCond")} />
                          <span class="checkmark"></span>
                        </label>
                        <div className="form__field">
                          <input type="text"
                            {...register("plate")}
                            placeholder="Placa"
                          />
                        </div>
                        <div className="form__field">
                          <input type="submit" value="Aceptar" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
              {/* <ToastContainer position="top-center" /> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
