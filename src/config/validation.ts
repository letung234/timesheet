import * as Joi from 'joi';
interface EnvConfig {
  // appConfig
  APP_PORT: number;
  APP_NAME: string;
  URL_CLIENT: string;

  // dataConfig
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASS: string;
  DATABASE_NAME: string;
  DATABASE: string;
  DATABASE_SSL: boolean;

  // jwtConfig
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // cloudinaryConfig
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

export const validateEnv = (): Joi.ObjectSchema<EnvConfig> => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),

    APP_NAME: Joi.string().required(),
    APP_PORT: Joi.number().default(3000),
    URL_CLIENT: Joi.string(),

    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASS: Joi.string().required(),
    DATABASE: Joi.string().required(),
    DATABASE_SSL: Joi.boolean(),

    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('3600s'),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
  });
};
