const express = require('express');

const {
  createOrder,
  verifyPayment,
  getAllDonations,
  getDonationStats , 
  deleteDonation
} = require('../controllers/donationController');
const { protect, roleCheck } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/zodValidation');
const { createOrderSchema, verifyPaymentSchema, paginationQuerySchema } = require('../validation/schemas');

const router = express.Router();


// Public routes
router.post('/create-order', validate({ body: createOrderSchema }), createOrder);
router.post('/verify', validate({ body: verifyPaymentSchema }), verifyPayment);

// Protected routes (Admin only)
router.get('/admin/donations', protect, roleCheck('admin', 'super_admin', 'editor'), validate({ query: paginationQuerySchema }), getAllDonations);
router.get('/admin/donations/stats', protect, roleCheck('admin', 'super_admin'), getDonationStats);
// Delete donation (Admin only)
router.delete('/admin/donations/:id', protect, roleCheck('admin', 'super_admin'), deleteDonation);

module.exports = router;