const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const parseNumber = (value, defaultValue) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return defaultValue !== undefined ? defaultValue : 0;
};

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return defaultValue;
};

const parseList = (value) => {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const schema = z.object({
  PORT: z.preprocess((val) => parseNumber(val, undefined), z.number().int().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  APP_NAME: z.string().default('SheCan-Connect'),

  MONGODB_URI: z.string().min(1),
  MONGODB_DEBUG: z.preprocess((val) => parseBoolean(val, false), z.boolean()).optional(),

  JWT_SECRET: z.string().min(1),
  JWT_EXPIRE: z.string().min(1),
  JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),

  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  ALLOWED_ORIGINS: z.string().optional().default(''),
  ALLOWED_METHODS: z.string().optional().default('GET,POST,PUT,DELETE'),

  RATE_LIMIT_WINDOW_MS: z.preprocess((val) => parseNumber(val, 900000), z.number().int().positive()),
  RATE_LIMIT_MAX: z.preprocess((val) => parseNumber(val, 100), z.number().int().positive()),

  MAX_FILE_SIZE: z.preprocess((val) => parseNumber(val, 5242880), z.number().int().positive()),
  ALLOWED_FILE_TYPES: z.string().optional().default('image/jpeg,image/png,image/webp'),

  LOG_LEVEL: z.string().default('info'),
  LOG_DIR: z.string().default('logs'),
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(6).default('Admin@123456')
});

const result = schema.safeParse(process.env);
if (!result.success) {
  const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

const env = result.data;

const config = {
  app: Object.freeze({
    name: env.APP_NAME,
    env: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    logLevel: env.LOG_LEVEL,
    debug: env.NODE_ENV !== 'production'
  }),
  db: Object.freeze({
    uri: env.MONGODB_URI,
    debug: env.MONGODB_DEBUG,
    options: Object.freeze({
      autoIndex: env.NODE_ENV !== 'production'
    })
  }),
  jwt: Object.freeze({
    secret: env.JWT_SECRET,
    expire: env.JWT_EXPIRE,
    algorithm: env.JWT_ALGORITHM
  }),
  razorpay: Object.freeze({
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
    webhookSecret: env.RAZORPAY_WEBHOOK_SECRET
  }),
  cors: Object.freeze({
    allowedOrigins: Object.freeze(parseList(env.ALLOWED_ORIGINS)),
    allowedMethods: Object.freeze(parseList(env.ALLOWED_METHODS))
  }),
  rateLimit: Object.freeze({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX
  }),
  upload: Object.freeze({
    maxFileSize: env.MAX_FILE_SIZE,
    allowedFileTypes: Object.freeze(parseList(env.ALLOWED_FILE_TYPES))
  }),
  logs: Object.freeze({
    level: env.LOG_LEVEL,
    dir: env.LOG_DIR,
    debug: env.NODE_ENV !== 'production'
  }),
  admin: Object.freeze({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD
  })
};

module.exports = Object.freeze(config);
