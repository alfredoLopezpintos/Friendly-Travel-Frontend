import React from 'react';
import '../../App.css';
import { Button } from '../../components/Button';
import './ListadoDeViajes.css';
import { useState } from 'react';
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import configData from '../../configData.json'
import axios from 'axios';
import { render } from '@testing-library/react';
import { useForm } from "react-hook-form";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerComponent, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';
registerLocale("es", es);

export default function ListadoDeViajes() {

  const [viajes, setViajes] = React.useState([]);
  const { register, handleSubmit } = useForm();
  const [date, setDate] = useState(new Date());
  //const [seat, setSeat] = useState(1);
  const handleDateChange = date => setDate(date);
  const onSubmit = (data, e) => fetchViajes(data, e);
  const onError = (errors, e) => console.log(errors, e);

  const LoadingIndicator = props => {
     const { promiseInProgress } = usePromiseTracker();

     return (
      promiseInProgress && 
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        >
      <ThreeDots color="#2BAD60" height="100" width="100" />
    </div>
     );  
  }

  function isNumber(str) {
    if (str.trim() === '') {
      return false;
    }
  
    return !isNaN(str);
  }

  function formValidate(data) {
    const dateObj = new Date();
    const today = transformDate(dateObj);

    if(data.tripDate === "" ||
     data.origin === "" ||
     data.destination === "") {
        alert("La busqueda debe tener por lo menos origen, destino y fecha.")
        return false;
    }else if (!isNumber(data.price) && data.price !== ""){
      alert("El precio debe ser un número.")
    }else if (!isNumber(data.availablePlaces) && data.availablePlaces !== ""){
      alert("Asientos debe ser un número.")
    }else if (!moment(data.tripDate).isValid()){
      alert("Fecha inválida.")
    }else if (moment(data.tripDate) < moment(today)){
      alert("La fecha del viaje no puede ser anterior al día actual.")
    }else {
      return true;
    }
  }

  async function fetchViajes(data, e) {
    data.tripDate = transformDate(date)

    if(formValidate(data)) {
          //const viajesGetEndPoint = configData.AWS_REST_ENDPOINT + "/trips?origin=minas&destination=artigas&tripDate=2022-12-24"
      
      const viajesGetEndPoint = configData.AWS_REST_ENDPOINT + 
      "/trips?origin=" + data.origin + "&destination=" + data.destination +
      "&tripDate=" + data.tripDate + "&price=" + data.price +
      "&availablePlaces=" + data.availablePlaces;

      try {
        const response = await trackPromise(axios.get(viajesGetEndPoint));
        console.log(response.data)
        if(response.data.message ===
          "No hay viajes que cumplan con las condiciones seleccionadas.") {
            setViajes()
            alert("No hay viajes que cumplan con las condiciones seleccionadas.")
          } else {
            setViajes(response.data)
          }

      } catch(error) {
        console.error(error);
      }
    }
  }

  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    if (/^\d$/.test(dateObj.getUTCDate()))  {
      day = "0" + dateObj.getUTCDate();
    }
    return (day + "-" + month + "-" + year);
  }

  render()
  return (
    <main>
      <div>
        <form className="form-inline" onSubmit={handleSubmit(onSubmit, onError)}>
          
          <div className = "field1">
            <div>
              <label>ORIGEN: </label>
              <input {...register("origin")} placeholder="Origen"/>
            </div>
            <div>
              <label>DESTINO: </label>
              <input {...register("destination")} placeholder="Destino"/>
            </div>
            <div>
            <label>FECHA: </label>
              <DatePickerComponent placeholderText={'Fecha'}
              selected={date} onChange={handleDateChange} locale="es" />
            </div>
            <div>
              <label>ASIENTOS: </label>
              <input {...register("availablePlaces")} placeholder="Lugares Disponibles"/>
            </div>
            <div>
              <label>PRECIO: </label>
              <input {...register("price")} placeholder="Precio (En Pesos Uruguayos)"/>
            </div>
            <button className="btn-submit" type="submit">Buscar</button>
          </div>
        </form>
      </div>
      <br /><br />
      <ol className="gradient-list">
      <LoadingIndicator/>
    {viajes && viajes.map(user =>
                  <li>
                    <div className='destination'>
                      <div>                        
                        ORIGEN: {user.origin.toUpperCase()}
                      </div>
                      <div>
                        FECHA: {user.tripDate}
                      </div>
                    </div>
                    <div className='destination'>
                      <div>                      
                        DESTINO: {user.destination.toUpperCase()}
                      </div>
                      <div>
                        {user.arrival_time}
                      </div>
                    </div>
                    <div className='social-media-wrap'>
                      <div className='rating'>
                      <MdOutlineAirlineSeatReclineNormal />{user.availablePlaces}
                      </div>
                      <div className='price'>
                        {user.price}<BsCurrencyDollar />                     
                      </div>
                    </div>               
                  </li>
                )}
      </ol>
    </main>
  );
}

/*
        <form>
          <div>
            <label>ORIGEN: </label>
            <input placeholder="Origen" name="going" />
          </div>
          <div>
            <label>DESTINO: </label>
            <input placeholder="Destino" name="going" />
          </div>
          <div>
            <label>FECHA: </label>
            <input placeholder="mm/dd/yyyy" id="input-end" />
          </div>
          <div>
            <label>PRECIO: </label>
            <input placeholder="En Pesos Uruguayos ($)" name="going" />
          </div>
          <div>
            <label>ASIENTOS: </label>
            <input placeholder="Destino" name="going" />
          </div>
          <button className="btn-submit" type="submit">search</button>
        </form>

function ListadoDeViajes() {
  const [users, setUsers] = useState([
    { id: 1, price: 123, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 2, price: 3333, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 3, price: 444, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 4, price: 22, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 5, price: 1111, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" }
]);
  return (
    <main>
      <ol className="gradient-list">
    {users && users.map(user =>
                  <li>
                    <div className='destination'>
                      <div>                        
                        {user.from}
                      </div>
                      <div>
                        {user.time}
                      </div>
                    </div>
                    <div className='destination'>
                      <div>                      
                        {user.to}
                      </div>
                      <div>
                        {user.arrival_time}
                      </div>
                    </div>
                    <div className='social-media-wrap'>
                      <div className='rating'>
                        {user.rating}<BsFillStarFill></BsFillStarFill>
                      </div>
                      <div className='price'>
                        {user.price}<BsCurrencyDollar></BsCurrencyDollar>                        
                      </div>
                    </div>               
                  </li>
                )}
      </ol>
    </main>

  );
}

export default ListadoDeViajes;*/
