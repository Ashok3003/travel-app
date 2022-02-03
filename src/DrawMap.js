import React, { useEffect, useState } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
function DrawMap() {
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();

    const origin = { lat: 12.9249, lng: 80.1 };
    const destination = { lat: 12.8674, lng: 80.0699 };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING,
        // waypoints: [
        //   {
        //     location: new window.google.maps.LatLng(12.8581101, 80.0646573),
        //   },
        //   {
        //     location: new window.google.maps.LatLng(12.8581101, 80.0646573),
        //   },
        // ],
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("result,", result);
          setDirections(result);
        } else {
          console.error("error", result);
        }
      }
    );
  });

  const GoogleMapExample = withGoogleMap((props) => (
    <GoogleMap
      defaultCenter={{ lat: 12.8581101, lng: 80.0646573 }}
      defaultZoom={13}
    >
      <DirectionsRenderer directions={directions} />
    </GoogleMap>
  ));

  return (
    <div>
      <GoogleMapExample
        containerElement={
          <div style={{ height: `500px`, width: "470px", marginTop: "2rem" }} />
        }
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default DrawMap;
