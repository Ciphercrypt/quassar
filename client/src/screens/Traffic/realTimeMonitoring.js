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
  const center = [19.017714459676327, 72.84761331851789];
  const markerPosition = [19.017714459676327, 72.84761331851789];
  const [RoadData, setRoadData] = useState([]);

  const fetchSignalData = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/signal/getAllSignals"
    );

    return response.data.signal;
  };

  const fetchTrafficData = async (signalId) => {
    const response = await axios.get(
      `http://localhost:5000/api/scheduling/getTrafficDataOfSignal`,
      { params: { signalId: signalId } }
    );
    // console.log("the data", response.data);
    return response.data;
  };

  const getRoadColor = (vehiclecount) => {
    if (vehiclecount < 25) {
      return "green";
    } else if (vehiclecount < 50) {
      return "yellow";
    } else return "red";
  };

  const fetchRoadData = async (endPoint) => {
    const response = await axios.get(
      `http://localhost:8080/api/road/fetchRoadByEndingPoint`,
      { params: { endingPoint: endPoint } }
    );
    return response.data.coordinates;
  };

  const vehicleCount = async (ID) => {
    const count = await fetchTrafficData(ID);
    console.log("data plz:", ID, count);
    return count;
  };
  const roadCoordinatesFetcher = async (dataCoordinates) => {
    const coordinates = await fetchRoadData(dataCoordinates);
    console.log("coordinates" + coordinates);
    return coordinates;
  };
  useEffect(() => {
    // const dt=  fetchSignalData().then((data)=>{
    //    console.log(data.signal);
    //    return data.signal;
    //  });

    // console.log(dt);

    const getData = async () => {
      const dt = await fetchSignalData();
      console.log("this is dt : ", dt);
      dt.map((data, index) => {
        // console.log("Inside map");
        // Perform your operations on each element of the array here
        let vC = vehicleCount(data.ID);
        setRoadData([
          ...RoadData,
          {
            signalID: data.ID,
            signalCoordinates: data.coordinates,
            roadcoordinates: roadCoordinatesFetcher(data.coordinates),
            trafficData: vC,
            color: getRoadColor(vC),
            location: data.location,
          },
        ]);

        console.log(RoadData);
      });
    };

    getData();
  }, []);
  // useEffect(() => {

  //   const  getAllData = () => {
  //   const allsignalData =  fetchSignalData();

  //     for (const signal of allsignalData) {
  //       const vehicleCount =  fetchTrafficData(signal.ID);
  //       const roadCoordinates =  fetchRoadData(signal.roadEndingPoint);
  //       //{signalID:signal.ID,signalCoordinates:signal.coordinates, roadcoordinates: roadCoordinates, trafficData: vehicleCount ,color: getRoadColor(vehicleCount),location:signal.location}
  //       setRoadData([...RoadData,{signalID:signal.ID,signalCoordinates:signal.coordinates, roadcoordinates: roadCoordinates, trafficData: vehicleCount ,color: getRoadColor(vehicleCount),location:signal.location}]);
  //     }
  //     console.log(RoadData);

  //   }
  //   getAllData();
  // }, [RoadData]);

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

        {/* {RoadData.map((data, index) => (
  <Marker key={index} position={data.signalCoordinates}>
    <Popup>
      <div>
        <h3>{`Signal ID: ${data.signalID}`}</h3>
        <p>{`Location: ${data.location}`}</p>
        <p>{`Vehicle Count: ${data.trafficData}`}</p>
      </div>
    </Popup>
    {data.roadCoordinates.map((coordinates, index) => (
      <Polyline
        key={index}
        positions={coordinates}
        color={data.color}
        weight={10}
      />
    ))}
  </Marker>
))} */}

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
