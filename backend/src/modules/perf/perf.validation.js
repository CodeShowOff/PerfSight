import Joi from 'joi';

const perfMetricSchema = Joi.object({
  service: Joi.string().required(),
  cpuCycles: Joi.number().required(),
  cacheMisses: Joi.number().required(),
  instructions: Joi.number().required(),
  timestamp: Joi.date().optional(),
});

const validatePerfMetric = (req, res, next) => {
  const { error } = perfMetricSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }

  next();
};

const perfTimeseriesQuerySchema = Joi.object({
  service: Joi.string().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
});

const validatePerfTimeseriesQuery = (req, res, next) => {
  const { error, value } = perfTimeseriesQuerySchema.validate(req.query, {
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

export { validatePerfMetric, validatePerfTimeseriesQuery };
