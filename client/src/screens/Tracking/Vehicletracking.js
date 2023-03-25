import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const iconPerson = new L.Icon({
  iconUrl: require("./images/location-arrow.svg").default,
  iconRetinaUrl: require("./images/location-arrow.svg").default,
  iconSize: new L.Point(25, 25),
  className: "leaflet-div-icon",
});

const VehicleTracking = () => {
  const center = [19.017714459676327, 72.84761331851789];
  const markerPosition = [19.017714459676327, 72.84761331851789];
  const [roadData, setRoadData] = useState([
    [
      [19.017848155836916, 72.84769723673634],
      [19.01564679977552, 72.85137625913586],
    ],
  ]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/vehicletrack/getVehicleTrackLocation", {
        vehicleID: "MH 01 CB 1111",
      })
      .then(function (response) {
        // handle success
        // console.log(response.data);
        setRoadData(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);
  const roadCoordinates = [
    [19.017714459676327, 72.84761331851789],
    [19.025, 72.836],
  ];
  const roadCoordinates1 = [
    [19.017714459676327, 72.84761331851789],
    [19.028, 72.836],
  ];

  const getRoadColor = (coordinates) => {
    const [startLat, startLng] = coordinates[0];
    const [endLat, endLng] = coordinates[coordinates.length - 1];

    //randomly return color
    const colors = ["green", "red", "yellow", "orange", "blue"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    
    <MapContainer
      center={center}
      zoom={20}
      style={{ height: "1000px", width: "1980px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?style=transport" />
      <Marker position={markerPosition} icon={iconPerson}>
        <Popup>
          <div>
            <h3>Cross Section of Roads near Dadar</h3>
            <p>Insert data here</p>
          </div>
        </Popup>
      </Marker>

      {roadData.map((coordinates, index) => (
        <>
          <Polyline
            positions={coordinates}
            color={getRoadColor(coordinates)}
            weight={10}
          />

          <Marker position={coordinates[0]} icon={iconPerson}>
            <Popup>
              <div>
                <h3>data regarding time etc</h3>
                <p>Insert data here</p>
              </div>
            </Popup>
          </Marker>
        </>
      ))}
    </MapContainer>
  );
};

export default VehicleTracking;
