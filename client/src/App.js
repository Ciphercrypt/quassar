import logo from "./logo.svg";
import "./App.css";
import VehicleTracking from "./screens/Tracking/Vehicletracking";
import MediaControlCard from "./screens/Traffic/videofiletemp";
import DadarMap from "./screens/Traffic/realTimeMonitoring";
import AddRoadDetails from "./components/AddData/AddRoadDetails";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<DadarMap />}></Route>
        <Route exact path="/monitoring" element={<VehicleTracking />}></Route>
        <Route exact path="/videos" element={<MediaControlCard />}></Route>
        <Route
          exact
          path="/addRoadDetails"
          element={<AddRoadDetails />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
