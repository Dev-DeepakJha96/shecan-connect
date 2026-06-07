const express = require('express');
const { registerVolunteer ,  } = require('../controllers/volunteerController');
const { volunteerRegisterSchema } = require('../validation/schemas');
const { validate } = require('../middleware/zodValidation');
const trackingApplication = require('../controllers/trackingController');

const router = express.Router();

// Public routes
router.post('/register', validate({ body: volunteerRegisterSchema }), registerVolunteer);
router.get('/track/:trackingId', trackingApplication);

module.exports = router;