# PerfSight Backend Deep-Dive Guide

> Audience: someone brand-new to this backend who wants to understand **what it does, why it exists, and how it works internally**.

---

## 1) What is this backend, in plain English?

PerfSight backend is a **performance monitoring API + processing engine**.

Think of it like this:
- Your services (API gateway, auth service, payments, etc.) send runtime metrics (latency, status codes, resource usage).
- This backend stores those metrics in MongoDB.
- A background worker analyzes recent data every ~60 seconds.
- It detects regressions (performance got worse), compares with saved baselines, and generates reports.
- The frontend reads these APIs to show dashboards, charts, alerts, and history.

So the backend is not just CRUD—it’s the core intelligence + storage layer for performance observability.

---

## 2) Purpose and objectives

### Primary purpose
Provide a centralized way to:
1. Collect performance telemetry.
2. Analyze behavior over time.
3. Detect degradation early.
4. Compare current behavior against expected baseline.
5. Expose results for dashboards and reporting.

### Product objectives implemented in code
- **Operational visibility**: latency trends, endpoint summaries, system overviews.
- **Regression detection**: hybrid statistical + baseline-based logic.
- **Historical evidence**: reports stored over time.
- **Security by default**: authentication, secure cookies, CORS, rate limiting, headers.
- **Safe input handling**: Joi validation on request payloads and query params.
- **Low-friction operations**: worker process, simple env setup, deployment config.

---

## 3) High-level architecture

Backend follows a modular Express architecture:

- **Entry/bootstrap**: `src/server.js`, `src/app.js`
- **Config**: `src/config/*`
- **Middleware**: auth/CORS/error handling in `src/middleware/*`
- **Domain modules**: `src/modules/*`
- **Background processing**: `src/workers/analysis.worker.js`

Typical request flow:

1. HTTP request reaches Express (`app.js`).
2. Security middleware runs (`helmet`, CORS, parsers, rate limits).
3. Route dispatches to module controller.
4. Controller validates/normalizes input (directly or via middleware).
5. Controller calls service functions.
6. Service reads/writes DB (Mongoose) or filesystem (baselines).
7. Controller returns `success/data` JSON.
8. Central error middleware formats failures consistently.

Worker flow (separate process):

1. Connect to DB.
2. Every interval (default 60s), get distinct services from metrics.
3. Compute rolling analysis snapshot per service.
4. Run regression detection.
5. Save regression event if detected.
6. Generate + save report.

---

## 4) Startup and lifecycle

### API server startup (`src/server.js`)
- Loads app + DB config.
- Connects MongoDB before listening.
- Starts server on `PORT` (default 5000).
- Implements graceful shutdown for:
  - `SIGINT`, `SIGTERM`
  - `unhandledRejection`, `uncaughtException`
- On shutdown:
  - closes HTTP server
  - disconnects MongoDB
  - exits cleanly

### Express app setup (`src/app.js`)
- `helmet()` for secure HTTP headers.
- CORS middleware with env-aware allowlist.
- Auth rate limiter on `/api/users` routes.
- JSON/urlencoded body size limited to `10kb`.
- Cookie parsing enabled.
- Health endpoint: `GET /health`.
- API route registration:
  - `/api/users`
  - `/api/metrics`
  - `/api/baselines`
  - `/api/perf`
  - `/api/reports`
  - `/api/dashboard`
- In production, serves frontend static build.
- Fallback 404 + centralized error handler.

---

## 5) Configuration and environment

