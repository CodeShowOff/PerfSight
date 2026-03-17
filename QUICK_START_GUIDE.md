# PerfSight Quick Start Guide - Adding & Monitoring Services

## 🎯 How It Works

PerfSight **automatically discovers services** when you send performance metrics. There's no manual service registration - just start sending data!

## 📊 What Services Should You Monitor?

Monitor any backend service or API in your system:

### Common Examples:
- **API Gateway** - Entry point for all requests
- **Auth Service** - Authentication/authorization
- **User Service** - User management
- **Payment Service** - Payment processing
- **Notification Service** - Email/SMS notifications
- **Database Service** - Database operations
- **Cache Service** - Redis/Memcached operations
- **File Service** - File upload/download
- **Search Service** - Search functionality
- **Analytics Service** - Data analytics

## 🔧 What to Monitor?

PerfSight tracks these key performance indicators:

### 1. **Latency Metrics** (Required)
- Response time (in milliseconds)
- Status codes (200, 404, 500, etc.)
- Endpoint paths
- HTTP methods

### 2. **Resource Metrics** (Optional)
- Memory usage
- CPU usage

### 3. **Performance Metrics** (Optional - Advanced)
- CPU cycles
- Cache misses
- Instruction counts

## 🚀 How to Add Services

### Step 1: Get Your Authentication Token

First, you need to login to get a JWT token:

```bash
# Register a new user (first time only)
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "yourpassword"
  }'

# Login to get JWT token
curl -X POST http://localhost:5000/api/users/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword"
  }'
```

The response will include a JWT token. Copy it for the next steps.

### Step 2: Send Metrics from Your Services

#### Option A: Manual Testing (curl)

Send a test metric for an "api-gateway" service:

```bash
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "api-gateway",
    "endpoint": "/api/users",
    "latency": 45.3,
    "memory": 256,
    "cpu": 12.5,
    "statusCode": 200
  }'
```

Send metrics for multiple services:

```bash
# Auth Service
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "auth-service",
    "endpoint": "/login",
    "latency": 120.5,
    "statusCode": 200
  }'

# Payment Service
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "payment-service",
    "endpoint": "/process-payment",
    "latency": 350.2,
    "statusCode": 200
  }'

# User Service
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "user-service",
    "endpoint": "/profile",
    "latency": 75.8,
    "statusCode": 200
  }'
```

#### Option B: Integrate into Your Real Services (Node.js Example)

```javascript
const axios = require('axios');

// Add this to your service middleware
async function sendMetricToPerfSight(req, res, next) {
  const startTime = Date.now();
  
  // Continue with request processing
  res.on('finish', async () => {
    const latency = Date.now() - startTime;
    
    try {
      await axios.post('http://localhost:5000/api/metrics', {
        service: 'your-service-name',
        endpoint: req.path,
        latency: latency,
        statusCode: res.statusCode,
        memory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        cpu: process.cpuUsage().user / 1000000 // seconds
      }, {
        headers: {
          'Authorization': `Bearer ${YOUR_JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Failed to send metric:', error.message);
    }
  });
  
  next();
}

// Use in Express app
app.use(sendMetricToPerfSight);
```

#### Option C: Python Integration

```python
import requests
import time

def send_metric(service_name, endpoint, latency, status_code):
    url = "http://localhost:5000/api/metrics"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {YOUR_JWT_TOKEN}"
    }
    data = {
        "service": service_name,
        "endpoint": endpoint,
        "latency": latency,
        "statusCode": status_code
    }
    
    try:
        requests.post(url, json=data, headers=headers)
    except Exception as e:
        print(f"Failed to send metric: {e}")

# Example usage in Flask
from flask import Flask
app = Flask(__name__)

@app.before_request
def before_request():
    g.start_time = time.time()

@app.after_request
def after_request(response):
    latency = (time.time() - g.start_time) * 1000  # Convert to ms
    send_metric(
        service_name="my-python-service",
        endpoint=request.path,
        latency=latency,
        status_code=response.status_code
    )
    return response
```

### Step 3: Wait for Analysis

The analysis worker runs **every 60 seconds** and processes the metrics. After sending metrics:

1. Wait 1-2 minutes for the worker to analyze data
2. Refresh your PerfSight dashboard
3. Your service will appear automatically!

### Step 4: Send Performance Metrics (Optional - Advanced)

For Unix/Linux systems, you can also send CPU-level performance data:

```bash
curl -X POST http://localhost:5000/api/perf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "api-gateway",
    "cpuCycles": 1234567890,
    "cacheMisses": 12345,
    "instructions": 9876543210
  }'
