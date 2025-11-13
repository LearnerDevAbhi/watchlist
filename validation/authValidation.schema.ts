import Joi from 'joi';

export const loginAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().token().required()
});

