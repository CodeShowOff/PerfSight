// Data retention / TTL configuration
//
// This config is intentionally lightweight and reads directly from process.env
// so models can import it without creating circular dependencies.

const DEFAULT_DATA_RETENTION_DAYS = 30;

const parsePositiveInt = (value, fallback) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (Number.isFinite(n) && n > 0) return n;
  return fallback;
};

const dataRetentionDays = parsePositiveInt(
  process.env.DATA_RETENTION_DAYS,
  DEFAULT_DATA_RETENTION_DAYS
);

const dataRetentionSeconds = dataRetentionDays * 24 * 60 * 60;

export default {
  dataRetentionDays,
  dataRetentionSeconds,
};
