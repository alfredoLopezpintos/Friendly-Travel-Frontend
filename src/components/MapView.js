import React from "react";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";

function MapView({ directionsResponse }) {
  const containerStyle = {
    width: "100%",
    height: "700px",
    position: "fixed",
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: -32.522779, lng: -55.765835 }}
      zoom={7}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
    </GoogleMap>
  );
}

export default MapView;
