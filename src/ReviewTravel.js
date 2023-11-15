import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button } from '@rodrisu/friendly-ui/build/button';
import axios from "axios";
import { URLS } from "./utils/urls";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { toast } from "react-toastify";
import { getToken, getUser } from "./components/service/AuthService";
import Rating from "@mui/material/Rating"
import TextItem from "./components/TextItem";

const ReviewTravel = () => {
  const location = useLocation();
  const history = useHistory();
  const receivedData = location.state?.data ||
  {
    passengersQuantity: undefined,
    passengers: undefined,
    tripId: undefined,
    userDriver: undefined
  };

  const [passengers, setPassengers] = React.useState([]);
  const [travelId, setTravelId] = React.useState(0);
  const requestConfig = {
    headers: {
      Authorization: JSON.parse(getToken()),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if((receivedData.tripId == undefined)) {
      history.push("/travelHistory")
    } else if (receivedData.passengers === undefined) {
      setTravelId(receivedData.tripId)
      setPassengers([{ ...receivedData.userDriver, esChofer: true }])
    } else {
      // setPassengers([...receivedData.passengers, { ...receivedData.userDriver, esChofer: true }])
      setTravelId(receivedData.tripId)
      setPassengers([...receivedData.passengers])
    }
  }, [])

  async function fetchReview(email, value) {
    if((email && value) !== undefined) {
      const reviewGetEndPoint =
        URLS.USER_HISTORY + "/" +
        email +
        "/ratings"

      console.log(travelId)

      toast.promise(axios.post(reviewGetEndPoint, {score: value, tripId: travelId} ,requestConfig)
        .then((response) => {
          if (
            response.data.message ===
            "Usuario calificado correctamente."
          ) {
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
        {(passengers)
            .map((user, index) => (
                <div>
                  {(user.email != getUser()) ? <TripCard
                    driver={user}
                    href={'#'}
                    originalPrice={{}}
                    button={
                      <Rating
                      name="highlight-selected-only"
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
            ))
        }
      </CardsStackSection>

    </div>
  );
};

export default ReviewTravel;
