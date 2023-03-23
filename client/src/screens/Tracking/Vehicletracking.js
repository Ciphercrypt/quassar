import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const iconPerson = new L.Icon({
  iconUrl: require('./images/location-arrow.svg').default,
  iconRetinaUrl: require('./images/location-arrow.svg').default,
  iconSize: new L.Point(25, 25),
  className: 'leaflet-div-icon'
});

const VehicleTracking = () => {
  const center = [19.017714459676327, 72.84761331851789];
  const markerPosition = [19.017714459676327, 72.84761331851789];


  const roadData = [
    [[19.02072745616729, 72.84339789621288], [19.01784408492782, 72.84777341516289]],
    [[19.01784408492782, 72.84777341516289], [19.01551769208689, 72.85141246081042]],
    [[19.01551769208689, 72.85141246081042],[19.014852786064026, 72.85060047767622]],
    [[19.014852786064026, 72.85060047767622],[19.012717537685944, 72.84925574782181]]
  ];
  const roadCoordinates = [[19.017714459676327, 72.84761331851789], [19.025, 72.836]];
  const roadCoordinates1 = [[19.017714459676327, 72.84761331851789], [19.028, 72.836]];


  const getRoadColor = (coordinates) => {
    const [startLat, startLng] = coordinates[0];
    const [endLat, endLng] = coordinates[coordinates.length - 1];

    
  //randomly return color
  const colors = ['green', 'red', 'yellow', 'orange', 'blue'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
  }

  return (
    <MapContainer center={center} zoom={20} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?style=transport" />
      <Marker position={markerPosition} icon={iconPerson} >
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

        <Marker position={coordinates[0]} icon={iconPerson} >
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
