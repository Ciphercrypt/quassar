import { React, useEffect, useState } from "react";
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
  const center = [19.017714459676327, 72.84761331851789];
  const markerPosition = [19.017714459676327, 72.84761331851789];
  const [signalData, setSignalData] = useState("");
  const [RoadData, setRoadData] = useState("");

  const fetchSignalData = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/signal/getAllSignals"
    );
    setSignalData(response.data);
  };

  const fetchTrafficData = async (signalId) => {
    const response = axios.get(
      "http://localhost:5000/api/scheduling/getTrafficDataOfSignal",
      {
        params: {
          signalId: { signalId },
        },
      }
    );
  };

  const fetchRoadData = async (endPoint) => {
    const response = await axios.get(
      `http://localhost:8080/api/road/fetchRoadByEndingPoint?endPoint=${endPoint}`
    );
    return response.data.coordinates;
  };

  useEffect(() => {
    fetchSignalData();
  }, []);

  useEffect(() => {
    const roadCoordinates = [];
    const fetchRoadDataForSignals = async () => {
      for (const signal of signalData) {
        const trafficData = await fetchTrafficData(signal.id);
        const roadCoordinates = await fetchRoadData(signal.roadEndingPoint);
        setRoadData((prevData) => [
          ...prevData,
          { coordinates: roadCoordinates, trafficData: trafficData },
        ]);
      }
    };
    fetchRoadDataForSignals();
  }, [signalData]);

  const getRoadColor1 = (trafficData) => {
    const minVehiclesCount = 0; // minimum value for vehicle count
    const maxVehiclesCount = 100; // maximum value for vehicle count
    const sectors = 4; // number of color sectors
    const range = (maxVehiclesCount - minVehiclesCount) / sectors;
    const colors = ["green", "yellow", "orange", "red"];
    const sectorIndex = Math.floor((trafficData - minVehiclesCount) / range);
    return colors[sectorIndex];
  };

  const roadData = [
    [
      [19.02072745616729, 72.84339789621288],
      [19.01784408492782, 72.84777341516289],
    ],
    [
      [19.01784408492782, 72.84777341516289],
      [19.01551769208689, 72.85141246081042],
    ],
    [
      [19.01551769208689, 72.85141246081042],
      [19.014852786064026, 72.85060047767622],
    ],
    [
      [19.014852786064026, 72.85060047767622],
      [19.012717537685944, 72.84925574782181],
    ],
    [
      [19.012717537685944, 72.84925574782181],
      [19.011329130786255, 72.85434485740484],
    ],
    [
      [19.01551769208689, 72.85141246081042],
      [19.018856728292665, 72.85576303318206],
    ],
    [
      [19.02204755191919, 72.85096960874019],
      [19.018856728292665, 72.85576303318206],
    ],
  ];
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
        <Marker position={markerPosition} icon={iconPerson}>
          <Popup>
            <div>
              <h3>Cross Section of Roads near Dadar</h3>
              <p>Insert data here</p>
            </div>
          </Popup>
        </Marker>

        {roadData.map((coordinates, index) => (
          <Polyline
            positions={coordinates}
            color={getRoadColor(coordinates)}
            weight={10}
          />
        ))}
      </MapContainer>
    </>
  );
};

export default DadarMap;
