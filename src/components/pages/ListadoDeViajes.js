import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState, useCallback, useEffect, Fragment } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";
import "./ListadoDeViajes.css";
import { formValidate } from "../Utilities";
import { getToken } from "../service/AuthService";
import configData from "../../configData.json";
import { URLS } from "../../utils/urls";
import es from "date-fns/locale/es";
import TextItem from "../TextItem";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { SearchForm } from '@rodrisu/friendly-ui/build/searchForm';
import { AutoCompleteUy } from "../AutoCompleteUy";
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { Address, Itinerary } from '@rodrisu/friendly-ui/build/itinerary';
import { weekdaysShort, weekdaysLong, months } from "../DatePickerProps.js";
import { useLocation } from 'react-router-dom';
registerLocale("es", es);

export default function ListadoDeViajes() {
  const [viajes, setViajes] = useState([]);
  const [viajesSorted, setViajesSorted] = useState([]);
  const [prevViajes, setPrevViajes] = React.useState([])
  const [pageNumber, setPageNumber] = React.useState(0)
  const [cardsNumber, setCardsNumber] = React.useState(5)
  const [visible, setVisible] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState(0);
  const observer = useRef();

  const location = useLocation();
  const receivedData = location.state?.data || 
                      { desde: undefined,
                      hasta: undefined,
                      fecha: undefined,
                      asientos: undefined,
                      precio: undefined };

  useEffect(()=>{
    if((receivedData.desde !== undefined) && (receivedData.hasta !== undefined) && (receivedData.fecha !== undefined)) {
      fetchViajes(receivedData.desde,
                  receivedData.hasta,
                  receivedData.fecha,
                  receivedData.precio, 
                  receivedData.asientos);
    }
  }, [])

  const handleFormSubmit = (formValues) => {
    receivedData.desde = (formValues.AUTOCOMPLETE_FROM !== undefined) ? formValues.AUTOCOMPLETE_FROM.item.city : receivedData.desde;
    receivedData.hasta = (formValues.AUTOCOMPLETE_TO !== undefined) ? formValues.AUTOCOMPLETE_TO.item.city : receivedData.hasta;
    receivedData.fecha = (formValues.DATEPICKER !== undefined) ? formValues.DATEPICKER : receivedData.fecha;
    receivedData.asientos = (formValues.STEPPER !== undefined) ? formValues.STEPPER : receivedData.asientos;
    receivedData.precio = (formValues.PRICE !== undefined) ? formValues.PRICE : receivedData.precio;

    console.log(receivedData)

    fetchViajes(receivedData.desde,
      receivedData.hasta,
      receivedData.fecha,
      receivedData.precio, 
      receivedData.asientos);
  };

  const handleChange = (event) => {
    setRadioValue((event.target).value);
    filterTravel((event.target).value)
  };

  const handleBuscar = () => {
    handlePrevViajes()
    setRadioValue(0)
  }

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

  const handlePrevViajes = () => {
    setPrevViajes([])
    setPageNumber(0)
    setCardsNumber(5)
  }

  function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      let chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  }

  async function handleContacto(data) {
    const viajesGetEndPoint =
      URLS.GET_TRIPS_URL + "/" + data;

    toast.promise((axios.get(viajesGetEndPoint, requestConfig)
      .then((response) => {
        window.location.replace(
          "https://wa.me/"
          + response.data.phoneNumber
          + "?text=%20Hola!%20Te%20escribo%20desde%20Friendly%20Travel!%20Me%20gustaría%20unirme%20a%20tu%20viaje%20"
          + "de%20la%20fecha%20"
          + response.data.tripDate
          + "%20desde%20"
          + response.data.origin
          + "%20a%20"
          + response.data.destination
        );
      }
      ).catch((error) => {
        console.error(error);
      }))
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
            return toast.error('Error')
          }
        }
      });


  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries: ["places"],
  });

  const handleToggle = (value) => () => {
    setRadioValue(value);
    filterTravel(value)
  };

  async function fetchViajes(origin, destination, date, price, seats) {
    if (formValidate(origin, destination, date, price, seats)) {
      const viajesGetEndPoint =
        URLS.GET_TRIPS_URL +
        "?origin=" +
        origin +
        "&destination=" +
        destination +
        "&tripDate=" +
        moment(date).format("DD-MM-YYYY") +
        (price !== "" ? "&price=" + price : "") +
        (seats !== "" ? "&availablePlaces=" + seats : "");

      toast.promise(axios.get(viajesGetEndPoint)
        .then((response) => {
          if (
            response.data.message ===
            "No hay viajes que cumplan con las condiciones seleccionadas."
          ) {
            setViajes();
            toast.error("No hay viajes que cumplan con las condiciones seleccionadas.");
          } else {
            setViajes([...response.data]);
            setViajesSorted([...response.data]);
          }
        }).catch((error) => {
          console.error(error);
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
  }

  function filterTravel(value) {
    setViajesSorted([...viajes]);
    if ((value == 5)) {
      handlePrevViajes()
      const viajesSortedByDate = viajesSorted.sort((a, b) => new Date(...a.tripDate.split('-').reverse()) - new Date(...b.tripDate.split('-').reverse()))
      if ([...viajes] !== [...viajesSortedByDate]) {
        setViajesSorted([...viajes]);
      }
      setViajesSorted([...viajesSortedByDate]);
    } else if (value == 6) {
      handlePrevViajes()
      const viajesSortedByPrice = viajesSorted.sort((a, b) => a.price - b.price)
      if ([...viajes] !== [...viajesSortedByPrice]) {
        setViajesSorted([...viajes]);
      }
      setViajesSorted([...viajesSortedByPrice]);
    } else if (value == 7) {
      handlePrevViajes()
      const viajesSortedBySeat = viajesSorted.sort((a, b) => b.availablePlaces - a.availablePlaces)
      if ([...viajes] !== [...viajesSortedBySeat]) {
        setViajesSorted([...viajes]);
      }
      setViajesSorted([...viajesSortedBySeat]);
    }
  }

  const lastCardElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])]).length < viajesSorted.length) {
        setPrevViajes([... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])])
        setPageNumber(pageNumber + 1)
        setCardsNumber(cardsNumber + 5)
      } else {
        setVisible(true)
      }
    })
    if (node) observer.current.observe(node)
  })

  if (!isLoaded) {
    return <>Cargando...</>;
  }

  return (
    <>
      <main>
        <div style={{display: "flex",
    "flex-direction": "column",
    "align-items": "center"}}
        >
          <SearchForm
            onSubmit={handleFormSubmit}
            className="form-inline"
            initialFrom={ receivedData.desde }
            initialTo={ receivedData.hasta}
            disabledFrom={false}
            disabledTo={false}
            showVehicleField={false}
            autocompleteFromPlaceholder="Desde"
            autocompleteToPlaceholder="Hasta"
            renderDatePickerComponent={props => <DatePicker {...props}
              numberOfMonths={2}
              orientation={DatePickerOrientation.HORIZONTAL}
              locale="es-UY"
              weekdaysShort={weekdaysShort('es-UY')}
              weekdaysLong={weekdaysLong('es-UY')}
              months={months('es-UY')}
            />
            }
            renderAutocompleteFrom={props => <AutoCompleteUy {...props} embeddedInSearchForm />}
            renderAutocompleteTo={props => <AutoCompleteUy {...props} embeddedInSearchForm />}
            datepickerProps={{
              defaultValue: ((receivedData.fecha !== undefined) ? receivedData.fecha : new Date().toISOString()),
              format: value => new Date(value).toLocaleDateString(),
            }}
            stepperProps={{
              defaultValue: ((receivedData.asientos !== undefined) ? receivedData.asientos : ""),
              min: 1,
              max: 4,
              title: 'Elija la cantidad de asientos que desea reservar',
              increaseLabel: 'Incrementar la cantidad de asientos en 1',
              decreaseLabel: 'Decrementar la cantidad de asientos en 1',
              format: value => `${value} asiento(s)`,
              confirmLabel: 'Aceptar',
            }}
            priceProps={{
              defaultValue: ((receivedData.precio !== undefined) ? receivedData.precio : ""),
              min: 0,
              title: 'Precio',
              format: value => `${value} UYU`,
              confirmLabel: 'Aceptar',
            }}
          />
        </div>
        <br />
        <br />
        <div>
          <div className="wrapper">
            {viajes !== undefined && viajes.length > 0 && (
              <div className="gradient-list">
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <nav aria-label="main mailbox folders">
                    <h2>Ordenar por:</h2>
                    <List>
                      <RadioGroup value={radioValue} onChange={handleChange}>
                        {[5, 6, 7].map((value) => {
                          const labelId = `checkbox-list-secondary-label-${value}`;
                          return (
                            <ListItem
                              key={value}
                              onClick={handleToggle(value)}
                              secondaryAction={
                                <Radio
                                  value={value}
                                  edge="end"
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              }
                              disablePadding
                            >
                              <ListItemButton>
                                <ListItemIcon>
                                  {
                                    (value === 5) ? <AccessTimeIcon /> :
                                      (value === 6) ? <PaidIcon /> :
                                        (value === 7) ? <AirlineSeatReclineNormalIcon /> :
                                          <></>
                                  }
                                </ListItemIcon>
                                {
                                  (value === 5) ? <ListItemText primary="Salida más temprana" /> :
                                    (value === 6) ? <ListItemText primary="Precio más bajo" /> :
                                      (value === 7) ? <ListItemText primary="Mayor cantidad de asientos" /> :
                                        <></>
                                }

                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </RadioGroup>
                    </List>
                    <Divider />
                  </nav>
                </Box>
              </div>
            )}
            <CardsStackSection>
              {viajes &&
                ((((sliceIntoChunks(viajesSorted, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])] : []))
                  .map((user, index) => (
                    ([... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])].length === index + 1) ? (
                      <div ref={lastCardElement}>
                        <TripCard
                          href={'#'}
                          itinerary={
                            <Itinerary>
                              <Address label={user.origin.label} subLabel={user.origin.labelInfo} />
                              <Address label={user.destination.label} subLabel={user.destination.labelInfo} />
                            </Itinerary>
                          }
                          price={`${user.price} UYU`}
                          originalPrice={{
                            label: 'availablePlaces',
                            value: `${user.availablePlaces} asiento(s)`,
                          }}
                          mainTitle={user.tripDate}
                          button={
                            getToken() !== null ? (
                              <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                                <li style={{ marginRight: '10px' }}>
                                  <Button onClick={() => handleContacto(user.tripId)}> Contactar </Button>
                                </li>
                                <li>
                                  <Button onClick={() => handleContacto(user.tripId)} status="green"> Reservar </Button>
                                </li>
                              </ul>) : (<br />)
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <TripCard
                          href={'#'}
                          itinerary={
                            <Itinerary>
                              <Address label={user.origin.label} subLabel={user.origin.labelInfo} />
                              <Address label={user.destination.label} subLabel={user.destination.labelInfo} />
                            </Itinerary>
                          }
                          price={`${user.price} UYU`}
                          originalPrice={{
                            label: 'availablePlaces',
                            value: `${user.availablePlaces} asiento(s)`,
                          }}
                          mainTitle={user.tripDate}
                          button={
                            getToken() !== null ? (
                              <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                                <li style={{ marginRight: '10px' }}>
                                  <Button onClick={() => handleContacto(user.tripId)}> Contactar </Button>
                                </li>
                                <li>
                                  <Button onClick={() => handleContacto(user.tripId)} status="green"> Reservar </Button>
                                </li>
                              </ul>) : (<br />)
                          }
                        />
                      </div>
                    )
                  ))
              }
            </CardsStackSection>
            <div className="load-more-message-container">
              {visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

