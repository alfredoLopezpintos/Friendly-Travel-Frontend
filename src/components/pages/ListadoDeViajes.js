import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { render } from "@testing-library/react";
import axios from "axios";
import es from "date-fns/locale/es";
import moment from "moment";
import React, { useRef, useState, useCallback } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { BsCurrencyDollar } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "../../App.css";
import { transformDate, isNumber } from "../Utilities"
import configData from "../../configData.json";
import "./ListadoDeViajes.css";
import Moment from "moment";
import { getToken } from "../service/AuthService";
import TextItem from "../TextItem";

registerLocale("es", es);

export default function ListadoDeViajes() {
  const [viajes, setViajes] = React.useState([]);
  const { register, handleSubmit } = useForm();
  const [date, setDate] = useState(new Date());
  const handleContacto = (data) => fetchContacto(data);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);
  const [libraries] = useState(["places"]);
  const originRef = useRef();
  const destiantionRef = useRef();
  const dateRef = useRef();
  const [prevViajes, setPrevViajes] = React.useState([])
  const [pageNumber, setPageNumber] = React.useState(0)
  const [cardsNumber, setCardsNumber] = React.useState(5)
  const [visible, setVisible] = React.useState(false)
  const observer = useRef()

  function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
  }

  const lastCardElement = useCallback(node => {
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajes, ...sliceIntoChunks(viajes, 5)[pageNumber]])]).length < viajes.length) {
        setPrevViajes([... new Set([...prevViajes, ...sliceIntoChunks(viajes, 5)[pageNumber]])])
        setPageNumber(pageNumber + 1)
        setCardsNumber(cardsNumber + 5)
      } else {
        setVisible(true)
      }      
    })
    if (node) observer.current.observe(node)
  })

  const handlePrevViajes = () => {
    setPrevViajes([])
    setPageNumber(0)
    setCardsNumber(5)    
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD_KubkgZ_9WoPEAX0mN-Wa9dEkfxgUzbs',
    libraries,
  });
  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
    },
  };

  if (!isLoaded) {
    return <>loading...</>;
  }

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);
    data.tripDate = dateRef.current.value;
    data.destination = destiantionRef.current.value;
    data.origin = originRef.current.value;
    data.tripDate = Moment(data.tripDate).format("DD-MM-YYYY");

    if (data.tripDate === "" || data.origin === "" || data.destination === "") {
      toast.error(
        "La busqueda debe tener por lo menos origen, destino y fecha"
      );
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

  async function fetchContacto(data) {

    const viajesGetEndPoint =
        configData.AWS_REST_ENDPOINT +
        "/trips/" + data;

      toast.promise((axios.get(viajesGetEndPoint, requestConfig)
        .then((response) => {
          console.log(viajesGetEndPoint)
          window.location.replace("https://wa.me/"+ response.data.phoneNumber +"?text=%20Hola!%20Te%20escribo%20desde%20Friendly%20Travel!%20Me%20gustaría%20unirme%20a%20tu%20viaje%20"+
        "de%20la%20fecha%20" + response.data.tripDate + "%20desde%20" + response.data.origin +
        "%20a%20" + response.data.destination);
        }        
      ).catch ((error) => {
        console.error(error);
      }))
      ,
      {
        pending: {
          render(){
            return "Cargando"
          },
          icon: true,
        },
        error: {
          render({data}){
            return toast.error('Error')
          }
        }
      });


  }

  async function fetchViajes(data, e) {
    data.tripDate = transformDate(date);

    if (formValidate(data)) {
      const viajesGetEndPoint =
        configData.AWS_REST_ENDPOINT +
        "/trips?origin=" +
        data.origin +
        "&destination=" +
        data.destination +
        "&tripDate=" +
        data.tripDate +
        "&price=" +
        data.price +
        "&availablePlaces=" +
        data.availablePlaces;

        toast.promise(axios.get(viajesGetEndPoint)
        .then((response) => {
          if (
            response.data.message ===
            "No hay viajes que cumplan con las condiciones seleccionadas."
            ) {
            setViajes();
            toast.error("No hay viajes que cumplan con las condiciones seleccionadas.");
          } else {
            setViajes(response.data);
          }
        }).catch ((error) => {
          console.error(error);
        })
        ,
        {
          pending: {
            render(){
              return "Cargando"
            },
            icon: true,
          },
          error: {
            render({data}){
              toast.error(data.response.data.message);
            }
          }
        });
    }
  }

  render();
  return (
    <>
      <main>
        <div>
          <form
            className="form-inline"
            onSubmit={handleSubmit(onSubmit, onError)}
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
              <button className="btn-submit" type="submit" onClick={handlePrevViajes}>
                Buscar
              </button>
            </div>
          </form>
        </div>
        <br />
        <br />
        <ol className="gradient-list">
          { viajes &&
            (((sliceIntoChunks(viajes, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(viajes, 5)[pageNumber]])] : []) //.sort((a, b) => new Date(...a.tripDate.split('-').reverse()) - new Date(...b.tripDate.split('-').reverse())) //Ordena los viajes por fecha de más reciente a más lejano
            .map((user, index) => (
              ([... new Set([...prevViajes, ...sliceIntoChunks(viajes, 5)[pageNumber]])].length === index + 1) ? (
                <li ref={lastCardElement}>
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
                    <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> ORIGEN: <br/>{user.origin}</div>
                    <br/>
                  </div>
                  <div className="destination">
                    <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> DESTINO: <br/>{user.destination}</div>
                    <div>{user.arrival_time}</div>
                    
                  </div>
                  {getToken() !== null ? (
                    <div className="contacto">
                      <a onClick={() => handleContacto(user.tripId)} > 
                      <img src={require("../../assets/images/wpp.png")} alt="travel logo" ></img>
                      </a>
                    </div>
                  ):(<br />)}
                </li>
               ) : (
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
                    <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> ORIGEN: <br/>{user.origin}</div>
                    <br/>
                  </div>
                  <div className="destination">
                    <div><img src={require("../../assets/images/localizador.png")} alt="fecha" width={20}></img> DESTINO: <br/>{user.destination}</div>
                    <div>{user.arrival_time}</div>
                    
                  </div>
                  {getToken() !== null ? (
                    <div className="contacto">
                      <a onClick={() => handleContacto(user.tripId)} > 
                      <img src={require("../../assets/images/wpp.png")} alt="travel logo" ></img>
                      </a>
                    </div>
                  ):(<br />)}
                </li>
               )
            ))
          }
        </ol>
        <div className="load-more-message-container">
          { visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></> }
        </div>
      </main>
      <ToastContainer position="top-center" />
    </>
  );
}

