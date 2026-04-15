# PerfSight

**Performance Monitoring Platform** - A comprehensive full-stack application for real-time performance monitoring, regression detection, and Git-tracked baseline management.

## 🚀 Features

### Backend Features
- **Real-time Metrics Ingestion** - Collect latency, throughput, and performance data
- **Regression Detection** - Hybrid z-score + baseline comparison algorithms
- **Git-Tracked Baselines** - Version-controlled per-user performance baselines stored as JSON
- **Unix Perf Integration** - CPU cycles, cache misses, instruction counts
- **Automated Analysis Worker** - Background processing every 60 seconds
- **Comprehensive Reports** - Aggregated analysis with actionable insights
- **Secure Authentication** - JWT-based auth with HTTP-only cookies
- **Rate Limiting** - DDoS protection with express-rate-limit
- **Input Validation** - Joi schemas for all API endpoints
- **Security Headers** - Helmet middleware for production-ready security

### Frontend Features
- **Modern Landing Page** - Beautiful gradient hero with feature showcase
- **System Dashboard** - Real-time overview of all monitored services
- **Service Details** - Deep dive into individual service performance
- **Interactive Charts** - Recharts-powered latency and performance visualizations
- **Regression Alerts** - Critical and warning-level performance notifications
- **Reports & Baselines** - Browse historical data and Git baselines
- **Skeleton Loading** - Smooth UX with animated loading states
- **Performance Optimized** - React.memo, useMemo, custom hooks
- **Responsive Design** - Mobile, tablet, and desktop support
- **Redux State Management** - Centralized auth and API state

## 📋 Prerequisites

- **Node.js** v18+ (recommended: v20+)
- **MongoDB** v5+ (local or Atlas)
- **Git** (for baseline management)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/perfsight.git
cd PerfSight
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/perfsight
JWT_SECRET=your_jwt_secret_key_here

# MongoDB TTL retention (days). Default: 30
DATA_RETENTION_DAYS=30
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/perfsight?retryWrites=true&w=majority
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Analysis Worker (Optional):**
```bash
cd backend
npm run worker
```

**Terminal 3 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Run Production Server:**
```bash
cd backend
NODE_ENV=production npm start
```
App runs on: `http://localhost:5000` (serves both API and frontend)

## 📁 Project Structure

```
PerfSight/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT authentication
│   │   │   └── errorMiddleware.js # Error handling
│   │   ├── modules/
│   │   │   ├── users/             # User authentication
│   │   │   ├── metrics/           # Metric ingestion
│   │   │   ├── analysis/          # Rolling window analysis
│   │   │   ├── regression/        # Regression detection
│   │   │   ├── baseline/          # Git baseline management
│   │   │   ├── perf/              # Unix perf metrics
│   │   │   ├── report/            # Aggregated reports
│   │   │   └── dashboard/         # Dashboard API
│   │   ├── workers/
│   │   │   └── analysis.worker.js # Background analysis
│   │   ├── app.js                 # Express app config
│   │   └── server.js              # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Main entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js     # Axios configuration
│   │   ├── components/
│   │   │   ├── dashboard/         # ServiceCard, LoadingState
│   │   │   ├── service/           # SummaryCard, PerfMetricsCard
│   │   │   ├── charts/            # LatencyChart, RangeSelector
│   │   │   ├── alerts/            # AlertBanner, SeverityBadge
│   │   │   ├── reports/           # ReportTable
│   │   │   ├── baselines/         # BaselineCard, BaselineList
│   │   │   ├── skeletons/         # Loading skeletons
│   │   │   └── layout/            # Header, Sidebar, DashboardLayout
│   │   ├── hooks/
│   │   │   ├── api/               # Custom data-fetching hooks
│   │   │   └── useScrollToTop.js  # Navigation scroll utility
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # System overview
│   │   │   ├── ServiceDetails.jsx # Service deep dive
│   │   │   ├── Reports.jsx        # Reports browser
│   │   │   ├── Baselines.jsx      # Git baselines
│   │   │   └── Perf.jsx           # Perf metrics
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx     # Landing page
│   │   │   ├── LoginScreen.jsx    # Authentication
│   │   │   └── RegisterScreen.jsx # User registration
│   │   ├── slices/
│   │   │   ├── authSlice.js       # Auth state
│   │   │   └── apiSlice.js        # RTK Query
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── store.js               # Redux store
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── baselines/                     # Per-user baselines: <userId>/<service>.json
│   └── README.md                  # Baseline docs
│
└── README.md                      # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/users/auth` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Metrics
- `POST /api/metrics` - Ingest metric (protected)
- `GET /api/metrics/recent?service=:service` - Get recent metrics (protected)
- `GET /api/metrics/timeseries` - Get latency timeseries (protected)
- `GET /api/metrics/endpoint-summary` - Get endpoint summary (protected)
- `GET /api/metrics/overview` - Get system overview (protected)