```

## 🎯 Test Script to Populate Dashboard

Here's a bash script to quickly populate your dashboard with test data:

```bash
#!/bin/bash

# Replace with your actual JWT token
TOKEN="YOUR_JWT_TOKEN_HERE"
API_URL="http://localhost:5000/api/metrics"

# Services to monitor
services=("api-gateway" "auth-service" "user-service" "payment-service" "notification-service")
endpoints=("/api/users" "/api/products" "/api/orders" "/login" "/register")

# Send 50 metrics for each service
for service in "${services[@]}"; do
  for i in {1..50}; do
    endpoint=${endpoints[$RANDOM % ${#endpoints[@]}]}
    latency=$((RANDOM % 200 + 20))  # 20-220ms
    status_code=200
    
    curl -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{
        \"service\": \"$service\",
        \"endpoint\": \"$endpoint\",
        \"latency\": $latency,
        \"memory\": $((RANDOM % 512 + 128)),
        \"cpu\": $((RANDOM % 50 + 5)),
        \"statusCode\": $status_code
      }" \
      --silent > /dev/null
    
    echo "Sent metric for $service - $endpoint ($latency ms)"
    sleep 0.1
  done
done

echo "✅ Sent metrics for ${#services[@]} services!"
echo "⏳ Wait 60 seconds for the analysis worker to process..."
echo "🔄 Then refresh your dashboard!"
```

Save as `populate_metrics.sh` and run:

```bash
chmod +x populate_metrics.sh
./populate_metrics.sh
```

## 📈 What Happens After Sending Metrics?

1. **Metrics are stored** in MongoDB
2. **Analysis worker** (runs every 60s) calculates:
   - Average latency
   - P95 latency (95th percentile)
   - Request counts
   - Performance trends
3. **Regression detection** compares current performance to baselines
4. **Alerts are generated** for performance degradations
5. **Dashboard updates** with charts and health indicators

## 🎨 Dashboard Features

Once services are added, you'll see:

- **Service cards** with health status (green/yellow/red)
- **Latency charts** with time-series data
- **Regression alerts** when performance degrades
- **Performance metrics** (if you send perf data)
- **Baseline comparisons** (set baselines via API)

## 🔍 Monitoring Best Practices

1. **Send metrics regularly** - At least every few seconds for accurate monitoring
2. **Use distinct service names** - Keep them consistent across requests
3. **Include endpoint paths** - Helps identify slow endpoints
4. **Send real data** - Use actual response times from your services
5. **Set baselines** after stabilization - Define "good" performance thresholds
6. **Monitor the worker** - Check `backend/npm run worker` is running

## 🆘 Troubleshooting

### Services not appearing?
- ✅ Check if backend server is running (`http://localhost:5000`)
- ✅ Check if analysis worker is running (`npm run worker`)
- ✅ Wait 60+ seconds after sending metrics
- ✅ Verify JWT token is valid
- ✅ Check MongoDB is running and connected

### No charts showing?
- ✅ Send at least 5-10 metrics per service
- ✅ Wait for analysis worker to complete one cycle
- ✅ Check browser console for errors

### Worker errors?
- ✅ Ensure MongoDB connection is stable
- ✅ Check `baselines/` directory exists
- ✅ Verify sufficient metrics data in database

## 🎓 Next Steps

1. ✅ Send test metrics for 2-3 services
2. ✅ Wait 60 seconds for analysis
3. ✅ Check dashboard at `http://localhost:3000`
4. ✅ Set baselines: `POST /api/baselines/:service`
5. ✅ Integrate real services using middleware
6. ✅ Monitor regression alerts

## 📚 Additional Resources

- [API Documentation](README.md#-api-endpoints)
- [Architecture Overview](README.md#-workflow)
- [Security Features](README.md#-security-features)

---

**Need help?** Check the metrics in MongoDB:
```bash
# Connect to MongoDB
mongosh perfsight

# View all metrics
db.metrics.find().pretty()

# View services
db.metrics.distinct("service")

# View analyses
db.analyses.find().pretty()
```
