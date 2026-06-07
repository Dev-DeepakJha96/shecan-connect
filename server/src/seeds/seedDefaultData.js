const dotenv = require('dotenv').config();
const config = require('../config');
const connectDB = require('../config/database');
const Admin = require('../models/admin');
const ImpactMetrics = require('../models/ImpactMetrics');

const defaultMetrics = [
  { metricKey: 'children_helped', label: 'Children Helped', value: 5000, unit: 'children', icon: '👧', description: 'Number of children supported through our programs' },
  { metricKey: 'meals_served', label: 'Meals Served', value: 25000, unit: 'meals', icon: '🍲', description: 'Total meals distributed to needy families' },
  { metricKey: 'volunteers', label: 'Active Volunteers', value: 150, unit: 'volunteers', icon: '🤝', description: 'Dedicated volunteers making a difference' },
  { metricKey: 'villages', label: 'Villages Reached', value: 45, unit: 'villages', icon: '🏘️', description: 'Communities we have impacted' }
];

const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: config.admin.email });
    if (!adminExists) {
      await Admin.create({
        name: 'Super Admin',
        email: config.admin.email,
        password: config.admin.password,
        role: 'super_admin',
        permissions: ['manage_volunteers', 'manage_donations', 'manage_gallery', 'manage_metrics', 'manage_admins']
      });
      console.log('✅ Default admin created');
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
    process.exit(1);
  }
};

const createDefaultMetrics = async () => {
  try {
    for (const metric of defaultMetrics) {
      const exists = await ImpactMetrics.findOne({ metricKey: metric.metricKey });
      if (!exists) {
        await ImpactMetrics.create(metric);
        console.log(`✅ Created metric: ${metric.metricKey}`);
      } else {
        console.log(`✅ Metric already exists: ${metric.metricKey}`);
      }
    }
  } catch (error) {
    console.error('Error creating default metrics:', error.message);
    process.exit(1);
  }
};

const seedDefaultData = async () => {
  await connectDB();
  await createDefaultAdmin();
  await createDefaultMetrics();
  process.exit(0);
};

seedDefaultData();
