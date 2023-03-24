// get-all-signals
// get-all-sub-signals related to given signal
// get cctv-camera related to given subsignal
// get previous subsignals related to given subsignal(you get previous subsignal from this subsignal,then use dfs for next 2)-repeat it for 3 subsignals
// calculate distance between the given subsignal and other three subsignals using the co-ordinates of the subsignals(you can get the subsignals via signals whose ID is given as affiliatedSignal)
// fetch the vehiclecount for the given subsignal and the other three subsignals-also fetch the data associated with  all other subsignals of parent signals of given 3 subsignals
// calculate the score for given signal using the data of vehiclecount and distance of subsignal and all three nearest subsignals
// remember that vehicle count is directly proportional to the score while distance is not.
// for distance you can use a function like reversesigmoid
// now for one perticular signal , there are other subsignals also, repeat this process for other subsignals and divide the given scheduling time based on score.



const mongoose = require('mongoose');
const Signal = require('./models/Signal');
const Subsignal = require('./models/Subsignal');
const CCTVCamera = require('./models/CCTVCamera');
const Signaldistance = require('./models/Signaldistance');
const VehicleCount = require('./models/VehicleCount');
const Road = require('./models/Road');


async function getAllSignals() {
    const signals = await Signal.find({});
    return signals;
  }

  
  async function getAllSubsignalsForSignal(signalID) {
    const subsignals = await Subsignal.find({ signalAffiliated: signalID });
    return subsignals;
  }
  
//get cctv related to given subsignal
  async function getCCTVCameraForSubsignal(subsignalID) {
    const subsignal = await Subsignal.findOne({ ID: subsignalID });
    if (!subsignal) {
      throw new Error(`Subsignal with ID ${subsignalID} not found`);
    }
  
    const cctvCamera = await CCTVCamera.findOne({ subSignalID: subsignalID });
    if (!cctvCamera) {
      throw new Error(`CCTV camera for subsignal with ID ${subsignalID} not found`);
    }
  
    return cctvCamera;
  }


//get co-ordinates of signal related to given subsignal
  async function getCoordinatesForSubsignal(subsignalID) {
    try {
      const subsignal = await Subsignal.findById(subsignalID);
      const signalID = subsignal.signalAffiliated;
      const signal = await Signal.findById(signalID);
      return signal.coordinates;
    } catch (error) {
      console.error(error);
    }
  }
  
//get previous subsignals related to given subsignal
  async function getPreviousSubsignalsForSubsignal(subsignalID) {
  const subSignal = await Subsignal.findById(subsignalID);

  // Check if the current subsignal has a previous subsignal
  if (!subSignal.previousSubsignalID) {
    return [];
  }

  // Get the previous subsignal and push it to an array
  const previousSubsignalID = subSignal.previousSubSignal;
  const previousSubsignals = [];

  // If the previous subsignal has a previous subsignal, repeat the process
  for (let i = 0; i < 3; i++) {
    if (!previousSubsignalID) break;
    previousSubsignalIDs.push(previousSubsignalID);
    const previousSubsignal = await Subsignal.findById(previousSubsignalID);
    previousSubsignalID = previousSubsignal.previousSubsignalID;
  }


  return previousSubsignals;
}


//get distance between co-ordinates
function getDistanceFromLatLonInKm(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}



//get distance between a given subsignal and other three subsignals
async function getDistancesToPreviousSubsignals(subsignalID) {
    // Get the current subsignal
    const currentSubsignal = await Subsignal.findById(subsignalID);
    const { signalAffiliated } = currentSubsignal;
  
    // Get the signal that the current subsignal is affiliated with
    const affiliatedSignal = await Signal.findById(signalAffiliated);
  
    // Find the coordinates of the current subsignal and its affiliated signal
    const currentSubsignalCoordinates = affiliatedSignal.coordinates;
    const affiliatedSignalCoordinates = affiliatedSignal.coordinates;
  
    // Find the three previous subsignals to the current subsignal
    const previousSubsignalIDs = await getPreviousSubsignalsForSubsignal(subsignalID);
    
    // Find the distances between the current subsignal and its three previous subsignals
    const distances = await Promise.all(previousSubsignalIDs.map(async (previousSubsignalID) => {
      
      const previousSubsignalCoordinates = await getCoordinatesForSubsignal(previousSubsignalID);
      const distance = await getDistanceBetweenCoordinates(currentSubsignalCoordinates, previousSubsignalCoordinates);
      return distance;
    }));
  
    return distances;
  }
  


  //get vehicle count for given subsignal and other three subsignals
    async function getVehicleCountForSubsignal(subsignalID) {
        
    }