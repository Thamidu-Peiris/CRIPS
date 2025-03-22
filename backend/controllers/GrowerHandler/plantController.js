import GrowerPlant from "../models/GrowerPlant.js";

export const addGrowerPlant = async (req, res) => {
  try {
    const newPlant = new GrowerPlant(req.body);
    await newPlant.save();
    res.status(201).json({ message: "Plant added successfully!", plant: newPlant });
  } catch (error) {
    res.status(500).json({ message: "Error adding plant", error });
  }
};
