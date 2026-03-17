import Joi from 'joi';

const metricSchema = Joi.object({
  service: Joi.string().required(),
  endpoint: Joi.string().required(),
  latency: Joi.number().required(),
  memory: Joi.number().optional(),
  cpu: Joi.number().optional(),
  statusCode: Joi.number().integer().required(),
  timestamp: Joi.date().optional(),
});

const validateMetric = (req, res, next) => {
  const { error } = metricSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }

  next();
};

/* ─────────────────────────────────────────────
 *  Analytics query-param validation
 * ───────────────────────────────────────────── */

const analyticsQuerySchema = Joi.object({
  service: Joi.string().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  interval: Joi.string()
    .valid('minute', '5minute', 'hour')
    .default('minute'),
});

const validateAnalyticsQuery = (req, res, next) => {
  const { error, value } = analyticsQuerySchema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }

  req.query = value;
  next();
};

export { validateMetric, validateAnalyticsQuery };

