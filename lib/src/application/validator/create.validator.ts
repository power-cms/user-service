import * as Joi from 'joi';

export const validator = Joi.object().keys({
  username: Joi.string()
    .trim()
    .min(3)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  avatar: Joi.string()
    .trim()
    .uri(),
});
