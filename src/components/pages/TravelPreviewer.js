import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader
} from "@react-google-maps/api";
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { BaseSection, SectionContentSize } from '@rodrisu/friendly-ui/build/layout/section/baseSection';
import { SearchForm, SearchFormDisplay } from '@rodrisu/friendly-ui/build/searchForm';
import { TheVoice } from '@rodrisu/friendly-ui/build/theVoice';
import axios from "axios";
import Moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import configData from "../../configData.json";
import { URLS } from "../../utils/urls";
import { AutoCompleteUy } from "../AutoCompleteUy";
import { months, weekdaysLong, weekdaysShort } from "../DatePickerProps.js";
import Footer from "../Footer";
import { formValidate } from "../Utilities";
import { getToken } from "../service/AuthService";
import "./Login.css";
import { set } from "date-fns";

const nafta = 74.88;

const MapContainer = styled.div`
  position: relative;
`;

const Modal = styled.div`
  position: fixed;
  left: 12%;
  transform: translate(-40%, 20px);
  width: 400px;
  height: 650px;
  padding: 40px 80px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  // flex-wrap: wrap;
  flex-direction: column;
  z-index: 999;
  // background: rgb(199, 236, 255);
  // background: linear-gradient(
  //   126deg,
  //   rgba(199, 236, 255, 1) 0%,
  //   rgba(232, 232, 232, 1) 57%,
  //   rgba(255, 239, 205, 1) 100%
  // );
  background: rgba(0, 0, 0, 0);
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid black;
  color: black;
  padding: 0.25em 1em;
  width: 100%;
  &:hover {
    background-color: gray;
    color: white;
  }
`;

