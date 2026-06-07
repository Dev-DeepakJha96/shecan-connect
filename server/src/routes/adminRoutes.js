const express = require('express');
const { 
  loginAdmin, 
  getDashboardStats, 
  getAdminProfile , 
  updateProfile ,
} = require('../controllers/adminController.js');
const {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer ,     
} = require('../controllers/volunteerController');
const { protect, roleCheck } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/zodValidation');
const { adminLoginSchema, idParamSchema, updateVolunteerStatusSchema } = require('../validation/schemas');
const rateLimit = require('express-rate-limit');

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

const router = express.Router();

// Public routes
router.post('/auth/login', authLimiter, validate({ body: adminLoginSchema }), loginAdmin);

// Protected routes (all routes below require authentication)
router.use(protect);

// Dashboard
router.get('/dashboard/stats', roleCheck('admin', 'super_admin'), getDashboardStats);

// Profile
router.get('/profile',roleCheck('admin', 'super_admin'), getAdminProfile);
router.put('/profile',roleCheck('admin', 'super_admin'), updateProfile);

// Volunteer management
router.get('/volunteers', roleCheck('admin', 'super_admin', 'editor'), validate({ query: require('../validation/schemas').paginationQuerySchema }), getAllVolunteers);
router.get('/volunteers/:id', roleCheck('admin', 'super_admin', 'editor'), validate({ params: idParamSchema }), getVolunteerById);
router.put('/volunteers/:id/status', roleCheck('admin', 'super_admin'), validate({ params: idParamSchema, body: updateVolunteerStatusSchema }), updateVolunteerStatus);
router.delete('/volunteers/:id', roleCheck('super_admin'), validate({ params: idParamSchema }), deleteVolunteer);

module.exports = router;