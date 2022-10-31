import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import styled from "styled-components";

function TravelPreviewer() {
  const MapContainer = styled.div`
    position: relative;
  `;

  const Modal = styled.div`
    position: fixed;
    left: 50%;
    transform: translate(-50%, 20px);
    width: 400px;
    padding: 40px 80px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    z-index: 999;
  `;

  const center = { lat: -32.522779, lng: -55.765835 };
  const containerStyle = {
    width: "100%",
    height: "650px",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDVR1TKOSKqSRL1jUcae_f-6wGvH5qisIM',
    libraries: ["places"],
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const originRef = useRef();
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <>loading...</>;
  }

  async function calculateRoute(e) {
    e.preventDefault();
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  
  return (
    <MapContainer>
        <Modal>
          <div>
            <Autocomplete>
              <input type="text" placeholder="Origen" ref={originRef} />
            </Autocomplete>
            <Autocomplete>
              <input type="text" placeholder="Destino" ref={destiantionRef} />
            </Autocomplete>
            <imput type="date">Fecha</imput>
            <imput type="number">Plazas</imput>
            <button onClick={calculateRoute}>Calculate Route</button>
            <button onClick={clearRoute}>Clear Map</button>
          </div>
          <div>
            <span>Distancia: {distance}</span>
            <span>Duracion: {duration}</span>
          </div>
        </Modal>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
    </MapContainer>
  );
}

export default TravelPreviewer;
