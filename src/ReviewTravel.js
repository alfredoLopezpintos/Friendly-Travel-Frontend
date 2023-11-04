import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@rodrisu/friendly-ui/build/button';
import axios from "axios";
// import { URLS } from "../../utils/urls";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { sliceIntoChunks } from './components/Utilities';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { toast } from "react-toastify";
import { getToken, getUser } from "./components/service/AuthService";

const ReviewTravel = () => {
  const location = useLocation();
  const receivedData = location.state?.data ||
  {
    passengersQuantity: undefined,
    passengers: undefined
  };

  const [passengers, setPassengers] = React.useState([]);
  const [passengersQuantity, setPassengersQuantity] = React.useState(0);
  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
      "Content-Type": "application/json",
    },
  };


  const [prevViajes, setPrevViajes] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [cardsNumber, setCardsNumber] = React.useState(5);
  const observer = useRef();

  const lastCardElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])]).length < passengers.length) {
        setPrevViajes([... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])])
        setPageNumber(pageNumber + 1)
        setCardsNumber(cardsNumber + 5)
      } else {
        // setVisible(true)
      }
    })
    if (node) observer.current.observe(node)
  })

  // const handleReview = () => {
  //   ((((sliceIntoChunks(passengers, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])] : []))
  //   .map((user, index) => (
  //     ([... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])].length === index + 1) ? console.log(user.userDriver) : console.log("NO")
  //   ))
  // };

  useEffect(() => {
    setPassengers([{
      userDriver: {
        firstName: "Pedro GuaGa",
        email: "nose@gmail.com"
      }}])
    // setPassengersQuantity(receivedData.passengersQuantity)
    // setPassengers(receivedData.passengers)
    setPassengersQuantity(1)
  }, [])

  return (
    <>
    {/* <Button onClick={() => handleReview()}>
      A
    </Button> */}
      <CardsStackSection>
        {(passengers) &&
          ((((sliceIntoChunks(passengers, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])] : []))
            .map((user, index) => (
              ([... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])].length === index + 1) ? (
                <div ref={lastCardElement}>
                  <TripCard
                    driver={user.userDriver}
                    href={'#'}
                    originalPrice={{}}
                    button={
                      <Button onClick={() => console.log(user)} status="green"> Calificar </Button>
                    }
                  />
                </div>
              ) : (
                <div>
                  <TripCard
                    driver={user.userDriver}
                    href={'#'}
                    originalPrice={{}}
                    price={
                      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginRight: '10px' }}>
                          <Button onClick={() => console.log(user)} status="green"> Calificar </Button>
                        </li>
                      </ul>
                    }
                  />
                </div>
              )
            ))
        }
      </CardsStackSection>
    </>
  );
};

export default ReviewTravel;
