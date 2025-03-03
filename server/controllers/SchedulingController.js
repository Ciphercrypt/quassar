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

const Signal = require("../models/signal");
const SubSignal = require("../models/subsignal");
const CCTVCamera = require("../models/cctv");
const Signaldistance = require("../models/signaldistances");
const VehicleCount = require("../models/vehiclecount");
const Road = require("../models/road");

const data=require("../config/data.json");
async function getAllSignals() {
  const signals = await Signal.find({});
  return signals;
}

async function getAllSubsignalsForSignal(signalID) {
  const subsignals = await SubSignal.find({ signalAffiliated: signalID });

  if (!subsignals) {
    return [];
  }
  return subsignals;
}

//get cctv related to given subsignal
async function getCCTVCameraForSubsignal(subsignalID) {
  const subsignal = await SubSignal.findOne({ ID: subsignalID });
  if (!subsignal) {
    throw new Error(`Subsignal with ID ${subsignalID} not found`);
  }

  const cctvCamera = await CCTVCamera.findOne({ subSignalID: subsignalID });
  if (!cctvCamera) {
    throw new Error(
      `CCTV camera for subsignal with ID ${subsignalID} not found`
    );
  }

  return cctvCamera;
}

//get co-ordinates of signal related to given subsignal
async function getCoordinatesForSubsignal(subsignalID) {
  const subsignal = await SubSignal.findOne({ ID: subsignalID });
  if (subsignal) {
    const signalID = subsignal.signalAffiliated;
    const signal = await Signal.findOne({ ID: signalID });
    return signal.coordinates;
  } else 
  return [];
}

//get previous subsignals related to given subsignal
async function getPreviousSubsignalsForSubsignal(subsignalID) {
  const subSignal = await SubSignal.findOne({ ID: subsignalID });

  // Check if the current subsignal has a previous subsignal
  console.log("subsignalhere", subSignal);
  if (!subSignal) {
    return [];
  }

  // Get the previous subsignal and push it to an array
  const previousSubsignalID = subSignal.previousSubSignal;
  const previousSubsignalIDs = [];

  // If the previous subsignal has a previous subsignal, repeat the process
  for (let i = 0; i < 3; i++) {
    if (!previousSubsignalID) break;
    previousSubsignalIDs.push(previousSubsignalID);
    const prev = await SubSignal.findOne({ ID: previousSubsignalID });
    if (prev) previousSubsignalID = prev.previousSubSignal;
    else break;
  }

  return previousSubsignalIDs;
}


function deg2rad(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}