### Baselines
- `GET /api/baselines` - Get current user's baseline services (protected)
- `GET /api/baselines/:service` - Get current user's baseline for service (protected)
- `POST /api/baselines/:service` - Update current user's baseline (protected)

### Performance Metrics
- `POST /api/perf` - Ingest perf metric (protected)
- `GET /api/perf/timeseries` - Get perf timeseries (protected)

### Reports
- `POST /api/reports/:service` - Create report (protected)
- `GET /api/reports/:service` - Get reports for service (protected)

### Dashboard
- `GET /api/dashboard/overview/:service` - Get service overview (protected)
- `GET /api/dashboard/system-health` - Get system health (protected)
- `GET /api/dashboard/latency-chart/:service` - Get latency chart data (protected)

## 🧪 Testing

### Test Metric Ingestion

```bash
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service": "api-gateway",
    "endpoint": "/users",
    "method": "GET",
    "latency": 45.3,
    "statusCode": 200
  }'
```

### Test Perf Metric Ingestion

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

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **HTTP-Only Cookies** - Prevents XSS attacks
3. **Rate Limiting** - 20 requests per 15 minutes on auth routes
4. **Helmet.js** - Security headers (CSP, HSTS, etc.)
5. **CORS** - Configured for development and production
6. **Input Validation** - Joi schemas prevent NoSQL injection
7. **Password Hashing** - bcrypt with salt rounds

## 🎨 Frontend Technologies

- **React 19** - Latest React with concurrent features
- **Vite 6.3.5** - Lightning-fast build tool
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Bootstrap 5** - Responsive UI framework
- **Recharts** - Interactive charts
- **Axios** - HTTP client
- **React Toastify** - Toast notifications

## 🛠️ Backend Technologies

- **Node.js** - JavaScript runtime
- **Express 4.18** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 7.1** - ODM for MongoDB
- **JWT** - JSON Web Tokens
- **Joi** - Schema validation
- **Helmet** - Security middleware
- **bcryptjs** - Password hashing

## 📊 Performance Optimizations

### Frontend
- React.memo for expensive components
- useMemo for derived computations
- Custom hooks for data fetching
- Skeleton loading states
- Code splitting ready
- Optimized bundle size

### Backend
- Background workers for analysis
- Indexed MongoDB queries
- Rate limiting
- Request size limits (10kb)
- Connection pooling

## 🐛 Known Issues

1. Bundle size warning (>500KB) - Consider implementing code splitting for production
2. Worker runs independently - Ensure MongoDB is running before starting worker
3. Baseline directory must exist - Create `baselines/` folder if missing

## 🔄 Workflow

1. **Metric Collection** - Services send metrics via POST /api/metrics
2. **Analysis Worker** - Runs every 60s, computes rolling window analysis
3. **Regression Detection** - Hybrid z-score + baseline comparison
4. **Report Generation** - Aggregates analysis, baselines, regressions, perf data
5. **Dashboard Display** - Frontend visualizes data with charts and alerts
6. **Baseline Management** - Commit per-user baselines (`baselines/<userId>/<service>.json`) to Git for version control

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development|production
PORT=5000
MONGO_URI=mongodb://localhost:27017/perfsight
JWT_SECRET=your_secret_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shubham**

## 🙏 Acknowledgments

- Express.js team for the robust web framework
- React team for the amazing UI library
- MongoDB team for the flexible database
- All open-source contributors

---

**Built with ❤️ for performance monitoring**
