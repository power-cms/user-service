import * as Joi from 'joi';

export const validator = Joi.object().keys({
  roles: Joi.array().required(),
});
