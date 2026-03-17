/**
 * PerfSight Test Data Generator
 * Populates your dashboard with sample performance metrics
 * 
 * Usage:
 *   node populate-metrics.js YOUR_JWT_TOKEN_HERE
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api/metrics';
const METRICS_PER_SERVICE = 50;

// Get JWT token from command line argument
const JWT_TOKEN = process.argv[2];

if (!JWT_TOKEN) {
  console.error('❌ Error: JWT token is required!\n');
  console.log('Usage:');
  console.log('  node populate-metrics.js YOUR_JWT_TOKEN_HERE\n');
  console.log('To get a token:');
  console.log('  1. Register: POST http://localhost:5000/api/users');
  console.log('  2. Login: POST http://localhost:5000/api/users/auth');
  console.log('  3. Copy the JWT token from the response');
  process.exit(1);
}

// Services to monitor
const services = [
  'api-gateway',
  'auth-service',
  'user-service',
  'payment-service',
  'notification-service',
];

const endpoints = [
  '/api/users',
  '/api/products',
  '/api/orders',
  '/login',
  '/register',
  '/profile',
  '/search',
  '/checkout',
];

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Send a metric to PerfSight API
 */
async function sendMetric(service, endpoint, latency, statusCode) {
  const metric = {
    service,
    endpoint,
    latency,
    memory: randomInt(128, 512),
    cpu: randomInt(5, 50),
    statusCode,
  };

  try {
    await axios.post(API_URL, metric, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
      },
    });
    return true;
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate test data for all services
 */
async function populateMetrics() {
  console.log('🚀 PerfSight Test Data Generator');
  console.log('=================================\n');
  console.log(`📊 Services: ${services.length}`);
  console.log(`📈 Metrics per service: ${METRICS_PER_SERVICE}`);
  console.log(`🎯 Total metrics: ${services.length * METRICS_PER_SERVICE}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const service of services) {
    console.log(`📤 Sending metrics for: ${service}`);

    for (let i = 1; i <= METRICS_PER_SERVICE; i++) {
      const endpoint = randomElement(endpoints);
      
      // Generate realistic latency (mostly 20-300ms, occasionally slow)
      let latency = randomInt(20, 300);
      if (Math.random() > 0.9) {
        latency = randomInt(500, 2000); // 10% chance of slow request
      }

      // Occasionally simulate errors (5% chance)
      const statusCode = Math.random() > 0.95 
        ? randomElement([400, 404, 500]) 
        : 200;

      const success = await sendMetric(service, endpoint, latency, statusCode);
      
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      // Show progress every 10 metrics
      if (i % 10 === 0) {
        console.log(`  ✓ Sent ${i}/${METRICS_PER_SERVICE} metrics`);
      }

      // Small delay to avoid overwhelming the server
      await sleep(100);
    }

    console.log(`  ✅ Completed ${service} (${METRICS_PER_SERVICE} metrics)\n`);
  }

  console.log('=================================');
  console.log('📊 Summary');
  console.log('=================================');
  console.log(`✅ Successful: ${successCount}`);
  if (failureCount > 0) {
    console.log(`❌ Failed: ${failureCount}`);
  }
  console.log('\n⏳ Next Steps:');
  console.log('  1. Wait 60 seconds for the analysis worker to process metrics');
  console.log('  2. Make sure the worker is running: npm run worker');
  console.log('  3. Refresh your dashboard at http://localhost:3000');
  console.log('\n🎉 Done! Your dashboard should populate soon!');
}

// Run the script
populateMetrics().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
