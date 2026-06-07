const asyncHandler = require('../utils/asyncHandler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const config = require('../config');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret
});

// @desc    Create a new donation order
// @route   POST /api/v1/donation/create-order
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency, donorName, donorEmail, donorPhone, purpose, donationType, isAnonymous, message } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid amount (minimum ₹1)'
    });
  }

  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency || 'INR',
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1 // Auto capture
  };

  let order;
  try {
    order = await razorpay.orders.create(options);
  } catch (err) {
    // Do not expose provider internals or secrets
    console.error('Razorpay create order error:', config.app.env === 'development' ? err.message : 'hidden');
    return res.status(502).json({ success: false, message: 'Payment gateway error. Please try again later.' });
  }

  const donation = await Donation.create({
    donorName: isAnonymous ? 'Anonymous' : donorName,
    donorEmail: isAnonymous ? 'anonymous@donor.com' : donorEmail,
    donorPhone: isAnonymous ? null : donorPhone,
    amount,
    currency: currency || 'INR',
    razorpayOrderId: order.id,
    purpose: purpose || 'general',
    donationType: donationType || 'one-time',
    isAnonymous: isAnonymous || false,
    message: message || null,
    status: 'pending'
  });

  res.status(200).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: config.razorpay.keyId,
      donationId: donation._id
    }
  });
});

// @desc    Verify payment after successful donation
// @route   POST /api/v1/donation/verify
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    donationId
  } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'failed',
        failureReason: 'Signature verification failed'
      }
    );

    return res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
  // Ensure donation exists and matches the provided donationId
  const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation order not found' });
  }

  if (donation._id.toString() !== donationId) {
    // Potential tampering: donationId does not match order
    return res.status(400).json({ success: false, message: 'Donation ID mismatch' });
  }

  // Update donation and rely on schema hooks for receipt generation
  donation.razorpayPaymentId = razorpay_payment_id;
  donation.razorpaySignature = razorpay_signature;
  donation.status = 'completed';
  donation.completedAt = Date.now();
  await donation.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully! Thank you for your donation.',
    data: {
      donationId: donation._id,
      receiptNumber: donation.receiptNumber,
      amount: donation.amount,
      donorName: donation.donorName
    }
  });
});

// @desc    Get all donations (Admin only)
// @route   GET /api/v1/admin/donations
// @access  Private/Admin
const getAllDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { status, purpose, fromDate, toDate } = req.query;

  let query = {};
  if (status) query.status = status;
  if (purpose) query.purpose = purpose;
  if (fromDate || toDate) {
    query.completedAt = {};
    if (fromDate) query.completedAt.$gte = new Date(fromDate);
    if (toDate) query.completedAt.$lte = new Date(toDate);
  }

  const donations = await Donation.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Donation.countDocuments(query);
  const totalAmount = await Donation.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    data: donations,
    summary: {
      totalDonations: total,
      totalAmount: totalAmount[0]?.total || 0
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get donation statistics (Admin only)
// @route   GET /api/v1/admin/donations/stats
// @access  Private/Admin
const getDonationStats = asyncHandler(async (req, res) => {
  const stats = await Donation.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: {
          month: { $month: '$completedAt' },
          year: { $year: '$completedAt' },
          purpose: '$purpose'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);

  const purposeWise = await Donation.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$purpose',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      monthlyStats: stats,
      purposeWise: purposeWise
    }
  });
});



// @desc    Delete a donation
// @route   DELETE /api/v1/donation/admin/donations/:id
// @access  Private/Admin
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting donation',
      error: error.message
    });
  }
};


module.exports = {
  createOrder,
  verifyPayment,
  getAllDonations,
  getDonationStats, 
  deleteDonation , 
};