const asyncHandler = require('../utils/asyncHandler.js');
const Volunteer = require('../models/Volunteer.js');
const generateTrackingId = require('../utils/trackingId');
const sendStatusEmail = require('../email/email.service');

// @desc    Register new volunteer
// @route   POST /api/v1/volunteer/register
// @access  Public
const registerVolunteer = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body; 
    const existingVolunteer = await Volunteer.findOne({email}); 
    if(existingVolunteer){
      return res.status(400).json({
        success : false , 
        message : 'you hanve already applied. Use your tracking ID to track your status!'
      }); 
    }
    const trackingId = await generateTrackingId(); 

    const volunteer = await Volunteer.create({
      ...req.body , 
      trackingId , 
      status : 'pending' , 
      statusHistory: [{
        status : 'pending' , 
        changedAt: new Date(), 
        notes : 'Application submitted' 
      }]
    });

    await sendStatusEmail(volunteer.email, volunteer.fullName, 'submitted', trackingId)
    
    return res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully!',
      data: {
        trackingId , 
        name: volunteer.fullName,
        email: volunteer.email,
        status: volunteer.status
      }
    });
  } catch (err) {
    // Duplicate key (email) handling
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already registered with this email' });
    }
    throw err;
  }
});

// @desc    Get all volunteers (Admin only)
// @route   GET /api/v1/admin/volunteers
// @access  Private/Admin
const getAllVolunteers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  let query = {};
  if (status) query.status = status;

  const volunteers = await Volunteer.find(query)
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Volunteer.countDocuments(query);

  res.status(200).json({
    success: true,
    data: volunteers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single volunteer
// @route   GET /api/v1/admin/volunteers/:id
// @access  Private/Admin
const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    return res.status(404).json({
      success: false,
      message: 'Volunteer not found'
    });
  }

  res.status(200).json({
    success: true,
    data: volunteer
  });
});

// @desc    Update volunteer status
// @route   PUT /api/v1/admin/volunteers/:id/status
// @access  Private/Admin
const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const { id } = req.params;

  const volunteer = await Volunteer.findById(req.params.id); 

  if (!volunteer) {
    return res.status(404).json({
      success: false,
      message: 'Volunteer not found'
    });
  }
  const oldStatus = volunteer.status; 
   
      volunteer.status = status;
    volunteer.adminNotes = adminNotes;
    volunteer.updatedAt = Date.now();
    volunteer.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.admin.id,
      notes: adminNotes
    });
    
    await volunteer.save();

    if (oldStatus !== status) {
      await sendStatusEmail(
        volunteer.email, 
        volunteer.fullName, 
        status,
        volunteer.trackingId
      );
    }
  res.status(200).json({
    success: true,
    message: `Volunteer status updated to ${status}`,
    data: volunteer
  });
});

// @desc    Delete volunteer
// @route   DELETE /api/v1/admin/volunteers/:id
// @access  Private/Admin
const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

  if (!volunteer) {
    return res.status(404).json({
      success: false,
      message: 'Volunteer not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Volunteer deleted successfully'
  });
});

module.exports = {
  registerVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer
};