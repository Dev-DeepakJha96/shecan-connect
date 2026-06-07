const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please provide a valid Indian mobile number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  age: {
    type: Number,  // ✅ CHANGED from String to Number
    min: [16, 'Minimum age is 16 years'],
    max: [100, 'Maximum age is 100 years']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  profession: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Flexible', 'Specific Hours'],
    required: true
  },
  availableHours: {
    type: Number,  // ✅ CHANGED from String to Number
    min: 1,
    max: 40
  },
  previousExperience: {
    type: String,
    maxlength: 500
  },
  motivation: {
    type: String,
    required: [true, 'Please tell us why you want to volunteer'],
    maxlength: 1000
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: 500
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  lastContacted: Date , 
  trackingId: {
    type:String , 
    unique: true , 
    sparse: true 
  }, 
  statusHistory: [{
    status: String , 
    changedAt: Date , 
    changedBy: {type : mongoose.Schema.ObjectId, ref: 'Admin' }, 
    notes : String 
  }], 
  lastStatusEmailSent: {
    type: String,
    default: null,
  }
}, {
  timestamps: true
});

// Create indexes
volunteerSchema.index({ email: 1, status: 1 });
volunteerSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);