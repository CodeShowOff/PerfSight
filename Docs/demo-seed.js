/**
 * PerfSight Professor Demo Seeder
 *
 * Creates (or logs into) a demo user and seeds 30 days of sample data:
 * - Latency metrics -> POST /api/metrics
 * - Perf telemetry  -> POST /api/perf
 * - Baselines       -> POST /api/baselines/:service (computed from last 24h overview)
 *
 * Default demo credentials (override via env):
 *   DEMO_EMAIL=shubham@gmail.com
 *   DEMO_PASSWORD=Pass123@
 *
 * Usage:
 *   node demo-seed.js
 *
 * Optional env:
 *   API_ROOT=http://localhost:5000
 *   DEMO_NAME=Shubham
 *   DEMO_EMAIL=...
 *   DEMO_PASSWORD=...
 *   SEED_DAYS=30
 *   CONCURRENCY=2
 */

const API_ROOT = (process.env.API_ROOT || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/api`;

const DEMO_NAME = process.env.DEMO_NAME || 'Shubham';
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'shubham@gmail.com';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Pass123@';

const SEED_DAYS = Number.parseInt(process.env.SEED_DAYS || '30', 10);
// Keep concurrency intentionally low by default to avoid transient connection resets
// on some local dev setups (Windows + watch mode can be surprisingly spiky).
const CONCURRENCY = Number.parseInt(process.env.CONCURRENCY || '2', 10);

const services = [
  'api-gateway',
  'auth-service',
  'user-service',
  'payment-service',
  'notification-service',
];

const endpoints = [
  '/health',
  '/login',
  '/register',
  '/profile',
  '/orders',
  '/payments',
  '/notifications',
  '/search',
];

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randPick = (arr) => arr[randInt(0, arr.length - 1)];

const ms = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
};

const makeLatencySample = (service) => {
  // Give each service a different "personality".
  const base = {
    'api-gateway': 35,
    'auth-service': 55,
    'user-service': 45,
    'payment-service': 120,
    'notification-service': 80,
  }[service] ?? 50;

  const jitter = randInt(-10, 25);
  const latency = Math.max(5, base + jitter + Math.random() * 10);

  const errorRoll = Math.random();
  const statusCode = errorRoll < 0.92 ? 200 : errorRoll < 0.97 ? 400 : 500;

  return {
    latency: Number(latency.toFixed(2)),
    statusCode,
    memory: randInt(120, 700),
    cpu: Number((Math.random() * 45).toFixed(2)),
  };
};

const makePerfSample = () => {
  const cpuCycles = randInt(800_000_000, 6_000_000_000);
  const instructions = randInt(1_200_000_000, 12_000_000_000);
  const cacheMisses = randInt(100_000, 8_000_000);

  return { cpuCycles, instructions, cacheMisses };
};

const promisePool = async (items, concurrency, handler) => {
  const safeConcurrency = Number.isFinite(concurrency) && concurrency > 0 ? concurrency : 10;
  let index = 0;
  let ok = 0;
  let failed = 0;

  const workers = Array.from({ length: safeConcurrency }, async () => {
    while (true) {
      const i = index++;
      if (i >= items.length) return;

      try {
        await handler(items[i]);
        ok++;
      } catch {
        failed++;
      }
    }
  });

  await Promise.all(workers);
  return { ok, failed };
};

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const requestJson = async (path, { method = 'GET', token, body, params, timeoutMs = 25_000 } = {}) => {
  const url = new URL(`${API_BASE}${path}`);
  if (params && typeof params === 'object') {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const message =
        (data && typeof data === 'object' && (data.message || data.error))
          ? (data.message || data.error)
          : `Request failed: ${res.status}`;
      throw new ApiError(message, res.status, data);
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
};

const ensureDemoLogin = async () => {
  try {
    const res = await requestJson('/users/auth', {
      method: 'POST',
      body: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });

    return {
      token: res?.token,
      userId: res?._id,
      email: res?.email,
      name: res?.name,
      isNew: false,
    };
  } catch (err) {
    const status = err?.status;
    if (status !== 401 && status !== 400) {
      throw err;
    }
  }

  // Register if login failed.
  const registerRes = await requestJson('/users', {
    method: 'POST',
    body: {
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    },
  });

  return {
    token: registerRes?.token,
    userId: registerRes?._id,
    email: registerRes?.email,
    name: registerRes?.name,
    isNew: true,
  };
};

const seed = async () => {
  console.log('🧪 PerfSight Demo Seeder');
  console.log('=======================');
  console.log(`API: ${API_BASE}`);
  console.log(`User: ${DEMO_EMAIL}`);
  console.log(`Days: ${SEED_DAYS}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log('');

  const auth = await ensureDemoLogin();

  if (!auth.token || !auth.userId) {
    throw new Error('Failed to obtain demo auth token/user id');
  }

  console.log(auth.isNew ? '✅ Demo user created' : '✅ Demo user logged in');
  console.log(`userId: ${auth.userId}`);
  console.log('');
  const token = auth.token;

  // Build metric events across SEED_DAYS.
  const now = Date.now();
  const metricEvents = [];

  // Historical: a few points per service per day.
  for (let d = 0; d < SEED_DAYS; d++) {
    for (const service of services) {
      const pointsToday = 3;
      for (let i = 0; i < pointsToday; i++) {
        const ts = new Date(now - d * ms.day - randInt(0, 20) * ms.hour - randInt(0, 59) * ms.minute);

        const sample = makeLatencySample(service);
        metricEvents.push({
          service,
          endpoint: randPick(endpoints),
          ...sample,
          timestamp: ts.toISOString(),
        });
      }
    }
  }

  // Recent: dense points in the last ~45 seconds so the analysis worker (1-minute window)
  // will immediately create Analysis snapshots.
  for (const service of services) {
    const recentPoints = 40;
    for (let i = 0; i < recentPoints; i++) {
      const ts = new Date(now - randInt(0, 45 * 1000));
      const sample = makeLatencySample(service);
      metricEvents.push({
        service,
        endpoint: randPick(endpoints),
        ...sample,
        timestamp: ts.toISOString(),
      });
    }
  }

  console.log(`📤 Sending latency metrics: ${metricEvents.length}`);
  const metricsResult = await promisePool(metricEvents, CONCURRENCY, (evt) =>
    requestJson('/metrics', { method: 'POST', token, body: evt })
  );
  console.log(`✅ Metrics: ok=${metricsResult.ok} failed=${metricsResult.failed}`);

  // Perf telemetry (recent only).
  const perfEvents = [];
  for (const service of services) {
    const perService = 30;
    for (let i = 0; i < perService; i++) {
      const ts = new Date(now - randInt(0, 60 * ms.minute));
      perfEvents.push({
        service,
        ...makePerfSample(),
        timestamp: ts.toISOString(),
      });
    }
  }

  console.log(`\n📤 Sending perf telemetry: ${perfEvents.length}`);
  const perfResult = await promisePool(perfEvents, CONCURRENCY, (evt) =>
    requestJson('/perf', { method: 'POST', token, body: evt })
  );
  console.log(`✅ Perf: ok=${perfResult.ok} failed=${perfResult.failed}`);

  // Final tiny burst "right now" for guaranteed worker pickup.
  console.log('\n⚡ Sending final live burst (for worker pickup)...');
  for (const service of services) {
    const sample = makeLatencySample(service);
    await requestJson('/metrics', {
      method: 'POST',
      token,
      body: {
        service,
        endpoint: '/health',
        latency: sample.latency,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      },
    });
  }
  console.log('✅ Live burst sent');

  // Baselines: compute from last 24h raw metrics overview.
  console.log('\n🎯 Setting baselines from last 24h overview...');
  const endTime = new Date(now).toISOString();
  const startTime = new Date(now - 24 * ms.hour).toISOString();

  let baselinesOk = 0;
  let baselinesFailed = 0;

  for (const service of services) {
    try {
      const overviewRes = await requestJson('/metrics/overview', {
        method: 'GET',
        token,
        params: { service, startTime, endTime, interval: 'minute' },
      });

      const overview = overviewRes?.data;
      const avgLatency = overview?.avgLatency;
      const p95Latency = overview?.p95Latency;

      if (!Number.isFinite(avgLatency) || !Number.isFinite(p95Latency)) {
        console.log(`• ${service}: skipped (no overview stats)`);
        continue;
      }

      await requestJson(`/baselines/${encodeURIComponent(service)}`, {
        method: 'POST',
        token,
        body: { avgLatency, p95Latency },
      });

      console.log(`• ${service}: baseline set (avg=${avgLatency.toFixed(2)}ms, p95=${p95Latency.toFixed(2)}ms)`);
      baselinesOk++;
    } catch (err) {
      const msg = err?.message || 'Request failed';
      console.log(`• ${service}: failed (${msg})`);
      baselinesFailed++;
    }
  }

  console.log('\n=======================');
  console.log('✅ Demo seed complete');
  console.log('=======================');
  console.log(`Baselines set: ${baselinesOk}${baselinesFailed ? ` (failed: ${baselinesFailed})` : ''}`);
  console.log('');
  console.log('Login to the UI with:');
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log('');
  console.log('Try these pages:');
  console.log('  http://localhost:3000/dashboard');
  console.log('  http://localhost:3000/perf');
  console.log('  http://localhost:3000/baselines');
  console.log('');
  console.log('Baselines are stored in MongoDB (via POST /api/baselines/:service).');
};

seed().catch((err) => {
  const msg = err?.message || 'Seeder failed';
  console.error('❌ Seeder failed:', msg);
  process.exit(1);
});