### Environment variables
Defined in `backend/.env.example`:
- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`

Read through `src/config/env.js` via `dotenv`.

### Database config (`src/config/db.js`)
- Uses Mongoose.
- Prevents duplicate concurrent connect attempts via `connectionPromise`.
- Throws if `MONGO_URI` missing.
- Exposes `connectDB()` and `disconnectDB()`.

### Worker config (`src/config/worker.config.js`)
- `WORKER_INTERVAL_MS` default = `60000` ms.

### Deployment config
`backend/render.yaml` contains minimal Render service commands:
- build: `npm install`
- start: `npm run start`

---

## 6) Security model

### Authentication
- JWT generated in `src/utils/generateToken.js`.
- Token is set in **HTTP-only cookie** (`jwt`) with:
  - `httpOnly: true`
  - `sameSite: 'strict'`
  - `secure` in non-development
  - 30-day lifetime
- Protected routes use `protect` middleware (`authMiddleware.js`), which:
  - reads `req.cookies.jwt`
  - verifies token with `JWT_SECRET`
  - loads current user without password

> Important implementation note: current auth middleware reads JWT from cookie (not Authorization header), so client auth should be cookie-based with credentials enabled.

### Other security protections
- `helmet` headers.
- CORS allowlist based on `FRONTEND_URL` and local dev origin.
- Rate limiting on auth endpoints (20 requests / 15 min).
- Request payload size caps.
- Input validation using Joi.
- Password hashing with bcrypt (salt rounds = 10).

---

## 7) Data model overview (Mongo + filesystem)

### MongoDB collections via Mongoose models

1. **User** (`users.model.js`)
   - name, email (unique), password
   - pre-save hooks: normalize email + hash password

2. **Metric** (`metrics.model.js`)
   - service, endpoint, latency, memory, cpu, statusCode, timestamp
   - indexes:
     - `{ service: 1, timestamp: -1 }`
     - `{ endpoint: 1 }`

3. **Analysis** (`analysis.model.js`)
   - rolling window snapshot:
     - service, windowStart, windowEnd
     - avgLatency, p95Latency, requestCount

4. **Regression** (`regression.model.js`)
   - detected performance degradation event
   - includes z-score stats + optional baseline deviation + severity

5. **Perf** (`perf.model.js`)
   - low-level perf counters: cpuCycles, cacheMisses, instructions

6. **Report** (`report.model.js`)
   - aggregated cross-module snapshot for a service

### Filesystem-based baselines
- Baselines are JSON files in `backend/baselines/`.
- One file per service (`{service}.json`).
- Managed by `baseline.service.js`.
- Service names are sanitized to avoid path traversal.
- Directory auto-created if missing.

This gives a hybrid storage strategy:
- dynamic time-series + events in MongoDB
- human-reviewable, Git-trackable targets in JSON files

---

## 8) Feature-by-feature module breakdown

## 8.1 Users module (`/api/users`)

Files:
- `users.routes.js`
- `users.controller.js`
- `users.model.js`

Endpoints:
- `POST /api/users` register
- `POST /api/users/auth` login
- `POST /api/users/logout` logout
- `GET /api/users/profile` protected
- `PUT /api/users/profile` protected

Behavior:
- Joi validates register/login/update payloads.
- Email normalized to lowercase.
- Passwords hashed by model pre-save hook.
- On login/register, JWT cookie is set.

---

## 8.2 Metrics module (`/api/metrics`)

Files:
- `metrics.routes.js`
- `metrics.controller.js`
- `metrics.validation.js`
- `metrics.service.js`
- `metrics.model.js`

Endpoints:
- `POST /api/metrics` ingest one metric
- `GET /api/metrics/recent`
- `GET /api/metrics/timeseries`
- `GET /api/metrics/endpoint-summary`
- `GET /api/metrics/overview`

What it computes:
- **Recent metrics** with optional filters and limit guard (1..500).
- **Latency timeseries** bucketed by interval (`minute`, `5minute`, `hour`) using `$dateTrunc`.
- **Endpoint summary** with avg latency, request count, error rate.
- **System overview** with avg latency, p95, total requests.

p95 logic:
- Prefers MongoDB `$percentile` (newer versions).
- Falls back to sorted-array percentile method when needed.

---

## 8.3 Baseline module (`/api/baselines`)

Files:
- `baseline.routes.js`
- `baseline.controller.js`
- `baseline.validation.js`
- `baseline.service.js`

Endpoints:
- `GET /api/baselines`
- `GET /api/baselines/:service`
- `POST /api/baselines/:service`

What it does:
- Reads/writes baseline JSON files.
- Validates baseline values (`avgLatency`, `p95Latency` >= 0).
- Lists known baseline services.
- Enforces safe service naming.

---

## 8.4 Perf module (`/api/perf`)

Files:
- `perf.routes.js`
- `perf.controller.js`
- `perf.validation.js`
- `perf.service.js`
- `perf.model.js`

Endpoints:
- `POST /api/perf`
- `GET /api/perf/timeseries`

Use case:
- Ingest and retrieve lower-level machine counters (CPU cycles, cache misses, instructions), which complement app-level latency metrics.

---

## 8.5 Report module (`/api/reports`)

Files:
- `report.routes.js`
- `report.controller.js`
- `report.service.js`
- `report.model.js`

Endpoints:
- `POST /api/reports/:service` create/save report
- `GET /api/reports/:service` list recent reports

Report generation combines:
- latest Analysis snapshot
- baseline (if exists)
- regression count (last 1 hour)
- latest Perf counters

This gives a compact “executive summary” per service at report time.

---

## 8.6 Dashboard module (`/api/dashboard`)

Files:
- `dashboard.routes.js`
- `dashboard.controller.js`
- `dashboard.service.js`

Endpoints:
- `GET /api/dashboard/overview/:service`
- `GET /api/dashboard/system-health`
- `GET /api/dashboard/latency-chart/:service?range=1h|6h|24h`

What it returns:
- overview merges analysis + regressions + perf + report + baseline.
- system-health provides quick per-service latency values.
- latency-chart provides time-series points from analysis snapshots.

---

## 8.7 Analysis + Regression (internal intelligence)

No direct public route module; used heavily by worker.

### Analysis (`analysis.service.js`)
- For a service and window, computes:
  - avg latency
  - p95 latency
  - request count
- Uses aggregation only (no full raw data load into memory).

### Regression detection (`regression.service.js`)
Hybrid logic:
1. Compute statistical baseline from up to 30 prior Analysis snapshots (needs at least 10).
2. Compute z-score:
   - warning when $z \ge 2$
   - critical when $z \ge 3$
3. Compare against Git baseline if available.
4. If baseline deviation is >= 20%, severity can be escalated.

This is stronger than single-threshold alerting because it combines trend statistics + expected target deviation.

---

## 9) Background worker: how continuous analysis works

File: `src/workers/analysis.worker.js`

Run with script: `npm run worker`

Per cycle:
1. Discover services from distinct metric `service` names.
2. For each service, analyze last window.
3. Save snapshot in `Analysis` collection.
4. Detect and store regressions.
5. Generate and store report.

Design benefits:
- Keeps expensive aggregation out of user request path.
- Makes dashboard reads faster because derived data is precomputed.
- Isolates failures (worker logs errors per service and continues).

---

## 10) Error handling strategy

Global handlers in `errorMiddleware.js`:
- `notFound` for unknown routes.
- `errorHandler` normalizes API errors.

Special handling for common DB error types:
- invalid ObjectId (`CastError`) -> 404
- duplicate keys (`11000`) -> 400 with field names
- Mongoose validation errors -> 400 combined message

Response format includes stack trace only outside production.

---

## 11) Libraries used and why

From `backend/package.json` dependencies:

- **express**: HTTP API framework.
- **mongoose**: MongoDB object modeling, schema, validation hooks, indexes.
- **dotenv**: env var loading from `.env`.
- **jsonwebtoken**: JWT create/verify for auth.
- **cookie-parser**: read cookies for token auth.
- **bcryptjs**: password hashing and compare.
- **joi**: request schema validation.
- **express-async-handler**: cleaner async route error propagation.
- **express-rate-limit**: brute-force/DDoS mitigation on auth routes.
- **helmet**: secure HTTP headers.
- **cors**: cross-origin policy enforcement.
- **axios**: used in helper scripts / integrations.

Why this stack makes sense:
- It is lightweight and proven for REST APIs.
- It balances developer speed (Express/Mongoose) with safety (Joi/helmet/rate-limit).
- It supports both real-time ingestion and periodic analytics efficiently.

---

## 12) How data is “taken and handled” end-to-end

Example ingestion-to-alert flow:

1. A service sends metric:
   - service name, endpoint, latency, status, optional CPU/memory.
2. API validates input (Joi) and stores Metric document.
3. Worker runs on interval:
   - groups recent metrics by service window
   - computes avg/p95/request count
   - writes Analysis snapshot
4. Worker checks regression:
   - statistical z-score vs historical snapshots
   - baseline deviation vs Git baseline
5. If bad trend:
   - creates Regression event with severity
6. Worker generates Report summary.
7. Dashboard endpoints read snapshots/events/reports for UI.

So raw telemetry becomes derived insights in stages:

**Metric -> Analysis -> Regression/Report -> Dashboard APIs**

---

## 13) Setup: how to run backend correctly

### Minimal local setup
1. `cd backend`
2. `npm install`
3. Create `.env` (or copy `.env.example`) with:
   - `NODE_ENV=development`
   - `PORT=5000`
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
4. Start API: `npm run dev`
5. (Recommended) Start worker separately: `npm run worker`

### Available scripts
- `npm start` -> runs `src/server.js`
- `npm run dev` -> watch mode server
- `npm run worker` -> background analysis worker

### Health checks
- API liveness: `GET /health`
- Root in dev: `GET /` returns `API is running....`

---

## 14) Things to know if you’re new to this codebase

1. **Worker is optional but important**: without worker, ingestion works but analysis/regression/report freshness drops.
2. **Baselines are file-based, not DB-based**: stored as JSON, intended to be Git-tracked.
3. **Auth uses cookies** in current middleware implementation.
4. **Service discovery is automatic**: if a new service sends metrics, it appears in system processing.
5. **Most analytics are aggregation-first**: optimized to avoid loading huge raw datasets.

---

## 15) Backend folder map with role summary

- `src/server.js` - process lifecycle, startup, graceful shutdown
- `src/app.js` - middleware + route registration
- `src/config/` - env/db/worker settings
- `src/middleware/` - auth/cors/error control
- `src/modules/users/` - auth + profile
- `src/modules/metrics/` - primary ingestion + analytics
- `src/modules/analysis/` - rolling snapshot logic
- `src/modules/regression/` - regression detection logic
- `src/modules/baseline/` - JSON baseline management
- `src/modules/perf/` - CPU-level counters
- `src/modules/report/` - aggregated report generation/history
- `src/modules/dashboard/` - frontend-facing consolidated views
- `src/workers/analysis.worker.js` - recurring background computation
- `src/utils/generateToken.js` - JWT cookie issuer
- `baselines/` - baseline JSON files (initially empty)

---

## 16) Final mental model

If you remember only one diagram in your head, use this:

1. **API receives telemetry** (metrics/perf)
2. **Mongo stores raw data**
3. **Worker transforms raw -> intelligence**
4. **Dashboard/report APIs serve intelligence**
5. **Baselines provide expected targets** for regression context

That is the core of PerfSight backend.

---

## 17) Required fields by endpoint (what is mandatory, why, and how used)

Below is the exact practical view you asked for: field-level requirements + purpose.

### 17.1 Authentication endpoints

#### `POST /api/users` (register)
- Required:
   - `name` (string, 2..50): used as display/profile identity.
   - `email` (valid email): unique login identifier; normalized to lowercase.
   - `password` (string, 6..128): authentication secret, hashed before save.
- Why these fields exist:
   - `email` is the canonical unique credential.
   - `password` is never stored plain; bcrypt hash is persisted.

#### `POST /api/users/auth` (login)
- Required:
   - `email`
   - `password`
- Why:
   - backend verifies user identity and sets `jwt` cookie for future protected calls.

#### `PUT /api/users/profile` (update profile)
- Required: at least one of:
   - `name` or `email` or `password`
- Why:
   - avoids empty update calls.
   - supports partial updates while preserving current fields.

---

### 17.2 Metrics ingestion and analytics

#### `POST /api/metrics`
- Required:
   - `service` (string): logical service key (e.g., `auth-service`).
   - `endpoint` (string): route path for endpoint-level analytics.
   - `latency` (number): core performance signal (ms).
   - `statusCode` (integer): success/error classification.
- Optional:
   - `memory` (number): memory context for troubleshooting.
   - `cpu` (number): CPU context for latency spikes.
   - `timestamp` (date): caller-supplied event time; defaults to now.

How each required field is used:
- `service`: partitioning key for dashboards, worker loops, and aggregation filters.
- `endpoint`: grouping key for endpoint summary.
- `latency`: used in mean/p95/regression calculations.
- `statusCode`: used for error-rate calculations (`>= 400` considered error).

#### `GET /api/metrics/recent`
- Query params:
   - Optional: `service`, `endpoint`, `limit`.
- Why:
   - quick recent logs for a service/route.
   - `limit` is clamped to `1..500` to protect DB and API latency.

#### `GET /api/metrics/timeseries`
#### `GET /api/metrics/endpoint-summary`
#### `GET /api/metrics/overview`
- Required query:
   - `service`
   - `startTime` (ISO date)
   - `endTime` (ISO date)
- Optional query:
   - `interval` for timeseries: `minute | 5minute | hour`
- Why:
   - analytics are time-window based and service-scoped.

---

### 17.3 Baselines

#### `POST /api/baselines/:service`
- Required body:
   - `avgLatency` (number >= 0)
   - `p95Latency` (number >= 0)
- Why:
   - baseline is a reference target for expected healthy performance.
   - both average and tail-latency targets are required for meaningful comparison.

#### `GET /api/baselines/:service` and `GET /api/baselines`
- No body required.
- Why:
   - reads service-specific or global baseline availability.

---

### 17.4 Perf counters

#### `POST /api/perf`
- Required:
   - `service`
   - `cpuCycles`
   - `cacheMisses`
   - `instructions`
- Optional:
   - `timestamp`
- Why:
   - these counters help correlate infra-level behavior with latency degradation.

#### `GET /api/perf/timeseries`
- Required query:
   - `service`, `startTime`, `endTime`
- Why:
   - returns low-level counter trend for a specific service/time window.

---

### 17.5 Reports and dashboard

#### `POST /api/reports/:service`
- Required path param:
   - `service`
- Why:
   - generates a report snapshot for that one service.

#### `GET /api/reports/:service`
- Required path param:
   - `service`
- Optional query:
   - `limit` (defaults 10)

#### `GET /api/dashboard/overview/:service`
- Required path param:
   - `service`

#### `GET /api/dashboard/latency-chart/:service`
- Required path param:
   - `service`
- Optional query:
   - `range` in `1h | 6h | 24h` (default `1h`)

#### `GET /api/dashboard/system-health`
- No params.

---

### 17.6 Required auth transport detail

For protected routes, practical requirement is:
- valid JWT in `jwt` cookie (HTTP-only), not request body.

This is important because the middleware reads `req.cookies.jwt` and verifies it using `JWT_SECRET`.

---

## 18) What “service” means and why it is central

`service` is the **core dimension key** in this backend.

It is used to:
1. group incoming metrics by system component (`auth-service`, `payment-service`, etc.),
2. drive worker discovery (`Metric.distinct('service')`),
3. scope all analysis windows,
4. isolate regressions per component,
5. generate per-service reports,
6. fetch per-service dashboard panels.

Without `service`, you would only get a mixed global blob of metrics with no actionable ownership.

---

## 19) Exact logic and algorithms used (with formulas)

### 19.1 Average latency

For a set of latencies $L = \{l_1, l_2, ..., l_n\}$:

$$
\mathrm{avgLatency} = \frac{1}{n}\sum_{i=1}^{n} l_i
$$

Used in:
- analysis snapshots,
- overview APIs,
- regression detection input,
- report summaries.

### 19.2 p95 latency

Primary method (Mongo 7+): `$percentile` with $p=0.95$.

Fallback method (older Mongo):
1. sort latencies ascending,
2. index = $\lfloor 0.95 \times n \rfloor$,
3. p95 = value at that index.

Why p95 matters:
- averages can hide tail spikes; p95 exposes user experience degradation in slower requests.

### 19.3 Error rate (endpoint summary)

Errors counted when `statusCode >= 400`.

$$
\mathrm{errorRate}(\%) = \frac{\mathrm{errorCount}}{\mathrm{requestCount}} \times 100
$$

### 19.4 Time bucketing for charts

Uses Mongo `$dateTrunc` with configured unit/bin size:
- `minute` -> 1-minute buckets,
- `5minute` -> 5-minute buckets,
- `hour` -> hourly buckets.

Why:
- stable chart points with predictable granularity and faster grouped queries.

### 19.5 Statistical baseline (regression service)

Regression uses previous Analysis snapshots (up to 30 before current window; minimum 10).

Given baseline set $B = \{b_1, ..., b_n\}$:

$$
\mu = \frac{1}{n}\sum_{i=1}^{n} b_i
$$

$$
\sigma = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(b_i - \mu)^2}
$$

For current value $x$:

$$
z = \frac{x - \mu}{\sigma}
$$

Severity thresholds in code:
- `warning` if $z \ge 2$
- `critical` if $z \ge 3$

### 19.6 Git baseline deviation

If a baseline JSON exists with `baseline.avgLatency`:

$$
\mathrm{baselineDeviation} = \frac{\mathrm{currentAvgLatency} - \mathrm{baselineAvgLatency}}{\mathrm{baselineAvgLatency}}
$$

Hybrid escalation rule:
- if baseline deviation $\ge 0.20$ (20%), severity can be escalated:
   - warning -> critical
   - normal -> warning

This is the “hybrid” algorithm: statistical anomaly + business target deviation.

---

## 20) Service-wise logic: what each service does internally

### 20.1 Users service logic
- validates payload (Joi),
- normalizes email,
- hashes password in model hook,
- on success sets secure JWT cookie,
- for profile updates, enforces email uniqueness before save.

### 20.2 Metrics service logic
- ingestion stores raw metric quickly,
- read APIs perform aggregation pipelines (no raw full-scan in app memory),
- analytics depend on service + time filters,
- response values are rounded where needed for dashboard readability.

### 20.3 Baseline service logic
- sanitizes service name to `[a-zA-Z0-9_-]` only,
- resolves path safely under baselines dir,
- ensures directory exists,
- reads/writes JSON atomically through filesystem APIs.

### 20.4 Perf service logic
- stores counters with timestamps,
- returns sorted timeseries mapped to chart-friendly keys.

### 20.5 Report service logic
- composes one report from multiple sources:
   - latest analysis,
   - baseline (if exists),
   - regressions count in last hour,
   - latest perf counters,
- persists snapshot for historical report timeline.

### 20.6 Dashboard service logic
- `overview`: merges latest entities from multiple collections,
- `system-health`: lists all known services (from `Analysis.distinct`),
- `latency-chart`: returns recent analysis points for selected range.

### 20.7 Worker orchestration logic
- loops through discovered services each interval,
- isolates per-service failure with try/catch so one bad service does not stop entire cycle,
- for each service does: analysis -> regression -> report.

---

## 21) Decision rules, thresholds, and guardrails

1. Auth brute-force guard:
    - max 20 auth-route hits / 15 minutes.

2. Input guards:
    - Joi schemas reject invalid/missing fields.
    - analytics query schemas reject unknown query params.

3. Request-size guard:
    - payload limit 10kb.

4. Analytics safety:
    - recent metrics `limit` clamped to 500 max.

5. Regression guard conditions:
    - needs enough historical snapshots (>=10),
    - requires non-zero std dev,
    - skips regression if baseline/stat context is insufficient.

6. Baseline file safety:
    - service sanitization + path containment check prevents traversal.

---

## 22) Edge cases and how backend handles them

- No metrics in DB:
   - worker logs and skips cycle safely.

- New service with too little history:
   - analysis may exist, regression may be skipped until history is enough.

- Missing baseline file:
   - regression/report continue without baseline comparison.

- Unsupported Mongo percentile operator:
   - falls back to deterministic sorted-array percentile logic.

- Duplicate user email:
   - handled as 400 with readable duplicate-field message.

- Invalid ObjectId or validation errors:
   - normalized by global error middleware.

---

## 23) File created by this explanation task

This document: `Docs/Backend_Deep_Dive_Guide.md`

You can share this with any new teammate as a backend onboarding doc.
