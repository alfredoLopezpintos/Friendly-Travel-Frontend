import React from 'react';
import '../App.css';
import { Button } from './Button';
import './ListadoDeViajes.css';
import { useState } from 'react';
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import configData from '../configData.json'
import axios from 'axios';
import { render } from '@testing-library/react';

export default function ListadoDeViajes() {

  const [viajes, setViajes] = React.useState([])

  async function fetchViajes() {
    const viajesGetEndPoint = configData.AWS_REST_ENDPOINT + "/trips?origin=minas&destination=artigas&tripDate=2022-12-24"

    try {
      const response = await axios.get(viajesGetEndPoint);
      console.log(response.data)
      setViajes(response.data)

    } catch(error) {
      console.error(error);
    }
  }

  function transformDate(dateObj) {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return (year + "-" + month + "-" + day);
  }

  React.useEffect(() => {
    fetchViajes()
  }, [])

  render()
  return (
    <main>
      <ol class="gradient-list">
    {viajes && viajes.map(user =>
                  <li>
                    <div className='destination'>
                      <div>                        
                        ORIGEN: {user.origin}
                      </div>
                      <div>
                        FECHA: {user.tripDate}
                      </div>
                    </div>
                    <div className='destination'>
                      <div>                      
                        DESTINO: {user.destination}
                      </div>
                      <div>
                        {user.arrival_time}
                      </div>
                    </div>
                    <div class='social-media-wrap'>
                      <div class='rating'>
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

/*function ListadoDeViajes() {
  const [users, setUsers] = useState([
    { id: 1, price: 123, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 2, price: 3333, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 3, price: 444, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 4, price: 22, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" },
    { id: 5, price: 1111, rating: 5, from: 'Montevideo', to: 'Rivera', vehicle: "asd123", time: "12:20", arrival_time: "17:30" }
]);
  return (
    <main>
      <ol class="gradient-list">
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
                    <div class='social-media-wrap'>
                      <div class='rating'>
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
