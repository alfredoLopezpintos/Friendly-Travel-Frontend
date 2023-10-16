import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader
} from "@react-google-maps/api";
import { MediaSizeProvider } from '@rodrisu/friendly-ui/build/_utils/mediaSizeProvider';
import { AutoComplete } from "@rodrisu/friendly-ui/build/autoComplete";
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { BaseSection, SectionContentSize } from '@rodrisu/friendly-ui/build/layout/section/baseSection';
import { SearchForm, SearchFormDisplay } from '@rodrisu/friendly-ui/build/searchForm';
import axios from "axios";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from 'react-responsive';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import configData from "../../configData.json";
import { URLS } from "../../utils/urls";
import { AutoCompleteUy } from "../AutoCompleteUy";
import { months, weekdaysLong, weekdaysShort } from "../DatePickerProps.js";
import Footer from "../Footer";
import MapView from '../MapView';
import { formValidate } from "../Utilities";
import { getToken } from "../service/AuthService";
import "./Login.css";

const nafta = 74.88;

const TopSection = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 999;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 998;
`;

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
  flex-direction: column;
  z-index: 999;
  background: rgba(0, 0, 0, 0);
  align-items: center;
  justify-content: center;
`;

function TravelPreviewer() {
  const [libraries] = useState(["places"]);
  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: "fixed",
  };
  const isMobile = useMediaQuery({ maxWidth: 700 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries,
    language: "es",
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [vehiculo, setVehiculo] = useState([]);
  const [originForm, setOriginForm] = useState("");
  const [destinationForm, setDestinationForm] = useState("");

  const onError = (errors, e) => console.log(errors, e);
  const history = useHistory();

  const [sugerido, setSugerido] = useState("");
  const [dist, setDist] = useState("");
  const [dur, setDur] = useState("");

  const [items, setItems] = useState([])
  const [isSearching, setSearching] = useState(false)
  const vehiclesList = vehiculo.map((e, i) => ({
    label: e.model,
    labelInfo: e.plate,
  }));

  const searchForItems = (query) => {
    if (query === undefined) {
      console.error("query is undefined");
      return;
    }

    const lowercaseQuery = query.toLowerCase();

    setSearching(true);
    setTimeout(() => {
      setItems(
        vehiclesList.filter((place) => {
          // Convert label and labelInfo to lowercase for case-insensitive search
          const lowercaseLabel = place.label.toLowerCase();
          const lowercaseLabelInfo = place.labelInfo.toLowerCase();

          // Check if either label or labelInfo contains the query
          return (
            lowercaseLabel.includes(lowercaseQuery) ||
            lowercaseLabelInfo.includes(lowercaseQuery)
          );
        })
      );
      setSearching(false);
    });
  };


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

  }, [originForm, destinationForm]);


  async function handleSubmit(data) {

    const bodyToSendToBackend = {
      origin: data.AUTOCOMPLETE_FROM !== undefined ? data.AUTOCOMPLETE_FROM.item : "",
      destination: data.AUTOCOMPLETE_TO !== undefined ? data.AUTOCOMPLETE_TO.item : "",
      tripDate: data.DATEPICKER,
      availablePlaces: data.STEPPER,
      price: data.PRICE,
      distance: distance,
      duration: duration,
      vehicle: data.AUTOCOMPLETE_VEHICLE !== undefined ? data.AUTOCOMPLETE_VEHICLE.item.labelInfo : "",
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
            toast.error(error.response.data.message);
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

  // Function to calculate the suggested price
  const calculateSuggestedPrice = (formData) => {
    if (distance && vehiculo.length > 0) {
      const distanceInKilometers = parseFloat(distance.replace(" km", "").replace(",", ".")); // Parse the distance
      const tripCost = (distanceInKilometers / 12) * nafta;
      
      
      // const suggestedPrice = tripCost / (formData.STEPPER + 1); //Comentado porque al actualizar la cantidad de asientos, se reinicia el mapa

      // Calculate the cost based on the tripCost and the number of passengers
      const suggestedPrice = tripCost / 4;

      // Update the state with the suggested price
      setSugerido(`Sugerido: $ ${suggestedPrice.toFixed(0)}`);
    } else {
      setSugerido(""); // Clear the suggested price if distance or vehiculo is not available
    }
  };

  const SearchFormComponent = (
    <MediaSizeProvider>
      <BaseSection contentSize={SectionContentSize.LARGE}>
        <SearchForm
          onSubmit={handleSubmit}
          onChange={calculateSuggestedPrice}
          initialFrom=""
          initialTo=""
          disabledFrom={false}
          disabledTo={false}
          autocompleteFromPlaceholder="Desde"
          autocompleteToPlaceholder="Hasta"
          autocompleteVehiclePlaceholder="Seleccione su vehículo"
          renderDatePickerComponent={props => <DatePicker {...props}
            numberOfMonths={1}
            orientation={DatePickerOrientation.HORIZONTAL}
            locale="es-UY"
            weekdaysShort={weekdaysShort('es-UY')}
            weekdaysLong={weekdaysLong('es-UY')}
            months={months('es-UY')}
          />}
          renderAutocompleteVehicle={props => <AutoComplete {...props}
            renderNoResults={() => 'No hay vehículos disponibles'}
            searchForItems={searchForItems}
            items={items}
            isSearching={isSearching}
            renderEmptySearch={vehiclesList}
            embeddedInSearchForm
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
            confirmLabel: 'Aceptar',
          }}
          priceProps={{
            defaultValue: 0,
            min: 0,
            title: 'Precio',
            format: value => `$ ${value}`,
            confirmLabel: 'Aceptar',
          }}
          submitButtonText="Publicar viaje"
          display={SearchFormDisplay.SMALL}
          showInvertButton={false}
          addon={<>
            <p>{dist}</p>
            <p>{dur}</p>
            <p>{sugerido}</p>
          </>}
        />
      </BaseSection>
    </MediaSizeProvider>
  );

  return (
    <>
      {isLoaded && (
        <>
          {isMobile ? (
            <>
              <TopSection>
                {SearchFormComponent}
              </TopSection>
              <BottomSection>
                <MapView directionsResponse={directionsResponse} />
              </BottomSection>
            </>
          ) : (
            <>
              <MapContainer>
                <Modal>
                  {SearchFormComponent}
                </Modal>
              </MapContainer>
              <MapView 
              directionsResponse={directionsResponse} />
            </>
          )}
        </>
      )}
      <Footer />
    </>
  );
}

export default TravelPreviewer;
