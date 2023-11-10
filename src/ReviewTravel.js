import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@rodrisu/friendly-ui/build/button';
import axios from "axios";
import { URLS } from "./utils/urls";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { sliceIntoChunks } from './components/Utilities';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { toast } from "react-toastify";
import { getToken, getUser } from "./components/service/AuthService";

import { styled } from "@mui/material/styles"
import Rating from "@mui/material/Rating"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined"
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied"
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied"
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral"
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied"
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied"
  }
}

function IconContainer(props) {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

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
    // setPassengers([{
    //   userDriver: {
    //     firstName: "Pedro GuaGa",
    //     email: "nose@gmail.com",

    //   }
    // }])
    setPassengersQuantity(receivedData.passengersQuantity)
    setPassengers(receivedData.passengers)
    // setPassengersQuantity(1)
    fetchReview()
  }, [])

  async function fetchReview(email, value, id) {
    if((email && value && id) !== undefined) {
      const reviewGetEndPoint =
        URLS.USER_HISTORY + "/" +
        email +
        "/ratings"

      console.log(id)
      // console.log(value)

      // toast.promise(axios.post(reviewGetEndPoint, {score: value, tripId: id} ,requestConfig)
      //   .then((response) => {
      //     console.log(response)
      //     // if (
      //     //   response.data.message ===
      //     //   "Usuario calificado correctamente."
      //     // ) {
      //     //   setViajes();
      //     //   toast.error("No hay viajes que cumplan con las condiciones seleccionadas.");
      //     // } else {
      //     //   toast.error(response);
      //     // }
      //   }).catch((error) => {
      //     console.error(error);
      //   })
      //   ,
      //   {
      //     pending: {
      //       render() {
      //         return "Cargando"
      //       },
      //       icon: true,
      //     },
      //     error: {
      //       render({ data }) {
      //         toast.error(data.response.data.message);
      //       }
      //     }
      //   });
    }
  }

  return (
    <div className="wrapper">
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
                      <Rating
                      name="highlight-selected-only"
                      defaultValue={3}
                      IconContainerComponent={IconContainer}
                      getLabelText={(value) => customIcons[value].label}
                      highlightSelectedOnly
                      sx = {{
                        "*": {
                          fontSize: "3.5rem"
                        },
                        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                          color: "theme.palette.action.disabled",
                      
                        }
                      }}
                      onChange={(event, newValue) => {
                        fetchReview(user.userDriver.email, newValue, user); // CAMBIAR ESTO POR SOLO TRIPID NO USER
                      }}
                    />
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
                          <Rating
                            name="highlight-selected-only"
                            defaultValue={3}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value) => customIcons[value].label}
                            highlightSelectedOnly
                            sx = {{
                              "*": {
                                fontSize: "3.5rem"
                              },
                              "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                                color: "theme.palette.action.disabled",
                            
                              }
                            }}
                            onChange={(event, newValue) => {
                              fetchReview(user.userDriver.email, newValue, user); // CAMBIAR ESTO POR SOLO TRIPID NO USER
                            }}
                          />
                        </li>
                      </ul>
                    }
                  />
                </div>
              )
            ))
        }
      </CardsStackSection>

    </div>
  );
};

export default ReviewTravel;
