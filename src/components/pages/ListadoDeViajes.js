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
import { formValidate, sliceIntoChunks } from "../Utilities";
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
import { SearchForm, SearchFormDisplay } from '@rodrisu/friendly-ui/build/searchForm';
import { AutoCompleteUy } from "../AutoCompleteUy";
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { Button, ButtonStatus } from '@rodrisu/friendly-ui/build/button';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { Address, Itinerary } from '@rodrisu/friendly-ui/build/itinerary';
import { weekdaysShort, weekdaysLong, months } from "../DatePickerProps.js";
import { useLocation, useHistory } from 'react-router-dom';
import ModalInfo from '../ModalReservarViaje';
import { BaseSection, SectionContentSize } from '@rodrisu/friendly-ui/build/layout/section/baseSection';
import { MediaSizeProvider } from '@rodrisu/friendly-ui/build/_utils/mediaSizeProvider';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
registerLocale("es", es);

export default function ListadoDeViajes() {
  const history = useHistory();
  const [viajes, setViajes] = useState([]);
  const [viajesSorted, setViajesSorted] = useState([]);
  const [prevViajes, setPrevViajes] = React.useState([])
  const [pageNumber, setPageNumber] = React.useState(0)
  const [cardsNumber, setCardsNumber] = React.useState(5)
  const [visible, setVisible] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState(0);
  const [displayModal, setDisplayModal] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const observer = useRef();
  const handleClose = () => {
    setDisplayModal(false);
  };

  const location = useLocation();
  const receivedData = location.state?.data ||
  {
    desde: undefined,
    hasta: undefined,
    fecha: undefined,
    asientos: undefined,
    precio: undefined
  };

  useEffect(() => {
    if ((receivedData.desde !== undefined) && (receivedData.hasta !== undefined) && (receivedData.fecha !== undefined)) {
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

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
      "Content-Type": "application/json",
    },
  };

  const handlePrevViajes = () => {
    setPrevViajes([])
    setPageNumber(0)
    setCardsNumber(5)
  }

  async function handleAppointment(data) {
    setModalData(data)
    setModal(true)
  }

  async function handleContacto(data) {
    const contactoGetEndPoint =
      URLS.GET_TRIPS_URL + "/" + data;

    toast.promise((axios.get(contactoGetEndPoint, requestConfig)
      .then((response) => {
        const data = {
          phone: response.data.phoneNumber,
          date: response.data.tripDate,
          origin: response.data.origin,
          destination: response.data.destination
        };

        const queryString = Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&');

        const redirectUrl = `/redirecting?${queryString}`;

        window.open(redirectUrl, '_blank');
      }
      ).catch((error) => {
        console.error(error);
        toast.error(error.response.data.message);
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
    language: "es",
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
    <div className="everythingWrapper" style={{ "display": "grid", "grid-template-columns": "0.5fr 500px 700px 0.5fr" }}>
      <div></div>
      <aside style={{ "padding-top": "2rem", "padding-left": "2rem" }}>
        {(modal === true) ? <ModalInfo setModal={setModal} handlePrevModalClose={handleClose}
          data={modalData} /> : <></>}
        <div style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center"
        }}
        >
          <MediaSizeProvider>
            <BaseSection contentSize={SectionContentSize.LARGE}>
              <SearchForm
                onSubmit={handleFormSubmit}
                className="form-inline"
                initialFrom={receivedData.desde}
                initialTo={receivedData.hasta}
                disabledFrom={false}
                disabledTo={false}
                showVehicleField={false}
                autocompleteFromPlaceholder="Desde"
                autocompleteToPlaceholder="Hasta"
                renderDatePickerComponent={props => <DatePicker {...props}
                  numberOfMonths={1}
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
                  format: value => new Date(value).toLocaleDateString('es-UY', { timeZone: 'UTC' }),
                }}
                stepperProps={{
                  defaultValue: ((receivedData.asientos !== undefined) ? receivedData.asientos : 1),
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
                  format: value => `$ ${value}`,
                  confirmLabel: 'Aceptar',
                }}
                display={SearchFormDisplay.SMALL}
              />
            </BaseSection>
          </MediaSizeProvider>
        </div>
        <br />
        <br />

        {(viajes !== undefined && viajes.length > 0) ? (
          <div style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center"
          }} className="gradient-list">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <h2 style={{ "color": "#172A3A" }}>Ordenar por:</h2>
              <nav style={{ "color": "#172A3A" }} aria-label="main mailbox folders">
                <List>
                  <RadioGroup value={radioValue} onChange={handleChange} style={{ "padding": "20px" }}>
                    {[5, 6, 7].map((value) => {
                      const labelId = `checkbox-list-secondary-label-${value}`;
                      return (
                        <ListItem
                          key={value}
                          onClick={handleToggle(value)}
                          secondaryAction={
                            <Radio
                              sx={{
                                color: "#708C91",
                                '&.Mui-checked': {
                                  color: "#172A3A",
                                }
                              }}
                              value={value}
                              edge="end"
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton>
                            {
                              (value === 5) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Salida más temprana" /> :
                                (value === 6) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Precio más bajo" /> :
                                  (value === 7) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Mayor cantidad de asientos" /> :
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
        ) :

          <div style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center"
          }} className="gradient-list">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <h2 style={{ "color": "#172A3A" }}>Ordenar por:</h2>
              <nav style={{ "color": "#172A3A" }} aria-label="main mailbox folders">
                <List>
                  <RadioGroup value={radioValue} style={{ "padding": "20px" }}>
                    {[5, 6, 7].map((value) => {
                      const labelId = `checkbox-list-secondary-label-${value}`;
                      return (
                        <ListItem
                          key={value}
                          secondaryAction={
                            <Radio
                              disabled
                              edge="end"
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                          disablePadding
                        >
                          <ListItemButton disabled>
                            {
                              (value === 5) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Salida más temprana" /> :
                                (value === 6) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Precio más bajo" /> :
                                  (value === 7) ? <ListItemText sx={{ "font-weight": "bold" }} primary="Mayor cantidad de asientos" /> :
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

        }
      </aside>
      <main style={{ "max-width": "850px", "width": "100%", "overflow-y": "scroll", "max-height": "800px" }}>
        <div className="mainSubContainer" style={{ "padding-top": "1rem" }}>
          <CardsStackSection>
            {viajes &&
              ((((sliceIntoChunks(viajesSorted, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])] : []))
                .map((user, index) => (
                  ([... new Set([...prevViajes, ...sliceIntoChunks(viajesSorted, 5)[pageNumber]])].length === index + 1) ? (
                    <div ref={lastCardElement}>
                      <TripCard
                        driver={user.driver}
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin.label} subLabel={user.origin.labelInfo} />
                            <Address label={user.destination.label} subLabel={user.destination.labelInfo} />
                          </Itinerary>
                        }
                        price={(user.price != 0) ? `$ ${user.price}` : 'GRATIS'}
                        originalPrice={{
                          label: 'availablePlaces',
                          value: `${user.availablePlaces} asiento(s)`,
                        }}
                        mainTitle={user.tripDate}
                        button={
                          getToken() !== null ? (
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                              <li style={{ marginRight: '10px' }}>
                                <Button onClick={() => handleContacto(user.tripId)} status={ButtonStatus.SECONDARY}> Contactar <WhatsAppIcon style={{ "margin-left": "7px", "margin-right": "0px" }} /></Button>
                              </li>
                              <li>
                                <Button onClick={() => handleAppointment(user)}> Reservar </Button>
                              </li>
                            </ul>) : (<br />)
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <TripCard
                        driver={user.driver}
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin.label} subLabel={user.origin.labelInfo} />
                            <Address label={user.destination.label} subLabel={user.destination.labelInfo} />
                          </Itinerary>
                        }
                        price={(user.price != 0) ? `$ ${user.price}` : 'GRATIS'}
                        originalPrice={{
                          label: 'availablePlaces',
                          value: `${user.availablePlaces} asiento(s)`,
                        }}
                        mainTitle={user.tripDate}
                        button={
                          getToken() !== null ? (
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                              <li style={{ marginRight: '10px' }}>
                                <Button onClick={() => handleContacto(user.tripId)} status={ButtonStatus.SECONDARY}> Contactar <WhatsAppIcon style={{ "margin-left": "7px", "margin-right": "0px" }} /></Button>
                              </li>
                              <li>
                                <Button onClick={() => handleAppointment(user)}> Reservar </Button>
                              </li>
                            </ul>) : (<br />)
                        }
                      />
                    </div>
                  )
                ))
            }
          </CardsStackSection>
          <div style={{ "textAlign": "center" }}>
            <div className="load-more-message-container">
              {visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></>}
              {!visible && <>
                <img
                  className="EncuentraTuViaje"
                  style={{"padding-top": "20%"}}
                  src={require("../../assets/images/SearchLogo.png")}
                  alt="travel logo"
                  width={250}
                ></img> &nbsp;
              </>}
            </div>
          </div>
        </div>
      </main>
      <div></div>
    </div>
  );
}