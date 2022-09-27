import React from 'react';
import '../App.css';
import { Button } from './Button';
import './ListadoDeViajes.css';
import { useState } from 'react';
import { BsCurrencyDollar, BsFillStarFill } from "react-icons/bs";

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

export default ListadoDeViajes;
