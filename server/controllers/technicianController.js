import Technician from '../models/Technician.js';

// @route   GET /api/technicians
// @desc    Get all technicians (any authenticated user)
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: technicians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/technicians
// @desc    Create a new technician (Admin only)
export const createTechnician = async (req, res) => {
  const { name, phone } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Technician name is required.' });
    }

    const exists = await Technician.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'A technician with this name already exists.' });
    }

    const technician = await Technician.create({ name: name.trim(), phone: phone || '' });
    res.status(201).json({ success: true, data: technician });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/technicians/:id
// @desc    Update an existing technician (Admin only)
export const updateTechnician = async (req, res) => {
  const { id } = req.params;
  const { name, phone, active } = req.body;
  try {
    const technician = await Technician.findById(id);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found.' });
    }

    // Check duplicate name if changing
    if (name && name.trim() !== technician.name) {
      const duplicate = await Technician.findOne({ name: name.trim() });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Another technician with this name already exists.' });
      }
    }

    technician.name = name?.trim() || technician.name;
    technician.phone = phone !== undefined ? phone : technician.phone;
    if (active !== undefined) technician.active = active;

    const updated = await technician.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/technicians/:id
// @desc    Delete a technician (Admin only)
export const deleteTechnician = async (req, res) => {
  const { id } = req.params;
  try {
    const technician = await Technician.findByIdAndDelete(id);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found.' });
    }
    res.status(200).json({ success: true, message: 'Technician deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
