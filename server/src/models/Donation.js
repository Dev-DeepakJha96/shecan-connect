const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: [true, 'Donor name is required'],
    trim: true
  },
  donorEmail: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  donorPhone: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Minimum donation is ₹1']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'bank_transfer'],
    default: 'razorpay'
  },
  razorpayOrderId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpaySignature: String,
  donationType: {
    type: String,
    enum: ['one-time', 'monthly', 'yearly'],
    default: 'one-time'
  },
  purpose: {
    type: String,
    enum: ['general', 'education', 'healthcare', 'food', 'emergency'],
    default: 'general'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: 500
  },
  taxReceiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptNumber: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  failureReason: String,
  completedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
donationSchema.index({ donorEmail: 1, createdAt: -1 });
donationSchema.index({ status: 1 });

// Generate receipt number
donationSchema.pre('save', function() {
  if (this.status === 'completed' && !this.receiptNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.receiptNumber = `NGO${year}${random}`;
  }
});

module.exports = mongoose.model('Donation', donationSchema);