# Performance Baselines

PerfSight stores baseline performance metrics per user and per service in MongoDB.

## Data Format

Baselines are stored per user + service with:

- `service` (string)
- `avgLatency` (number)
- `p95Latency` (number)
- `updatedAt` (ISO date)

## API Endpoints

### List all baselines
```
GET /api/baselines
```

Returns baseline services for the authenticated user only.

### Get baseline for a service
```
GET /api/baselines/:service
```

Fetches the authenticated user's baseline for that service.

### Create/Update baseline
```
POST /api/baselines/:service
{
  "avgLatency": 45.23,
  "p95Latency": 120.50
}
```

Writes to the authenticated user's baseline file path.

All endpoints require authentication.

## Storage

Baselines are stored in MongoDB so the Baselines page can render directly from the database.
