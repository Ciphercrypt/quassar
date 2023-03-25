import logo from './logo.svg';
import './App.css';
import VehicleTracking from './screens/Tracking/Vehicletracking';
// import MediaControlCard from './screens/Traffic/Videos';
import Videos from './screens/Traffic/videos';
function App() {
  return (
    <div className="App">
      <header className="App-header">
            {/* <MediaControlCard /> */}
       
            <VehicleTracking />
            <Videos/>
      </header>
    </div>
  );
}

export default App;
