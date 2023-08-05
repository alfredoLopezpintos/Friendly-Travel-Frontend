import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { registerLocale } from "react-datepicker";
import { BsCurrencyDollar } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";
import "./ListadoDeViajes.css";
import { transformDate, isNumber } from "../Utilities";
import { getToken } from "../service/AuthService";
import configData from "../../configData.json";
import { URLS } from "../../utils/urls";
import es from "date-fns/locale/es";
import moment from "moment";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// ICONS
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';

registerLocale("es", es);

export default function ListadoDeViajes() {
  const [viajes, setViajes] = useState([]);
  const { register, handleSubmit } = useForm();
  const [date] = useState(new Date());
  const onError = (errors, e) => console.log(errors, e);
  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();

  // -- FILTERS --
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: configData.MAPS_KEY,
    libraries: ["places"],
  });

  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

  if (!isLoaded) {
    return <>Cargando...</>;
  }

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);
    data.tripDate = dateRef.current.value;
    data.destination = destiantionRef.current.value;
    data.origin = originRef.current.value;
    data.tripDate = moment(data.tripDate).format("DD-MM-YYYY");

    if (data.tripDate === "" || data.origin === "" || data.destination === "") {
      toast.error("La busqueda debe tener por lo menos origen, destino y fecha");
      return false;
    } else if (!isNumber(data.price) && data.price !== "") {
      toast.error("Precio incorrecto");
    } else if (!isNumber(data.availablePlaces) && data.availablePlaces !== "") {
      toast.error("Asientos incorrectos");
    } else if (!moment(data.tripDate, "DD-MM-YYYY").isValid()) {
      toast.error("Fecha inválida");
    } else if (moment(data.tripDate) < moment(today)) {
      toast.error("La fecha del viaje no puede ser anterior al día actual");
    } else {
      return true;
    }
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

  async function fetchViajes(data, e) {
    data.tripDate = transformDate(date);

    if (formValidate(data)) {
      const viajesGetEndPoint =
        URLS.GET_TRIPS_URL +
        "?origin=" +
        data.origin +
        "&destination=" +
        data.destination +
        "&tripDate=" +
        data.tripDate +
        (data.price !== "" ? "&price=" + data.price : "") +
        (data.availablePlaces !== "" ? "&availablePlaces=" + data.availablePlaces : "");

      toast.promise(axios.get(viajesGetEndPoint)
        .then((response) => {
          if (response.data.message === "No hay viajes que cumplan con las condiciones seleccionadas.") {
            setViajes();
            toast.error("No hay viajes que cumplan con las condiciones seleccionadas.");
          } else {
            setViajes(response.data);
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

  return (
    <>
      <main>
        <div>
          <form
            className="form-inline"
            onSubmit={handleSubmit(fetchViajes, onError)}
          >
            <div className="field1">
              <Autocomplete
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <div>
                  <label>ORIGEN: </label>
                  <br />
                  <input
                    {...register("origin")}
                    placeholder="Seleccione un origen"
                    ref={originRef}
                  />
                </div>
              </Autocomplete>
              <Autocomplete
                options={{ componentRestrictions: { country: "uy" } }}
              >
                <div>
                  <label>DESTINO: </label>
                  <br />
                  <input
                    {...register("destination")}
                    placeholder="Seleccione un destino"
                    ref={destiantionRef}
                  />
                </div>
              </Autocomplete>
              <div>
                <label>FECHA: </label>
                <br />
                <input
                  {...register("tripDate")}
                  type="date"
                  ref={dateRef}
                  min="01-01-2020"
                />
              </div>
              <div>
                <label>ASIENTOS: </label>
                <br />
                <input
                  {...register("availablePlaces")}
                  placeholder="Lugares disponibles"
                  type="number"
                />
              </div>
              <div>
                <label>PRECIO: </label>
                <br />
                <input
                  {...register("price")}
                  placeholder="En pesos uruguayos"
                  type="number"
                />
              </div>
              <button className="btn-submit" type="submit">
                Buscar
              </button>
            </div>
          </form>
        </div>        
        <br />
        <br />

        <div>
        <div className="wrapper">
          <div className="gradient-list">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav aria-label="main mailbox folders">
                <h2>Ordenar por:</h2>
                <List>
                  {[5, 6, 7].map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                      <ListItem
                        key={value}
                        onClick={handleToggle(value)}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggle(value)}
                            checked={checked.indexOf(value) !== -1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        }
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemIcon>
                            {
                            (value === 5) ? <AccessTimeIcon />: 
                            (value === 6) ? <PaidIcon />:
                            (value === 7) ? <DepartureBoardIcon />:
                            <></>
                            }
                          </ListItemIcon>
                          {
                            (value === 5) ? <ListItemText primary="Salida más temprana" />:
                            (value === 6) ? <ListItemText primary="Precio más bajo" />:
                            (value === 7) ? <ListItemText primary="Viaje más corto" />:
                            <></>
                          }
                          
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
                <Divider />
              </nav>
            </Box>
          </div>
          <ol className="gradient-list">
          {viajes &&
            viajes.map((user) => (
              <li>
                <div className="social-media-wrap">
                  <div className="rating">
                    <img src={require("../../assets/images/asiento.png")} alt="fecha" width={20}></img> {user.availablePlaces}
                  </div>
                  <div className="price">
                    <BsCurrencyDollar />
                    {user.price}
                  </div>
                  <div><img src={require("../../assets/images/fecha.png")} alt="fecha" width={20}></img> {user.tripDate}</div>
                </div>
                <div className="destination">
                  <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> ORIGEN: <br />{user.origin}</div>
                  <br />
                </div>
                <div className="destination">
                  <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> DESTINO: <br />{user.destination}</div>
                  <div>{user.arrival_time}</div>
                </div>
                {getToken() !== null ? (
                  <div className="contacto">
                    <a onClick={() => handleContacto(user.tripId)} >
                      <img src={require("../../assets/images/wpp.png")} alt="travel logo" ></img>
                    </a>
                  </div>
                ) : (<br />)}
              </li>
            ))}
        </ol>
      </div>
        </div>

        

      </main>

      
    </>
  );
}
