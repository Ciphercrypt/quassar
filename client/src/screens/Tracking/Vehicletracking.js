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
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { keyCode } from "keycode";
import TextField from "@mui/material/TextField";

const iconPerson = new L.Icon({
  iconUrl: require("./images/location-arrow.svg").default,
  iconRetinaUrl: require("./images/location-arrow.svg").default,
  iconSize: new L.Point(25, 25),
  className: "leaflet-div-icon",
});

const VehicleTracking = () => {
  const [isSetMap,setisSetMap]=useState(false);
  const [roadData, setRoadData] = useState([]);

  const items = [
    {
      id: 0,
      name: "Cobol",
    },
    {
      id: 1,
      name: "JavaScript",
    },
    {
      id: 2,
      name: "Basic",
    },
    {
      id: 3,
      name: "PHP",
    },
    {
      id: 4,
      name: "Java",
    },
  ];

  async function TrackingData(vehicleID) {
    //MH 01 CB 1111
    axios
      .post("http://localhost:5000/api/vehicletrack/getVehicleTrackLocation", {
        vehicleID: vehicleID,
      })
      .then(function (response) {
        // handle success
        console.log(response.data);
        setRoadData(response.data);
        setisSetMap(true);
        return response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
  const handleOnSearch1 = async (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.

    if (keyCode == 13) {
      const result = await TrackingData(string);
      console.log(result);
    }

    console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };
  const handleOnSearch = async (event) => {
    console.log(event);
    if (event.keyCode === 13) {
      console.log("do validate", event.target.value);
      const result = await TrackingData(event.target.value);
      
      console.log(result);
    }
  };


  const formatResult = (item) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            zIndex: "1000",
          }}
        >
          <span style={{ display: "block", textAlign: "left" }}>
            id: {item.id}
          </span>
          <span style={{ display: "block", textAlign: "left" }}>
            name: {item.name}
          </span>
        </div>
      </>
    );
  };
  const center = [19.017714459676327, 72.84761331851789];
  const markerPosition = [19.017714459676327, 72.84761331851789];

  const getRoadColor = (coordinates) => {
    const [startLat, startLng] = coordinates[0];
    const [endLat, endLng] = coordinates[coordinates.length - 1];

    //randomly return color
    const colors = ["green", "red", "yellow", "orange", "blue"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[4];
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      const result = await TrackingData(event.target.value);
      console.log(result);
    }
  };

  

  return (
    <>
      <div style={{ marginLeft: 20, zIndex: "1000", backgroundColor: "grey" }}>
        <div style={{ backgroundColor: "white", padding: "10px" }}>
          <TextField
            id="outlined-basic"
            label="Enter Number plate ID"
            variant="outlined"
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
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

        {isSetMap && roadData.map((coordinates, index) => (
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
    </>
  );
};

export default VehicleTracking;
