const { z } = require('zod');

// Volunteer registration schema
const volunteerRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number'),
  availability: z.enum(['Weekdays', 'Weekends', 'Flexible', 'Specific Hours']),
  motivation: z.string().min(1, 'Motivation is required').max(1000, 'Motivation cannot exceed 1000 characters'),
  
  // ✅ FIXED: Accept string and convert to number
  age: z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().int().min(16).max(100).optional()),
  
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  profession: z.string().optional(),
  
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional(),
  
  // ✅ FIXED: Better skills handling
  skills: z.preprocess((val) => {
    if (!val) return [];
    if (typeof val === 'string') {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(val)) {
      return val.filter(s => typeof s === 'string' && s.trim() !== '');
    }
    return [];
  }, z.array(z.string()).default([])),
  
  // ✅ FIXED: Accept string and convert to number
  availableHours: z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().int().min(1).max(40).optional()),
  
  previousExperience: z.string().optional(),
  
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional()
  }).optional()
});

// Donation schemas
const createOrderSchema = z.object({
  amount: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') return Number(value);
    return value;
  }, z.number().int().min(1, 'Amount must be at least ₹1')),
  donorName: z.string().min(1, 'Donor name is required'),
  donorEmail: z.string().email('Valid email is required'),
  donorPhone: z.string().optional(),
  purpose: z.enum(['general', 'education', 'healthcare', 'food', 'emergency']).optional(),
  currency: z.string().optional(),
  donationType: z.enum(['one-time','monthly','yearly']).optional(),
  isAnonymous: z.preprocess((v) => {
    if (typeof v === 'string') return v === 'true';
    return v;
  }, z.boolean().optional()),
  message: z.string().optional()
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  donationId: z.string()
});

// Common param schemas
const idParamSchema = z.object({ id: z.string().min(1) });

const updateVolunteerStatusSchema = z.object({
  status: z.enum(['pending','approved','rejected','inactive']),
  adminNotes: z.string().max(500).optional()
});

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  status: z.string().optional()
});

// Admin schemas
const adminLoginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required')
});

// Metrics schemas
const metricsParamsSchema = z.object({
  key: z.string()
});

const metricsBodySchema = z.object({
  value: z.union([z.string(), z.number()])
});

module.exports = {
  volunteerRegisterSchema,
  createOrderSchema,
  verifyPaymentSchema,
  adminLoginSchema,
  metricsParamsSchema,
  metricsBodySchema,
  idParamSchema,
  updateVolunteerStatusSchema,
  paginationQuerySchema
};
