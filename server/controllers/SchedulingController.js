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



const Signal = require('../models/signal');
const Subsignal = require('../models/subsignal');
const CCTVCamera = require('../models/cctv');
const Signaldistance = require('../models/signaldistances');
const VehicleCount = require('../models/vehiclecount');
const Road = require('../models/road');


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
  
//get parent signal of given subsignal
async function getParentSignalForSubsignal(subsignalID) {
  const Subsignal = await Subsignal.findById(subsignalID);
  if(Subsignal)
  return Subsignal.signalAffiliated;
  else 
  return null;
}

//get all subsignals related to given signal
async function getSubsignalsForSignal(signalID) {

    const subsignals = await Subsignal.findAll({
      where: { signalAffiliated: signalID },
    });
    
  if(subsignals)
  return subsignals;
  else
  return [];
}


 
    //get vehicle count for given subsignal and other three subsignals
async function getVehicleCountForSubsignal(subsignalID) {


   //call getParentSignalForSubsignal for each previousSubsignalID
       //get all subsignals of parent signal
       //get vehicle count for each subsignal
       //calculate count by formula of 0.7*(count of given subsignal if that subsignal is in previoussubsignalIDs)+(0.3/total number of other subsignals)*(sum of all other subsignals);
        //return count


  // Get the IDs of the previous three subsignals
  const previousSubsignalIDs = await getPreviousSubsignalsForSubsignal(subsignalID);

  // Get the counts for each previous subsignal, including the given subsignal
  const counts = await Promise.all(previousSubsignalIDs.map(async (previousSubsignalID) => {

    // Get the parent signal for the current previous subsignal
    const parentSignal = await getParentSignalForSubsignal(previousSubsignalID);

    // Get all subsignals for the parent signal
    const subsignals = await getSubsignalsForSignal(parentSignal.id);

    // Get the most recent vehicle count for each subsignal
    const previousCounts = await Promise.all(subsignals.map(async (subsignal) => {
      const vehicleCount = await getMostRecentVehicleCountForSubsignal(subsignal.id);
      return vehicleCount.count;
    }));

    // Calculate the count for the current previous subsignal and return it
    const indexOfCurrentSubsignal = previousSubsignalIDs.indexOf(previousSubsignalID);
    const sumOfOtherCounts = previousCounts.reduce((total, count, index) => {
      if (index !== indexOfCurrentSubsignal) {
        return total + count;
      }
      return total;
    }, 0);
    const countOfCurrentSubsignal = previousCounts[indexOfCurrentSubsignal];
    const totalNumberOfSubsignals = previousCounts.length;
    const count = 0.7 * countOfCurrentSubsignal + (0.3 / totalNumberOfSubsignals) * sumOfOtherCounts;
    return count;
  }));

  // Return the counts for all previous subsignals
  return counts;
}


//find score for subsignal
async function getsubsignalScore(subsignalID)
{
  //I have vehiclecount of all subsignals
  //I have distance of subsignals
  
}

function reverseSigmoid(x, a) {
  return 1 / (1 + Math.exp(-a * (-x)));
}



function calculateScore(vehicleCounts, distances) {
  const maxDistance = Math.max(...distances);
  const a = 0.1; // scaling parameter
  const score = vehicleCounts.reduce((total, count, index) => {
    const distanceDiff = maxDistance - distances[index];
    const factor = reverseSigmoid(distanceDiff, a);
    return total + count * factor;
  }, 0);
  return score / vehicleCounts.length;
}



//get score for given subsignal
async function getScoreForSubsignal(subsignalID) {
  // Get the vehicle counts for the given subsignal and its three previous subsignals
  const vehicleCounts = await getVehicleCountForSubsignal(subsignalID);

  // Get the distances between the given subsignal and its three previous subsignals
  const distances = await getDistancesToPreviousSubsignals(subsignalID);

  // Calculate the score for the given subsignal
  const score = calculateScore(vehicleCounts, distances);
  return score;
}

//get score for all subsignals of a given parent signal
async function getScoresForSignal(signalID) {
  // Get all subsignals for the given signal
  const subsignals = await getSubsignalsForSignal(signalID);

  // Get the scores for each subsignal
  const scores = await Promise.all(subsignals.map(async (subsignal) => {

    const vehicleCount=await getVehicleCountForSubsignal(subsignal.id);
    const distance=await getDistancesToPreviousSubsignals(subsignal.id);
    const scores = await getScoreForSubsignal(vehicleCount,distance);

    return scores;
  }));

  return scores;
}


//get score for all subsignals of all signals

async function getScoresForAllSignals() {
  // Get all signals
  const signals = await getAllSignals();

  // Create a Map to store the scores for each signal
  const scoresMap = new Map();

  // Get the scores for each signal
  await Promise.all(signals.map(async (signal) => {
    const signalscores = await getScoresForSignal(signal.id);
    scoresMap.set(signal.id, signalscores);
  }));

  return scoresMap;
};



const getSchedulingScore = async (req, res) => {
  try {
    const _response = await getScoresForAllSignals();
    res.json(_response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrafficDataOfSignal = async (req, res) => {
  try {
    const {signalID} = body.params;
    const subsignals = await getSubsignalsForSignal(signalID);
    var count = 0;
    await Promise.all(subsignals.map(async (subsignal) => {
      const vehicleCounts = await VehicleCount.find({ ID: subsignal.ID }).sort({ timestamp: -1 }).limit(1);
      if (vehicleCounts.length > 0) {
        count += vehicleCounts[0].count;
      }
    }));

    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports={ getSchedulingScore,getTrafficDataOfSignal };




