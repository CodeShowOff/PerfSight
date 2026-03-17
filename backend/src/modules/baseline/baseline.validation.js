import Joi from 'joi';

const baselineSchema = Joi.object({
  avgLatency: Joi.number().min(0).required(),
  p95Latency: Joi.number().min(0).required(),
});

const validateBaseline = (req, res, next) => {
  const { error } = baselineSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }

  next();
};

export { validateBaseline };
