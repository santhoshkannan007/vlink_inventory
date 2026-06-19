import User from '../models/User.js';

// @route   GET /api/users
// @desc    Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   POST /api/users
// @desc    Create a new user (Admin only)
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role: role || 'Staff' });

    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/users/:id
// @desc    Update an existing user (Admin only)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if email is being changed to one that already exists
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account.' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Only update password if a new one is provided
    if (password && password.trim() !== '') {
      user.password = password;
    }

    const updatedUser = await user.save(); // triggers pre-save hash if password changed

    res.status(200).json({
      success: true,
      data: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, createdAt: updatedUser.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only, cannot delete self)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Self-deletion guard
    if (req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
