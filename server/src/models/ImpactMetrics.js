const mongoose = require('mongoose');

const impactMetricsSchema = new mongoose.Schema({
  metricKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  unit: String,
  icon: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ImpactMetrics', impactMetricsSchema);

