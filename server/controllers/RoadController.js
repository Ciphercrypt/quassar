const Road = require('../models/road');

// Create a new road
const createRoad = async (req, res) => {
  try {
    const { id, startingCoordinates, endingCoordinates, coordinates } = req.body;
    const newRoad = new Road({ id, startingCoordinates, endingCoordinates, coordinates });
    await newRoad.save();
    res.status(201).json(newRoad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create road.' });
  }
};

// Edit an existing road
const editRoad = async (req, res) => {
  try {
    const { id } = req.params;
    const { startingCoordinates, endingCoordinates, coordinates } = req.body;
    const updatedRoad = await Road.findOneAndUpdate(
      { id },
      { startingCoordinates, endingCoordinates, coordinates },
      { new: true }
    );
    res.status(200).json(updatedRoad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to edit road.' });
  }
};

// Fetch a road by its ID
const fetchRoad = async (req, res) => {
  try {
    const { id } = req.params;
    const road = await Road.findOne({ id });
    if (road) {
      res.status(200).json(road);
    } else {
      res.status(404).json({ message: 'Road not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch road.' });
  }
};


// Delete a road by its ID
const deleteRoad = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoad = await Road.findOneAndDelete({ id });
    if (deletedRoad) {
      res.status(200).json(deletedRoad);
    } else {
      res.status(404).json({ message: 'Road not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete road.' });
  }
};

// Fetch a road by its ending point
const fetchRoadByEndingPoint = async (req, res) => {
  try {
    const { endingPoint } = req.params;
    const road = await Road.findOne({ endingCoordinates: endingPoint });
    if (road) {
      res.status(200).json(road);
    } else {
      res.status(404).json({ message: 'Road not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch road.' });
  }
};


module.exports = { createRoad, editRoad, fetchRoad, deleteRoad ,getTrafficDataOfSignal};


