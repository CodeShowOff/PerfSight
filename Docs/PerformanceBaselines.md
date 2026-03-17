# Performance Baselines

This directory stores Git-tracked baseline performance metrics for each service.

## File Format

Each service has its own JSON file: `{service}.json`

### Structure

```json
{
  "service": "auth-service",
  "avgLatency": 45.23,
  "p95Latency": 120.50,
  "updatedAt": "2026-02-18T10:30:00.000Z"
}
```

## API Endpoints

### List all baselines
```
GET /api/baselines
```

### Get baseline for a service
```
GET /api/baselines/:service
```

### Create/Update baseline
```
POST /api/baselines/:service
{
  "avgLatency": 45.23,
  "p95Latency": 120.50
}
```

All endpoints require authentication.

## Git Tracking

These files are version-controlled to track performance expectations over time.
Commit baseline changes when performance targets are updated.