const estilos = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};
function TravelPreviewer() {
  const [libraries] = useState(["places"]);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: "fixed",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [vehiculo, setVehiculo] = useState([]);
  const [plate, setPlate] = useState();
  const [originForm, setOriginForm] = useState("");
  const [destinationForm, setDestinationForm] = useState("");

  const onError = (errors, e) => console.log(errors, e);
  const history = useHistory();

  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();
  const lugaresRef = useRef();
  const [lugares, setLugares] = useState("");
  const [precio, setPrecio] = useState();
  const [sugerido, setSugerido] = useState("");
  const [dist, setDist] = useState("");
  const [dur, setDur] = useState("");

  async function redirect(data, e) {
    history.push("/");
    toast.success("Viaje creado correctamente!");
  }

  async function traerVehiculos() {

    toast.promise(
      axios
        .get(URLS.GET_VEHICLES_URL, {
          headers: {
            Authorization: JSON.parse(getToken()),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.length) {
            setVehiculo(response.data);
          } else {
            toast.warning(
              "No tiene vehículos registrados. Dirigete a tu panel de usuario para agregar uno."
            );
          }
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        pending: {
          render() {
            return "Cargando";
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return toast.error("Error");
          },
        },
      }
    );
  }

  useEffect(() => {
    traerVehiculos();
  }, []);

  useEffect(() => {
    if (originForm && destinationForm) {
      calculateRoute();
    }

    // traerVehiculos();
  }, [originForm, destinationForm]);


  async function handleSubmit(data) {

    const bodyToSendToBackend = {
      origin: data.AUTOCOMPLETE_FROM.item,
      destination: data.AUTOCOMPLETE_TO.item,
      tripDate: data.DATEPICKER,
      availablePlaces: data.STEPPER,
      distance: distance,
      duration: duration,
      //corregir vehicle luego de haber agregado el campo en el form
      vehicle: "sch8260",
    };
    console.log(bodyToSendToBackend);

    if (formValidate(bodyToSendToBackend.origin,
      bodyToSendToBackend.destination,
      bodyToSendToBackend.tripDate,
      bodyToSendToBackend.price,
      bodyToSendToBackend.availablePlaces)) {

      //Convertimos la fecha aca, porque sino el if anterior falla en la validacion de la fecha
      bodyToSendToBackend.tripDate = Moment(bodyToSendToBackend.tripDate).format("DD-MM-YYYY");

      if (!bodyToSendToBackend.vehicle) {
        toast.warning("Debe seleccionar un vehículo");
        return false;
      }

      toast.promise(
        axios
          .post(URLS.POST_TRIPS_URL, bodyToSendToBackend, {
            headers: {
              Authorization: JSON.parse(getToken()),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            clearRoute();
            redirect();
          })
          .catch((error) => {
            console.error(error);
          }),
        {
          pending: {
            render() {
              return "Cargando";
            },
            icon: true,
          },
          error: {
            render({ data }) {
              return toast.error("Error");
            },
          },
        }
      );
    }
  }

  if (!isLoaded) {
    return <>loading...</>;
  }

  function calculateRoute(e) {
    console.log("Desde: " + originForm);
    console.log("Hasta: " + destinationForm);
    e?.preventDefault();
    if (originForm === "" || destinationForm === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    toast.promise(
      directionsService
        .route({
          origin: originForm,
          destination: destinationForm,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((results) => {
          setDirectionsResponse(results);
          setDistance(results.routes[0].legs[0].distance.text);
          setDuration(results.routes[0].legs[0].duration.text);
          setDist("Distancia: " + results.routes[0].legs[0].distance.text);
          setDur("Duración: " + results.routes[0].legs[0].duration.text);
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        pending: {
          render() {
            return "Cargando";
          },
          icon: true,
        },
        error: {
          render({ data }) {
            return toast.error("Error");
          },
        },
      }
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setDist("");
    setDur("");
    setOriginForm("");
    setDestinationForm("");
  }

  function calcularContribucion() {
    let precio = 0;
    let dist = 0;
    let total = 0;

    precio = lugaresRef.current.value;
    precio++;
    dist = parseInt(distance);
    setLugares(lugaresRef.current.value);

    total = ((dist / 12) * nafta) / precio;
    Math.floor(precio);
    setPrecio(Math.floor(total));
    setSugerido("Sugerido $" + Math.floor(total));
    return total;
  }

  return (
    <>
      <MapContainer>
        <Modal>
          <BaseSection contentSize={SectionContentSize.LARGE}>
            <SearchForm
              onSubmit={handleSubmit}
              initialFrom=""
              initialTo=""
              disabledFrom={false}
              disabledTo={false}
              autocompleteFromPlaceholder="Desde"
              autocompleteToPlaceholder="Hasta"
              renderDatePickerComponent={props => <DatePicker {...props}
                numberOfMonths={1}
                orientation={DatePickerOrientation.HORIZONTAL}
                locale="es-UY"
                weekdaysShort={weekdaysShort('es-UY')}
                weekdaysLong={weekdaysLong('es-UY')}
                months={months('es-UY')}
              />}
              renderAutocompleteFrom={props => <AutoCompleteUy onClickItem={(selectedItem) => setOriginForm(selectedItem.description)} {...props} embeddedInSearchForm />}
              renderAutocompleteTo={props => <AutoCompleteUy onClickItem={(selectedItem) => setDestinationForm(selectedItem.description)} {...props} embeddedInSearchForm />}
              datepickerProps={{
                defaultValue: new Date().toISOString(),
                format: value => new Date(value).toLocaleDateString(),
              }}
              stepperProps={{
                defaultValue: 1,
                min: 1,
                max: 4,
                title: 'Elija la cantidad de asientos que desea reservar',
                increaseLabel: 'Incrementar la cantidad de asientos en 1',
                decreaseLabel: 'Decrementar la cantidad de asientos en 1',
                format: value => `${value} asiento(s)`,
                confirmLabel: 'Submit',
              }}
              priceProps={{
                defaultValue: "",
                min: 0,
                title: 'Precio',
                format: value => `${value} UYU`,
                confirmLabel: 'Aceptar',
              }}
              submitButtonText="Publicar viaje"
              display={SearchFormDisplay.SMALL}
              showInvertButton={false}
              addon={<TheVoice>Save up to €40 on your first trip!</TheVoice>}
            />
          </BaseSection>
          {/* <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
            <div>
              <h3>¡Publica tu viaje aquí!</h3>
              <br />
              <Autocomplete
                onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input
                  {...register("origin")}
                  placeholder="Selecciona origen"
                  type="text"
                  ref={originRef}
                  style={estilos}
                />
              </Autocomplete>
              <br />
              <Autocomplete
                onPlaceChanged={calculateRoute}
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <input
                  {...register("destination")}
                  placeholder="Selecciona destino"
                  type="text"
                  ref={destiantionRef}
                  style={estilos}
                />
              </Autocomplete>
              <br />
              <label>
                Fecha del viaje
                <input
                  {...register("tripDate")}
                  type="date"
                  ref={dateRef}
                  min="01-01-2020"
                  style={estilos}
                />
              </label>
              <br />
              <br />
              <Select
                options={vehiculo.map((e, i) => ({
                  label: e.plate,
                  value: e.plate,
                }))}
                onChange={(values) => setPlate(values[0].value)}
                noDataRenderer={() => "No tiene vehículos cargados"}
                placeholder="Selecciona vehÍculo"
                closeonselect
                style={estilos}
              />
              <br />
              <input
                {...register("availablePlaces")}
                type="number"
                min="1"
                max="4"
                id="lugares"
                name="availablePlaces"
                placeholder="Plazas disponibles"
                ref={lugaresRef}
                onChange={calcularContribucion}
                style={estilos}
              />
              <br />
              <br />

              <input
                {...register("price")}
                type="number"
                min="1"
                max="1000"
                id="precio"
                name="price"
                placeholder="Costo estimado"
                style={estilos}
              />
              <span>{sugerido}</span>

              <br></br>
              <br></br>
              <Button
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid black`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                }}
              >
                Crear Viaje
              </Button>
              <br />
              <br />
              <span>{dist}</span>
              <br />
              <br />
              <span>{dur}</span>
            </div>
          </form> */}
        </Modal>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse}
              options={{
                autoAdjust: true,
                preserveViewport: true,
              }} />
          )}
        </GoogleMap>
      </MapContainer>
      <ToastContainer position="top-center" />
      <Footer />
    </>
  );
}

export default TravelPreviewer;
