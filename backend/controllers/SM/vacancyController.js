const Vacancy = require('../../models/SM/Vacancy');

// Get all vacancies
const getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    res.status(500).json({ message: 'Server error while fetching vacancies' });
  }
};

// Add a new vacancy
const addVacancy = async (req, res) => {
  try {
    const { title, description, backgroundImage } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const vacancy = new Vacancy({
      title,
      description,
      backgroundImage: backgroundImage || '',
    });

    await vacancy.save();
    res.status(201).json(vacancy);
  } catch (error) {
    console.error('Error adding vacancy:', error);
    res.status(400).json({ message: 'Error adding vacancy' });
  }
};

// Update a vacancy
const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, backgroundImage } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const vacancy = await Vacancy.findByIdAndUpdate(
      id,
      { title, description, backgroundImage },
      { new: true, runValidators: true }
    );

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    res.status(200).json(vacancy);
  } catch (error) {
    console.error('Error updating vacancy:', error);
    res.status(400).json({ message: 'Error updating vacancy' });
  }
};

// Delete a vacancy
const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const vacancy = await Vacancy.findByIdAndDelete(id);

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    res.status(200).json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    console.error('Error deleting vacancy:', error);
    res.status(500).json({ message: 'Server error while deleting vacancy' });
  }
};

// Export all functions as a single object
module.exports = {
  getAllVacancies,
  addVacancy,
  updateVacancy,
  deleteVacancy,
};