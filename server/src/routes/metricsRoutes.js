const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ImpactMetrics = require('../models/ImpactMetrics');
const { protect, roleCheck } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/zodValidation');
const { metricsParamsSchema, metricsBodySchema } = require('../validation/schemas');

const router = express.Router();

// @desc    Get all impact metrics (Public)
// @route   GET /api/v1/impact/metrics
// @access  Public
router.get('/impact/metrics', asyncHandler(async (req, res) => {
  const metrics = await ImpactMetrics.find({ isActive: true });
  res.status(200).json({
    success: true,
    data: metrics
  });
}));

// @desc    Update impact metrics (Admin only)
// @route   PUT /api/v1/admin/impact/:key
// @access  Private/Admin
router.put('/admin/impact/:key', protect, roleCheck('admin', 'super_admin', 'editor'), validate({ params: metricsParamsSchema, body: metricsBodySchema }), asyncHandler(async (req, res) => {
  const { value } = req.body;
  const metric = await ImpactMetrics.findOneAndUpdate(
    { metricKey: req.params.key },
    { value, updatedAt: Date.now() },
    { new: true, upsert: true }
  );
  
  res.status(200).json({
    success: true,
    data: metric
  });
}));

// @desc    Create new impact metric
// @route   POST /api/v1/admin/impact
// @access  Private/Admin
router.post('/admin/impact', protect, roleCheck('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const { metricKey, label, value, unit, icon, description } = req.body;
  
  // Check if metric already exists
  const existingMetric = await ImpactMetrics.findOne({ metricKey });
  if (existingMetric) {
    return res.status(400).json({
      success: false,
      message: 'Metric key already exists'
    });
  }
  
  const metric = await ImpactMetrics.create({
    metricKey,
    label,
    value: value || 0,
    unit,
    icon: icon || 'trending-up',
    description,
    isActive: true
  });
  
  res.status(201).json({
    success: true,
    data: metric
  });
}));

// @desc    Delete impact metric
// @route   DELETE /api/v1/admin/impact/:key
// @access  Private/Admin
router.delete('/admin/impact/:key', protect, roleCheck('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const metric = await ImpactMetrics.findOneAndDelete({ metricKey: req.params.key });
  
  if (!metric) {
    return res.status(404).json({
      success: false,
      message: 'Metric not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Metric deleted successfully'
  });
}));
module.exports = router;