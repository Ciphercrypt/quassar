import logo from './logo.svg';
import './App.css';
import VehicleTracking from './screens/Tracking/Vehicletracking';
import { Videos }from './screens/Traffic/videos';
function App() {
  return (
    <div className="App">
      <header className="App-header">
            <VehicleTracking />
            <Videos/>
      </header>
    </div>
  );
}

export default App;
