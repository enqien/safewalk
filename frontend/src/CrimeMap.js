import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Define the map container style
const containerStyle = {
  width: "100%",
  height: "400px",
};

// Set the center of the map (coordinates for Los Angeles as an example)
const center = {
  lat: 34.052235,
  lng: -118.243683,
};

// Mock crime hotspots data with latitude and longitude
const crimeHotspots = [
  {
    id: 1,
    location: { lat: 34.052235, lng: -118.243683 },
    description: "Robbery",
  },
  {
    id: 2,
    location: { lat: 34.052335, lng: -118.253783 },
    description: "Assault",
  },
  {
    id: 3,
    location: { lat: 34.062235, lng: -118.243183 },
    description: "Burglary",
  },
];

function CrimeMap() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCzEE3_4gsOY1_k81DHcpPXDO-OOXM2nIQ">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Loop through crimeHotspots to place markers */}
        {crimeHotspots.map((hotspot) => (
          <Marker
            key={hotspot.id}
            position={hotspot.location}
            title={hotspot.description}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(CrimeMap);

// import { useState } from "react";
// import {
//   APIProvider,
//   Map,
//   AdvancedMarker,
//   Pin,
//   InfoWindow,
// } from "@vis.gl/react-google-maps";

// export default function Intro() {
//   const position = { lat: 53.54, lng: 10 };
//   const [open, setOpen] = useState(false);

//   return (
//     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
//       <div style={{ height: "100vh", width: "100%" }}>
//         <Map zoom={9} center={position} mapId={process.env.NEXT_PUBLIC_MAP_ID}>
//           <AdvancedMarker position={position} onClick={() => setOpen(true)}>
//             <Pin
//               background={"grey"}
//               borderColor={"green"}
//               glyphColor={"purple"}
//             />
//           </AdvancedMarker>

//           {open && (
//             <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
//               <p>I'm in Hamburg</p>
//             </InfoWindow>
//           )}
//         </Map>
//       </div>
//     </APIProvider>
//   );
// }
