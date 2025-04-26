import * as Joi from 'joi';

export function validateEnv(config: Record<string, unknown>) {
  const schema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_API_PORT: Joi.number().default(3000),
    APP_NAME: Joi.string().required(),
    APP_ACCESS_KEY: Joi.string().required(),
    APP_HTTP_ACCESS_KEY: Joi.string().required(),
  });

  const { error, value } = schema.validate(config, { allowUnknown: true });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
