const Schedule = require('../../models/TransportManager/Schedule');

// Create new schedule
exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ departureDate: 1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

// Update schedule status
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Schedule.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};
