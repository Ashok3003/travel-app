import React from "react";
import { withScriptjs } from "react-google-maps";

import Map from "./DrawMap";

function MapRoute() {
  //   const API_KEY = "AIzaSyDOk9RsmR-uleKsbrqVNK7kJijn9Azea98";
  const API_KEY = "AIzaSyBb-9W6mCNIXEk6na0CvOH4gdiklGbQ2hc";
  const API_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  const MapLoader = withScriptjs(Map);
  console.log("API_URL", API_URL);
  return (
    <div>
      <MapLoader
        googleMapURL={API_URL}
        loadingElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default MapRoute;
