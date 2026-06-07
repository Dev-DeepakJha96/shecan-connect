const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
    algorithm: config.jwt.algorithm
  });
};

// @desc    Login admin
// @route   POST /api/v1/admin/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Ensure admin account is active
  if (!admin.isActive) {
    return res.status(403).json({ success: false, message: 'Account is disabled. Contact super admin.' });
  }

  const isPasswordMatch = await admin.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  admin.lastLogin = Date.now();
  await admin.save();

  const token = generateToken(admin._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token
    }
  });
});

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalVolunteers = await Volunteer.countDocuments();
  const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
  const approvedVolunteers = await Volunteer.countDocuments({ status: 'approved' });
  const recentVolunteers = await Volunteer.find()
    .sort({ appliedAt: -1 })
    .limit(5)
    .select('fullName email status appliedAt');
  
  res.status(200).json({
    success: true,
    data: {
      totalVolunteers,
      pendingVolunteers,
      approvedVolunteers,
      recentVolunteers
    }
  });
});

// @desc    Get admin profile
// @route   GET /api/v1/admin/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {

  const admin = await Admin.findById(req.admin.id).select('-password');
  res.status(200).json({
    success: true,
    data: admin
  });
});
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

module.exports = {
  loginAdmin,
  getDashboardStats,
  getAdminProfile , 
  updateProfile ,
};