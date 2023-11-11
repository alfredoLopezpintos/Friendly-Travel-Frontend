import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
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
import TextItem from "./components/TextItem";

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

const ReviewTravel = () => {
  const location = useLocation();
  const history = useHistory();
  const receivedData = location.state?.data ||
  {
    passengersQuantity: undefined,
    passengers: undefined,
    tripId: undefined
  };

  const [passengers, setPassengers] = React.useState([]);
  const [driver, setUserDriver] = React.useState({});
  const [travelId, setTravelId] = React.useState(0);
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
  const [visible, setVisible] = React.useState(false);  
  const [reviewCount, setReviewCount] = React.useState(0);  

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

  useEffect(() => {
    if((receivedData.tripId == undefined)) {
      history.push("/")
    }
    setTravelId(receivedData.tripId)
    setPassengers(receivedData.passengers)
    setUserDriver(receivedData.userDriver)
  }, [])

  async function fetchReview(email, value) {
    if((email && value) !== undefined) {
      const reviewGetEndPoint =
        URLS.USER_HISTORY + "/" +
        email +
        "/ratings"

      toast.promise(axios.post(reviewGetEndPoint, {score: value, tripId: travelId} ,requestConfig)
        .then((response) => {
          if (
            response.data.message ===
            "Usuario calificado correctamente."
          ) {
            // setViajes();
            toast.success("Usuario calificado con éxito");
          } else {
            toast.error(response);
          }
        }).catch((error) => {
          toast.error(error.response.data.message);
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
    <div className="wrapper">
      <CardsStackSection>
        <TripCard
                  driver={driver}
                  href={'#'}
                  originalPrice={{}}
                  button={
                    <Rating
                    name="highlight-selected-only"
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                    sx = {{
                      "*": {
                        fontSize: "2.5rem"
                      },
                      "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                        color: "theme.palette.action.disabled",
                    
                      }
                    }}
                    onChange={(event, newValue) => {
                      if(newValue != null) {
                        fetchReview(driver.email, newValue);
                      }
                    }}
                  />
                  }
                />
        {(passengers) &&
          ((((sliceIntoChunks(passengers, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])] : []))
            .map((user, index) => (
              ([... new Set([...prevViajes, ...sliceIntoChunks(passengers, 5)[pageNumber]])].length === index + 1) ? (
                <div ref={lastCardElement}>
                  {(user.email != getUser()) ? <TripCard
                    driver={user}
                    href={'#'}
                    originalPrice={{}}
                    button={
                      <Rating
                      name="highlight-selected-only"
                      getLabelText={(value) => customIcons[value].label}
                      highlightSelectedOnly
                      sx = {{
                        "*": {
                          fontSize: "2.5rem"
                        },
                        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                          color: "theme.palette.action.disabled",
                      
                        }
                      }}
                      onChange={(event, newValue) => {
                        if(newValue != null) {
                          fetchReview(user.email, newValue);
                        }
                      }}
                    />
                    }
                  /> : <></>}
                </div>
                
              ) : (
                <div>
                {(user.email != getUser()) ? <TripCard
                  driver={user}
                  href={'#'}
                  originalPrice={{}}
                  button={
                    <Rating
                    name="highlight-selected-only"
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                    sx = {{
                      "*": {
                        fontSize: "2.5rem"
                      },
                      "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
                        color: "theme.palette.action.disabled",
                    
                      }
                    }}
                    onChange={(event, newValue) => {
                      if(newValue != null) {
                        fetchReview(user.email, newValue);
                      }
                    }}
                  />
                  }
                /> : <></>}
              </div>
              )
            ))
        }
      </CardsStackSection>

    </div>
  );
};

export default ReviewTravel;
