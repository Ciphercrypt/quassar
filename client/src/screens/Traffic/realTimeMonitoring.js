import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Typography from "@mui/material/Typography";
import axios from "axios";

const iconPerson = new L.Icon({
  iconUrl: require("./images/camera_icon.svg").default,
  iconRetinaUrl: require("./images/camera_icon.svg").default,
  iconSize: new L.Point(35, 35),
  className: "leaflet-div-icon",
});

const DadarMap = () => {
  const center = [19.020383786069534, 72.85368698555504];
  const markerPosition = [19.017714459676327, 72.84761331851789];
  const [RoadData, setRoadData] = useState([]);
  const [PolyData,setPolyData]=useState([]);
  const chahat=[];

  const getData = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/scheduling/getTrafficDataOfAllSignals"
    );

    setPolyData(response.data);

    console.log("PolyData",response.data[0].roadCoordinates);
    setRoadData(response.data);
    return response.data;
  };

  
  const getRoadColor = (vehiclecount) => {
  if(vehiclecount<10)
  return "green";
  else if(vehiclecount<20)
  return "yellow";
  else
  return "red";
  };

 
useEffect(() => {
  getData();
},[]);

  // const roadData = [
  //   [
  //     [19.02072745616729, 72.84339789621288],
  //     [19.01784408492782, 72.84777341516289],
  //   ],
  //   [
  //     [19.01784408492782, 72.84777341516289],
  //     [19.01551769208689, 72.85141246081042],
  //   ],
  //   [
  //     [19.01551769208689, 72.85141246081042],
  //     [19.014852786064026, 72.85060047767622],
  //   ],
  //   [
  //     [19.014852786064026, 72.85060047767622],
  //     [19.012717537685944, 72.84925574782181],
  //   ],
  //   [
  //     [19.012717537685944, 72.84925574782181],
  //     [19.011329130786255, 72.85434485740484],
  //   ],
  //   [
  //     [19.01551769208689, 72.85141246081042],
  //     [19.018856728292665, 72.85576303318206],
  //   ],
  //   [
  //     [19.02204755191919, 72.85096960874019],
  //     [19.018856728292665, 72.85576303318206],
  //   ],
  // ];
  // const roadCoordinates = [
  //   [19.017714459676327, 72.84761331851789],
  //   [19.025, 72.836],
  // ];
  // const roadCoordinates1 = [
  //   [19.017714459676327, 72.84761331851789],
  //   [19.028, 72.836],
  // ];
  // const roadCoordinates = [[19.017714459676327, 72.84761331851789], [19.025, 72.836]];
  // const roadCoordinates1 = [[19.017714459676327, 72.84761331851789], [19.028, 72.836]];

  return (
    <>
      <Typography variant="h4" component="h4" gutterBottom>
        Real Time monitoring Graph
      </Typography>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "1000px", width: "1980px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?style=transport" />

        {}

         {RoadData.map((data, index) => {
          
            console.log("chahat="+JSON.stringify(data));
          
return <Marker key={index} position={data.signalCoordinates} icon={iconPerson}>
    <Popup>
      <div>
        <h3>{`Signal ID: ${data.signalId}`}</h3>
        <p>{`Location: ${data.location}`}</p>
        <p>{`Vehicle Count: ${data.vehicleCount}`}</p>
      </div>
    </Popup>

    
    
  </Marker>
})} 


{PolyData.map((data, index) => (
      <Polyline
        key={index}
        positions={data.roadCoordinates}
        color={getRoadColor(data.vehicleCount)}
        weight={10}
      />
    ))}



{/* 
        <Marker position={markerPosition} icon={iconPerson}>
          <Popup>
            <div>
              <h3>Cross Section of Roads near Dadar</h3>
              <p>Insert data here</p>
            </div>
          </Popup>
        </Marker> */}

        {/* {roadData.map((coordinates, index) => (
          <Polyline
            positions={coordinates}
            color={getRoadColor(coordinates)}
            weight={10}
          />
        ))} */}
      </MapContainer>
    </>
  );
};

export default DadarMap;