//get distance between co-ordinates
function getDistanceFromLatLonInKm(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

//get distance between a given subsignal and other three subsignals
async function getDistancesToPreviousSubsignals(subsignalID) {
  // Get the current subsignal
  const currentSubsignal = await SubSignal.findOne({ ID: subsignalID });
  const { signalAffiliated } = currentSubsignal.signalAffiliated;

  // Get the signal that the current subsignal is affiliated with
 
  const affiliatedSignal = await Signal.findOne({ ID: signalAffiliated });

  // Find the coordinates of the current subsignal and its affiliated signal
  if(affiliatedSignal){
  const currentSubsignalCoordinates = affiliatedSignal.coordinates;
  const affiliatedSignalCoordinates = affiliatedSignal.coordinates;

  // Find the three previous subsignals to the current subsignal
  const previousSubsignalIDs = await getPreviousSubsignalsForSubsignal(
    subsignalID
  );

  // Find the distances between the current subsignal and its three previous subsignals
  const distances = await Promise.all(
    previousSubsignalIDs.map(async (previousSubsignalID) => {
      const previousSubsignalCoordinates = await getCoordinatesForSubsignal(
        previousSubsignalID
      );
      if (previousSubsignalID && currentSubsignalCoordinates) {
        const distance = await getDistanceFromLatLonInKm(
          currentSubsignalCoordinates,
          previousSubsignalCoordinates
        );
        return distance;
      }
    })
  );

  return distances;
  }
  else return [];
}

//get parent signal of given subsignal
async function getParentSignalForSubsignal(subsignalID) {
  const Subsignal = await SubSignal.findOne({ ID: subsignalID });
  if (Subsignal) return SubSignal.signalAffiliated;
  else return null;
}

//get all subsignals related to given signal
async function getSubsignalsForSignal(signalID) {
  //console.log("sign", signalID);
  const subsignals = await SubSignal.find({
    signalAffiliated: signalID,
  });
  console.log("subsignal", subsignals);
  if (subsignals) return subsignals;
  else return [];
}

async function getMostRecentVehicleCountForSubsignal(subsignalID) {
  console.log("I M IN");
  const vehicleCount = await VehicleCount.findOne({
    subsignalID: subsignalID,
  })
    .sort({ timestamp: -1 })
    .limit(1);
  if (vehicleCount) return vehicleCount.count;
  else return 0;
}
//get vehicle count for given subsignal and other three subsignals
async function getVehicleCountForSignal(signalID) {
  //call getParentSignalForSubsignal for each previousSubsignalID
  //get all subsignals of parent signal
  //get vehicle count for each subsignal
  //calculate count by formula of 0.7*(count of given subsignal if that subsignal is in previoussubsignalIDs)+(0.3/total number of other subsignals)*(sum of all other subsignals);
  //return count

  // Get the IDs of the previous three subsignals
  const previousSubsignalIDs = await getAllSubsignalsForSignal(signalID);

  // Get the counts for each previous subsignal, including the given subsignal

  const previousCounts = await Promise.all(
    previousSubsignalIDs.map(async (subsignal) => {
      const vehicleCount = await getMostRecentVehicleCountForSubsignal(
        subsignal.ID
      );
      console.log(vehicleCount);
      if (vehicleCount != null) count += vehicleCount;
      else return 0;
    })
  );

  // Calculate the count for the current previous subsignal and return it

  console.log(previousCounts);

  const sumOfOtherCounts = previousCounts.reduce((total, count, index) => {
    return total + count;
  }, 0);

  // Return the counts for all previous subsignals
  return sumOfOtherCounts / previousCounts.length;
}

//get vehicle count for given subsignal and other three subsignals
async function getVehicleCountForSubsignal(subsignalID) {
  //call getParentSignalForSubsignal for each previousSubsignalID
  //get all subsignals of parent signal
  //get vehicle count for each subsignal
  //calculate count by formula of 0.7*(count of given subsignal if that subsignal is in previoussubsignalIDs)+(0.3/total number of other subsignals)*(sum of all other subsignals);
  //return count

  // Get the IDs of the previous three subsignals
  const previousSubsignalIDs = await getPreviousSubsignalsForSubsignal(
    subsignalID
  );

  // Get the counts for each previous subsignal, including the given subsignal
  const counts = await Promise.all(
    previousSubsignalIDs.map(async (previousSubsignalID) => {
      // Get the parent signal for the current previous subsignal
      const parentSignal = await getParentSignalForSubsignal(
        previousSubsignalID
      );

      // Get all subsignals for the parent signal
      if (parentSignal) {
        const subsignals = await getSubsignalsForSignal(parentSignal.ID);

        // Get the most recent vehicle count for each subsignal
        const previousCounts = await Promise.all(
          subsignals.map(async (subsignal) => {
            const vehicleCount = await getMostRecentVehicleCountForSubsignal(
              subsignal.ID
            );
            return vehicleCount.count;
          })
        );

        // Calculate the count for the current previous subsignal and return it
        const indexOfCurrentSubsignal =
          previousSubsignalIDs.indexOf(previousSubsignalID);
        const sumOfOtherCounts = previousCounts.reduce(
          (total, count, index) => {
            if (index !== indexOfCurrentSubsignal) {
              return total + count;
            }
            return total;
          },
          0
        );
        const countOfCurrentSubsignal = previousCounts[indexOfCurrentSubsignal];
        const totalNumberOfSubsignals = previousCounts.length;
        const count =
          0.7 * countOfCurrentSubsignal +
          (0.3 / totalNumberOfSubsignals) * sumOfOtherCounts;
        return count;
      }
    })
  );

  // Return the counts for all previous subsignals
  return counts;
}

//find score for subsignal
async function getsubsignalScore(subsignalID) {
  //I have vehiclecount of all subsignals
  //I have distance of subsignals
}

function reverseSigmoid(x, a) {
  return 1 / (1 + Math.exp(-a * -x));
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
  console.log("subsignals", subsignals);

  // Get the scores for each subsignal
  const scores = await Promise.all(
    subsignals.map(async (subsignal) => {
      const vehicleCount = await getVehicleCountForSubsignal(subsignal.ID);
      const distance = await getDistancesToPreviousSubsignals(subsignal.ID);
      const scores = await getScoreForSubsignal(vehicleCount, distance);

      return scores;
    })
  );

  return scores;
}

//get roadcoordinates by endingPoint
async function getRoadCoordinatesByEndingPoint(lat, lang) {
  const endingPoint = [lat, lang];
  // const { endingPoint } = req.query;
  const road = await Road.findOne({ endingCoordinates: endingPoint });

  if (road) return road.coordinates;
  else return [];
}

//get score for all subsignals of all signals

async function getScoresForAllSignals() {
  // Get all signals
  const signals = await getAllSignals();

  console.log("signals", signals);
  // Create a Map to store the scores for each signal
  const scoresMap = new Map();

  // Get the scores for each signal
  await Promise.all(
    signals.map(async (signal) => {
      const signalscores = await getScoresForSignal(signal.ID);
      scoresMap.set(signal.ID, signalscores);
    })
  );

  return scoresMap;
}

const getSchedulingScore = async (req, res) => {
  try {
    //const _response = await getScoresForAllSignals();
    console.log("response",data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrafficDataOfSignal = async (req, res) => {
  try {
    // console.log("paras", req.query);
    const { signalId } = req.query;
    const subsignals = await getSubsignalsForSignal(signalId);
    var count = 0;
    console.log("Inside where I want", subsignals);
    await Promise.all(
      subsignals.map(async (subsignal) => {
        console.log(subsignal);
        const vehicleCounts = await VehicleCount.find({ ID: subsignal.ID })
          .sort({ timestamp: -1 })
          .limit(1);
        console.log("vehicle count", vehicleCounts[0].count);
        if (vehicleCounts.length > 0) {
          count += vehicleCounts[0].count;
        }
      })
    );

    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrafficDataOfAllSignals = async (req, res) => {
  try {
    const signals = await getAllSignals();
    const data = [];
    await Promise.all(
      signals.map(async (signal) => {
        const subsignals = await getSubsignalsForSignal(signal.ID);

        var count = 0;

        await Promise.all(
          subsignals.map(async (subsignal) => {
            console.log(subsignal);
            const vehicleCounts = await VehicleCount.find({ ID: subsignal.ID })
              .sort({ timestamp: -1 })
              .limit(1);
            console.log("vehicle count", vehicleCounts[0].count);
            if (vehicleCounts.length > 0) {
              count += vehicleCounts[0].count;
            }
          })
        );

        //const vehicleCount = await getVehicleCountForSignal(signal.ID);
        const RoadCoordinates = await getRoadCoordinatesByEndingPoint(
          signal.coordinates[0],
          signal.coordinates[1]
        );
        const signalData = {
          signalId: signal.ID,
          vehicleCount: count,
          roadCoordinates: RoadCoordinates,
          location: signal.location,
          signalCoordinates: signal.coordinates,
        };
        data.push(signalData);
      })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSchedulingScore,
  getTrafficDataOfSignal,
  getTrafficDataOfAllSignals,
};
